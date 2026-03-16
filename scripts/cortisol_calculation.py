import numpy as np
import pandas as pd


def min_max_normalize(series: pd.Series) -> pd.Series:
    """
    Min-max normalize a pandas Series to [0, 1].
    If all values are the same, return 0.5 for all rows.
    """
    min_val = series.min()
    max_val = series.max()

    if pd.isna(min_val) or pd.isna(max_val):
        return pd.Series(0.0, index=series.index)

    if max_val == min_val:
        return pd.Series(0.5, index=series.index)

    return (series - min_val) / (max_val - min_val)


def cortisol_calculation(
    qb_season_stats: pd.DataFrame,
    min_dropbacks: int = 1,
    k: int = 400
) -> pd.DataFrame:
    """
    Calculate normalized sub-scores and final cortisol score for one season.

    Inputs:
        qb_season_stats -> output of build_qb_metrics for one season
        min_dropbacks   -> optional filter threshold
        k               -> shrinkage constant for low-volume QBs

    Output:
        DataFrame with normalized columns, component scores,
        raw cortisol score, and adjusted cortisol score
    """

    df = qb_season_stats.copy()

    # Optional phase-1 threshold to avoid tiny-sample noise
    df = df[df["total_dropbacks"] >= min_dropbacks].copy()

    # Normalize metrics within the season
    # Good metrics: higher is better
    df["first_down_rate_norm"] = min_max_normalize(df["first_down_rate"])
    df["completion_rate_norm"] = min_max_normalize(df["completion_rate"])
    df["td_per_attempt_norm"] = min_max_normalize(df["td_per_attempt"])
    df["epa_per_dropback_norm"] = min_max_normalize(df["epa_per_dropback"])
    df["yards_per_attempt_norm"] = min_max_normalize(df["yards_per_attempt"])

    # Bad metrics: lower is better, so invert after normalization
    df["int_rate_norm"] = 1 - min_max_normalize(df["int_rate"])
    df["fumble_lost_rate_norm"] = 1 - min_max_normalize(df["fumble_lost_rate"])
    df["sack_rate_norm"] = 1 - min_max_normalize(df["sack_rate"])

    # For sack yards per sack:
    # total_sack_yds_lost is usually negative, so more negative is worse.
    # If your values are negative, higher is already better (-4 better than -8),
    # so standard normalization is fine.
    df["sack_yards_per_sack_norm"] = min_max_normalize(df["sack_yards_per_sack"])

    # Component scores
    df["turnover_score"] = (
        df["int_rate_norm"] + df["fumble_lost_rate_norm"]
    ) / 2

    df["drive_score"] = (
        df["first_down_rate_norm"]
        + df["td_per_attempt_norm"]
        + df["epa_per_dropback_norm"]
    ) / 3

    df["success_score"] = (
        df["completion_rate_norm"]
        + df["sack_rate_norm"]
        + df["sack_yards_per_sack_norm"]
        + df["yards_per_attempt_norm"]
    ) / 4

    # Final raw cortisol score
    df["cortisol_score"] = (
        df["turnover_score"]
        + df["drive_score"]
        + df["success_score"]
    ) / 3

    # Shrink low-volume QBs toward league average
    avg_cortisol_score = df["cortisol_score"].mean()

    df["adjusted_cortisol_score"] = (
        (
            df["cortisol_score"] * df["total_dropbacks"]
        ) + (avg_cortisol_score * k)
    ) / (df["total_dropbacks"] + k)

    # Optional ranking columns
    df["cortisol_rank"] = df["cortisol_score"].rank(
        method="min", ascending=False
    ).astype(int)

    df["adjusted_cortisol_rank"] = df["adjusted_cortisol_score"].rank(
        method="min", ascending=False
    ).astype(int)

    # Sort for convenience
    df = df.sort_values(
        by="adjusted_cortisol_score",
        ascending=False
    ).reset_index(drop=True)

    return df