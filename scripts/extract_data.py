import nflreadpy as nfl 

def extract_data():
    """
    Extract season-level metrics for one NFL season.

    Output:
        qb_data_by_season -> regular-season QB rows for a single season
    """
    nfl_seasons = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]

    qb_data_by_season = {}

    for nfl_season in nfl_seasons:
        df = nfl.load_player_stats([nfl_season]).to_pandas()
        df.to_csv(f"../data/raw/player_stats_{nfl_season}_season.csv", index=False)
        qb_df = df[df["position"]=="QB"]

        qb_data_by_season[nfl_season] = qb_df

    return qb_data_by_season



