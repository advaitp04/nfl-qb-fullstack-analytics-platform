from extract_data import extract_data
from build_qb_metrics import build_qb_metrics
from cortisol_calculation import cortisol_calculation
from build_advanced_metrics import build_advanced_metrics
from load_to_postgres import load_data_to_postgres
import pandas as pd

def run_pipeline(load_to_db=False):
    """
    Run multiple data-handling methods and merge QB data
    
    Output:
        final_df -> master df containing QB data from the last 5 seasons
    """
    qb_data_by_season = extract_data()
    final_dfs = []

    for season, qb_df in qb_data_by_season.items():
        qb_metrics_df = build_qb_metrics(qb_df)
        season_cortisol_df = cortisol_calculation(qb_metrics_df)
        qb_master = build_advanced_metrics(season, season_cortisol_df)
        final_dfs.append(qb_master)

    final_df = pd.concat(final_dfs, ignore_index=True)
    output_path = "../data/processed/qb_master.csv"
    final_df.to_csv(output_path, index=False)

    if load_to_db:
        load_data_to_postgres(output_path)

if __name__=="__main__":
    run_pipeline(load_to_db=False)