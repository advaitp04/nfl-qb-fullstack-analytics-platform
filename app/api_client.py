import os 
import requests 
import pandas as pd 
import streamlit as st 

API_BASE_URL = os.getenv("API_BASE_URL", "http://api:8000")

def fetch_all(endpoint: str, page_size: int = 500):
    all_results = []
    offset = 0

    while True:
        response = requests.get(
            f"{API_BASE_URL}{endpoint}",
            params={"limit": page_size, "offset": offset}
        )
        response.raise_for_status()

        data = response.json()
        results = data["results"]

        all_results.extend(results)

        if len(results) < page_size:
            break

        offset += page_size

    return pd.DataFrame(all_results)

@st.cache_data
def fetch_qbs():
    return fetch_all("/api/qbs")

@st.cache_data
def fetch_advanced_metrics():
    return fetch_all("/api/advanced-metrics")
