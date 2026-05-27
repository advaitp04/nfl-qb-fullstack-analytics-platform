from pathlib import Path
import pandas as pd

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "processed" / "qb_master.csv"

situational_metric_cols = [
    "redzone_td_rate",
    "third_down_regular_conversion_rate",
    "third_and_long_conversion_rate",
    "third_down_conversion_rate",
]

def load_data():
    df = pd.read_csv(DATA_PATH)

    # These columns can be missing when a QB does not have enough qualifying plays.
    existing_metric_cols = [
        col for col in situational_metric_cols if col in df.columns
    ]

    df[existing_metric_cols] = df[existing_metric_cols].fillna(0)

    return df

def get_qbs():
    df = load_data()
    return df.head(100).to_dict(orient="records")

def get_cortisol_rankings():
    df = load_data()

    score_col = (
        "adjusted_cortisol_score"
        if "adjusted_cortisol_score" in df.columns
        else "cortisol_score"
    )

    return (
        df.sort_values(score_col, ascending=False)
        .head(50)
        .to_dict(orient="records")
    )

def get_cortisol_rankings_by_season(season: int):
    df = load_data()
    score_col = "adjusted_cortisol_score" if "adjusted_cortisol_score" in df.columns else "cortisol_score"

    if "season" in df.columns:
        df = df[df["season"] == season]

    return (
        df.sort_values(score_col, ascending=False)
        .head(50)
        .to_dict(orient="records")
    )

def get_qb_by_name(name: str):
    df = load_data()

    name_col = (
        "player_display_name"
        if "player_display_name" in df.columns
        else "player_name"
    )

    result = df[
        df[name_col]
        .astype(str)
        .str.lower()
        .str.contains(name.lower(), na=False)
    ]

    return result.to_dict(orient="records")

