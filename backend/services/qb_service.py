from pathlib import Path
from backend.db.database import engine
from sqlalchemy import text 
import pandas as pd

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "processed" / "qb_master.csv"

situational_metric_cols = [
    "redzone_td_rate",
    "third_down_regular_conversion_rate",
    "third_and_long_conversion_rate",
    "third_down_conversion_rate",
]
advanced_metric_cols = [
    "player_display_name",
    "season", 
    "team",
    "epa_per_dropback",
    "redzone_td_rate",
    "third_down_conversion_rate",
    "third_down_regular_conversion_rate",
    "total_dropbacks",
    "adjusted_cortisol_score",
    "adjusted_cortisol_rank",
    "total_dropbacks",
    "turnover_score",
    "drive_score",
    "success_score",
    "negative_epa_rate",
    "panic_play_rate",
]

allowed_sort_columns = [
    "season",
    "team",
    "player_display_name",
    "total_dropbacks",
    "adjusted_cortisol_score",
    "adjusted_cortisol_rank",
    "cortisol_score",
    "cortisol_rank",
    "epa_per_dropback",
    "negative_epa_rate",
    "panic_play_rate",
    "third_down_conversion_rate",
    "third_and_long_conversion_rate",
    "redzone_td_rate",
]

def query_postgres(query, params=None):
    with engine.connect() as conn:
        return pd.read_sql(text(query), conn, params=params or {})
    
def load_data():
    try:
        df = pd.read_sql("SELECT * FROM qb_metrics", engine)
        print("Loaded data from Postgres")
    except Exception as e:
        df = pd.read_csv(DATA_PATH)
        print(f"Postgres unavailable, falling back to CSV: {e}")
        df = pd.read_csv(DATA_PATH)

    return clean_data(df)

def clean_data(df):
    existing_metric_cols = [
        col for col in situational_metric_cols if col in df.columns
    ]

    df[existing_metric_cols] = df[existing_metric_cols].fillna(0)

    return df.where(pd.notnull(df), None)

def get_qbs(season=None, season_type=None, team=None, limit=100, offset=0, sort_by="adjusted_cortisol_score", sort_order="desc"):
    sort_by, sort_order = validate_sort(sort_by, sort_order)

    try:
        query= f"""
            SELECT *
            FROM qb_metrics
            WHERE (:season IS NULL OR season = :season) AND (:season_type IS NULL OR season_type = :season_type) AND (:team IS NULL OR team = :team)
            ORDER BY {sort_by} {sort_order}
            LIMIT :limit
            OFFSET :offset 
        """

        df = query_postgres(
            query,
            {
                "season":season,
                "season_type": season_type,
                "team": team,
                "limit": limit,
                "offset": offset,
            }
        )

        print("Loaded filtered QB data from Postgres")
    except Exception as e:
        print(f"Postgres unavailable, falling back to CSV: {e}")
        df = pd.read_csv(DATA_PATH)

        if season is not None and "season" in df.columns:
            df = df[df["season"] == season]
        
        if season_type is not None and "season_type" in df.columns:
            df = df[df["season_type"] == season_type]

        if team is not None and "team" in df.columns:
            df = df[df["team"] == team]
        
        ascending = sort_order.lower()=="asc"

        if sort_by in df.columns:
            df = df.sort_values(sort_by, ascending=ascending)

        df = df.iloc[offset: offset + limit]

    return clean_data(df).to_dict(orient="records")

def get_cortisol_rankings_by_season(season=None, season_type=None, limit=50, offset=0):
    score_col = "adjusted_cortisol_score"

    try:
        query= f"""
            SELECT *
            FROM qb_metrics
            WHERE (:season IS NULL or season = :season) AND (:season_type IS NULL or season_type = :season_type)
            ORDER BY {score_col} DESC
            LIMIT :limit 
            OFFSET :offset
        """

        df = query_postgres(
            query, 
            {
                "season": season,
                "season_type": season_type,
                "limit": limit,
                "offset": offset,
            }
        )

        print("Loaded filtered rankings from Postgres")

    except Exception as e:
        print(f"Postgres unavailable, falling back to CSV: {e}")
        df = pd.read_csv(DATA_PATH)

        if season is not None and "season" in df.columns:
            df = df[df["season"] == season]

        if season_type is not None and "season_type" in df.columns:
            df = df[df["season_type"] == season_type]

        df = df.sort_values(score_col, ascending=False)
        df = df.iloc[offset:offset + limit]

    return clean_data(df).to_dict(orient="records")

def get_qb_by_name(name: str, season=None):
    try:
        query = """
            SELECT *
            FROM qb_metrics 
            WHERE LOWER(player_display_name) LIKE LOWER(:name) AND (:season IS NULL OR season = :season)
        """

        df = query_postgres(
            query,
            {
                "name": f"%{name}%",
                "season": season,
            }
        )

        print("Loaded QB search from Postgres")

    except Exception as e:
        print(f"Postgres unavailable, falling back to CSV: {e}")
        df = pd.read_csv(DATA_PATH)

        name_col = (
            "player_display_name"
            if "player_display_name" in df.columns
            else "player_name"
        )

        df = df[
            df[name_col]
            .astype(str)
            .str.lower()
            .str.contains(name.lower(), na=False)
        ]

        if season is not None and "season" in df.columns:
            df = df[df["season"]==season]

    return clean_data(df).to_dict(orient="records")

def get_advanced_metrics(season: None, season_type: None, limit=100, offset=0):
    try:
        query = """ 
                SELECT 
                player_display_name,
                season,
                season_type,
                team,
                total_dropbacks,
                turnover_score,
                drive_score,
                success_score,
                negative_epa_rate,
                panic_play_rate,
                epa_per_dropback,
                redzone_td_rate,
                third_down_conversion_rate,
                third_down_regular_conversion_rate,
                third_and_long_conversion_rate,
                adjusted_cortisol_score,
                adjusted_cortisol_rank
                FROM qb_metrics
                WHERE (:season IS NULL OR season = :season) AND (:season_type IS NULL OR season_type = :season_type)
                LIMIT :limit 
                OFFSET :offset
                """
        df = query_postgres(
            query,
            {
                "season": season,
                "season_type": season_type,
                "limit": limit,
                "offset": offset,
            }
        )

        print("Loaded advanced metrics from Postgres")

    except Exception as e:
        print(f"Postgres unavailable, falling back to CSV: {e}")
        df = pd.read_csv(DATA_PATH)

        cols = [col for col in advanced_metric_cols if col in df.columns]
        df = df[cols]

        if season is not None and "season" in df.columns:
            df = df[df["season"] == season]

        df = df.head(limit)

    return clean_data(df).to_dict(orient="records")

def build_response(results):
    return {
        "count": len(results),
        "results": results
    }

def validate_sort(sort_by, sort_order):
    if sort_by not in allowed_sort_columns:
        sort_by = "adjusted_cortisol_score"
    
    sort_order = sort_order.lower()

    if sort_order not in ["asc", "desc"]:
        sort_order = "desc"
    
    return sort_by, sort_order.upper()