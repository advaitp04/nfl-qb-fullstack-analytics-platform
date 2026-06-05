from fastapi import APIRouter, Query
from backend.services.qb_service import get_advanced_metrics
from backend.models.schemas import AdvancedMetricsRecord

router = APIRouter(prefix="/api/advanced-metrics", tags=["AdvancedMetrics"])

@router.get("", response_model=list[AdvancedMetricsRecord])
def advanced_metrics(season: int | None=None, limit: int = Query(100, ge=1, le=500)):
    return get_advanced_metrics(season=season, limit=limit)