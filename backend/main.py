from fastapi import FastAPI, Query
from backend.services.qb_service import get_qbs, get_qb_by_name, get_cortisol_rankings, get_cortisol_rankings_by_season

app = FastAPI(title="NFL QB Cortisol Analytics API")

@app.get("/")
def root():
    return {"message": "NFL QB Cortisol Analytics API is running"}

@app.get("/api/qbs")
def qbs(
    season: int | None = None,
    limit: int = Query(100, ge=1, le=500)
):
    return get_qbs(season=season, limit=limit)

@app.get("/api/rankings/cortisol")
def cortisol_rankings(
    season: int | None = None,
    limit: int = Query(50, ge=1, le=500)
):
    return get_cortisol_rankings(season=season, limit=limit)

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