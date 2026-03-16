import pandas as pd 
import numpy as np
from extract_data import extract_data

def build_qb_metrics(qb_df):
    """
    Build season-level QB metrics for one NFL season.

    Input:
        qb_df -> regular-season QB rows for a single season

    Output:
        qb_season_stats -> one row per QB/team/season with derived metrics
    """

    qb_season_stats = (
        qb_df
        .groupby(
            [
                "player_id",
                "player_name",
                "player_display_name",
                "headshot_url",
                "season",
                "season_type",
                "team",
            ],
            as_index=False
        )
        .agg(
            total_passing_yds=("passing_yards", "sum"),
            total_passing_tds=("passing_tds", "sum"),
            total_rushing_tds=("rushing_tds", "sum"),
            total_attempts=("attempts", "sum"),
            total_completions=("completions", "sum"),
            total_carries=("carries", "sum"),
            total_ints=("passing_interceptions", "sum"),
            total_sack_fumbles=("sack_fumbles", "sum"),
            total_sack_fumbles_lost=("sack_fumbles_lost", "sum"),
            total_rushing_fumbles=("rushing_fumbles", "sum"),
            total_rushing_fumbles_lost=("rushing_fumbles_lost", "sum"),
            total_sacks=("sacks_suffered", "sum"),
            total_sack_yds_lost=("sack_yards_lost", "sum"),
            total_air_yds=("passing_air_yards", "sum"),
            total_epa=("passing_epa", "sum"),
            total_first_downs=("passing_first_downs", "sum"),
            total_2pt_passing_convs=("passing_2pt_conversions", "sum"),
            total_2pt_rushing_convs=("rushing_2pt_conversions", "sum"),
            total_fantasy_points=("fantasy_points", "sum"),
        )
    )

    # Volume stats
    qb_season_stats["total_tds"] = (
        qb_season_stats["total_passing_tds"] + qb_season_stats["total_rushing_tds"]
    )

    qb_season_stats["total_fumbles_lost"] = (
        qb_season_stats["total_sack_fumbles_lost"]
        + qb_season_stats["total_rushing_fumbles_lost"]
    )

    qb_season_stats["total_turnovers"] = (
        qb_season_stats["total_ints"] + qb_season_stats["total_fumbles_lost"]
    )

    qb_season_stats["total_dropbacks"] = (
        qb_season_stats["total_attempts"] + qb_season_stats["total_sacks"]
    )

    # Safe denominators
    attempts_den = qb_season_stats["total_attempts"].replace(0, np.nan)
    sacks_den = qb_season_stats["total_sacks"].replace(0, np.nan)
    dropbacks_den = qb_season_stats["total_dropbacks"].replace(0, np.nan)

    # Rate / efficiency metrics
    qb_season_stats["int_rate"] = qb_season_stats["total_ints"] / attempts_den

    qb_season_stats["fumble_lost_rate"] = (
        qb_season_stats["total_fumbles_lost"] / dropbacks_den
    )

    qb_season_stats["first_down_rate"] = (
        qb_season_stats["total_first_downs"] / attempts_den
    )

    qb_season_stats["completion_rate"] = (
        qb_season_stats["total_completions"] / attempts_den
    )

    qb_season_stats["sack_rate"] = (
        qb_season_stats["total_sacks"] / dropbacks_den
    )

    qb_season_stats["sack_yards_per_sack"] = (
        qb_season_stats["total_sack_yds_lost"] / sacks_den
    )

    qb_season_stats["td_per_attempt"] = (
        qb_season_stats["total_tds"] / attempts_den
    )

    qb_season_stats["epa_per_dropback"] = (
        qb_season_stats["total_epa"] / dropbacks_den
    )

    qb_season_stats["yards_per_attempt"] = (
        qb_season_stats["total_passing_yds"] / attempts_den
    )

    # Replace NaNs caused by divide-by-zero edge cases
    rate_cols = [
        "int_rate",
        "fumble_lost_rate",
        "first_down_rate",
        "completion_rate",
        "sack_rate",
        "sack_yards_per_sack",
        "td_per_attempt",
        "epa_per_dropback",
        "yards_per_attempt",
    ]
    qb_season_stats[rate_cols] = qb_season_stats[rate_cols].fillna(0)

    return qb_season_stats