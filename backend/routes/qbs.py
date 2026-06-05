from fastapi import APIRouter, Query, HTTPException
from typing import Literal
from backend.models.schemas import QBRecord, QBListResponse
from backend.services.qb_service import get_qbs, get_qb_by_name, build_response

router = APIRouter(prefix="/api/qbs", tags=["QBs"])

@router.get("", response_model=QBListResponse)
def qbs(
    season: int | None = Query(None, description="Filter by NFL season"),
    season_type: Literal["REG", "POST"] | None=Query(None, description="Filter by regular season or postseason"),
    team: str | None = Query(None, description="Filter by NFL team (i.e: KC, PHI, etc.)"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of QB records to return"),
    offset: int = Query(0, ge=0)
):
    results =  get_qbs(season=season, season_type=season_type, team=team, limit=limit, offset=offset)
    return build_response(results)

@router.get("/{name}", response_model=QBListResponse)
def qb(name: str, season: int | None=None):
    results =  get_qb_by_name(name=name, season=season)
    if not results:
        raise HTTPException (
            status_code = 404, 
            detail=f"QB '{name}' not found"
        )
    return build_response(results)