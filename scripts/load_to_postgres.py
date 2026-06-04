from backend.db.database import engine 
import pandas as pd 

def load_data_to_postgres(csv_path="data/processed/qb_master.csv"):
    df = pd.read_csv(csv_path)

    df.to_sql(
        "qb_metrics",
        engine,
        if_exists="replace",
        index=False
    )

    print(f"Loaded {len(df)} rows into Postgres table: qb_metrics")

if __name__ == "__main__":
    load_data_to_postgres()