from fastapi import APIRouter, Query, HTTPException
from backend.models.schemas import QBRecord
from backend.services.qb_service import get_qbs, get_qb_by_name

router = APIRouter(prefix="/api/qbs", tags=["QBs"])

@router.get("", response_model=list[QBRecord])
def qbs(
    season: int | None = None,
    team: str | None = None,
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0)
):
    return get_qbs(season=season, team=team, limit=limit, offset=offset)

@router.get("/{name}", response_model=list[QBRecord])
def qb(name: str, season: int | None=None):
    result =  get_qb_by_name(name=name, season=season)
    if not result:
        raise HTTPException (
            status_code = 404, 
            detail=f"QB '{name}' not found"
        )
    return result