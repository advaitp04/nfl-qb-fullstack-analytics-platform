from fastapi import FastAPI
from backend.services.qb_service import get_qbs, get_qb_by_name, get_cortisol_rankings, get_cortisol_rankings_by_season

app = FastAPI(title="NFL QB Cortisol Analytics API")

@app.get("/")
def root():
    return {"message": "NFL QB Cortisol Analytics API is running"}

@app.get("/api/qbs")
def qbs():
    return get_qbs()

@app.get("/api/rankings/cortisol")
def cortisol_rankings():
    return get_cortisol_rankings()

@app.get("/api/rankings/cortisol/{season}")
def cortisol_rankings_by_season(season: int):
    return get_cortisol_rankings_by_season(season)

@app.get("/api/qbs/{name}")
def qb(name: str):
    return get_qb_by_name(name)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "nfl-qb-cortisol-api"
    }