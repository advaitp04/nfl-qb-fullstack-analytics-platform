from fastapi import APIRouter, Query, HTTPException
from backend.models.schemas import QBRecord, QBListResponse
from backend.services.qb_service import get_qbs, get_qb_by_name

router = APIRouter(prefix="/api/qbs", tags=["QBs"])

@router.get("", response_model=QBListResponse)
def qbs(
    season: int | None = None,
    season_type: str | None = None,
    team: str | None = None,
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0)
):
    results =  get_qbs(season=season, season_type=season_type, team=team, limit=limit, offset=offset)
    return {
        "count": len(results),
        "results": results
    }

@router.get("/{name}", response_model=QBListResponse)
def qb(name: str, season: int | None=None):
    results =  get_qb_by_name(name=name, season=season)
    if not results:
        raise HTTPException (
            status_code = 404, 
            detail=f"QB '{name}' not found"
        )
    return {
        "count": len(results),
        "results": results
    }