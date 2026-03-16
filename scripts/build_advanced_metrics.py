import pandas as pd 
import nflreadpy as nfl 

def build_advanced_metrics(season, qb_cortisol_scores: pd.DataFrame, min_dropbacks: int=1):

    """
    Build season-level advanced QB metrics for one NFL season.

    Inputs:
        season -> four digit integer specifying the NFL season
        qb_cortisol_scores -> regular-season QB rows for a single season containing pre-existing grouped data, including cortisol scores, drive scores, turnover scores, offensive scores, and ranks
        min_dropbacks -> QB threshold
    Output:
        qb_master -> master df containing one row per QB/team/season with both advanced metrics & previous cortisol metrics
    """

    pbp = nfl.load_pbp([season])
    pbp = pbp.to_pandas()
    #Filter df by QB's only based on dropbacks (qb_dropback of 1 indicates either a pass, fumble, or sack)
    pbp = pbp[pbp['qb_dropback']==1]
    #Select subset of columns required for computing each advanced metric
    pbp = pbp.rename(columns={'id':'player_id', 'posteam':'team'})
    pbp = pbp[['player_id', 'season', 'season_type','team','qb_epa', 'play_type','down', 'qb_dropback', 'third_down_converted', 'ydstogo', 'yardline_100', 'pass_touchdown']]

    #Helper columns for advanced metrics
    pbp['is_third_down'] = pbp['down']==3
    pbp['is_third_and_long'] =  ((pbp['down'] == 3) & (pbp['ydstogo'] >= 7))
    pbp['is_third_and_long_conversion'] = (pbp['is_third_and_long'] & (pbp['third_down_converted']==1))
    pbp['is_third_down_conversion'] = (pbp['is_third_down'] & (pbp['third_down_converted']==1))
    pbp['is_negative_epa'] = pbp['qb_epa'] < 0
    pbp['is_panic_play'] = ((pbp['qb_epa'] < -1) & (pbp['ydstogo'] >= 7) & (pbp['down'].isin([3,4])))
    pbp['is_redzone'] = pbp['yardline_100'] <= 20
    pbp['is_redzone_td'] = (pbp['is_redzone'] & (pbp['pass_touchdown']==1))

    #group data by player_id and season and sum up values for easier metric calculation
    advanced_metrics = (
    pbp.groupby(
        ['player_id', 'season', 'season_type','team'],
        as_index=False
    )
    .agg(
        total_negative_epa_plays = ("is_negative_epa", "sum"),
        total_panic_plays = ("is_panic_play", "sum"),
        total_third_downs = ("is_third_down", "sum"),
        total_third_downs_converted = ("is_third_down_conversion", "sum"),
        total_dropbacks = ("qb_dropback", "count"),
        total_third_and_long = ("is_third_and_long", "sum"),
        total_third_and_long_converted = ("is_third_and_long_conversion", "sum"),
        total_redzone_attempts = ("is_redzone", "sum"),
        total_redzone_tds = ("is_redzone_td", "sum")
        )
    )
    
    #Filter by dropbacks to remove any outliers 
    advanced_metrics = advanced_metrics[advanced_metrics['total_dropbacks'] >= min_dropbacks]

    #Compute advanced stats
    advanced_metrics['negative_epa_rate'] = advanced_metrics['total_negative_epa_plays'] / advanced_metrics['total_dropbacks']
    advanced_metrics['panic_play_rate'] = advanced_metrics['total_panic_plays'] / advanced_metrics['total_dropbacks']
    advanced_metrics['third_down_conversion_rate'] = advanced_metrics['total_third_downs_converted'] / advanced_metrics['total_third_downs']
    advanced_metrics['third_and_long_conversion_rate'] = advanced_metrics['total_third_and_long_converted'] / advanced_metrics['total_third_and_long']
    advanced_metrics['third_down_regular_attempts'] = advanced_metrics["total_third_downs"] - advanced_metrics["total_third_and_long"]
    advanced_metrics['third_down_regular_conversions'] = advanced_metrics["total_third_downs_converted"] - advanced_metrics["total_third_and_long_converted"]
    advanced_metrics['third_down_regular_conversion_rate'] = advanced_metrics["third_down_regular_conversions"] / advanced_metrics["third_down_regular_attempts"]
    advanced_metrics['redzone_td_rate'] = advanced_metrics['total_redzone_tds'] / advanced_metrics['total_redzone_attempts']

    #Grab advanced stats columns we'll need along with player_id and season keys for joining data 
    advanced_metrics = advanced_metrics[['player_id','season','season_type', 'team','negative_epa_rate', 'panic_play_rate', 'third_down_conversion_rate', 'third_and_long_conversion_rate', 'third_down_regular_attempts','third_down_regular_conversions','third_down_regular_conversion_rate','redzone_td_rate']]

    #round values
    advanced_metrics = advanced_metrics.round({
        "negative_epa_rate": 3,
        "panic_play_rate": 3,
        "third_down_conversion_rate": 3,
        "third_and_long_conversion_rate": 3,
        "third_down_regular_conversion_rate":3,
        "redzone_td_rate": 3
    })

    #join advanced_metrics on existing qb_cortisol_scores df; left join
    qb_master = pd.merge(qb_cortisol_scores, advanced_metrics, on=['player_id', 'season', 'season_type', 'team'], how="left")
    return qb_master