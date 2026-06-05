from pydantic import BaseModel 
from typing import Optional, List 

class QBRecord(BaseModel):
    player_display_name: Optional[str] = None
    season: Optional[int] = None 
    season_type: Optional[str] = None
    team: Optional[str] = None 
    total_dropbacks: Optional[int] = None
    adjusted_cortisol_score: Optional[float] = None 
    adjusted_cortisol_rank: Optional[int] = None 
    cortisol_score: Optional[float] = None
    cortisol_rank: Optional[int] = None
    turnover_score: Optional[float] = None
    drive_score: Optional[float] = None
    success_score: Optional[float] = None

class AdvancedMetricsRecord(BaseModel):
    player_display_name: Optional[str] = None 
    season: Optional[int] = None 
    season_type: Optional[str] = None
    team: Optional[str] = None 
    epa_per_dropback: Optional[float] = None 
    redzone_td_rate: Optional[float] = None 
    third_down_conversion_rate: Optional[float] = None
    third_down_regular_conversion_rate: Optional[float] = None
    third_and_long_conversion_rate: Optional[float] = None
    adjusted_cortisol_score: Optional[float] = None
    adjusted_cortisol_rank: Optional[int] = None
    total_dropbacks: Optional[int] = None
    turnover_score: Optional[float] = None
    drive_score: Optional[float] = None
    success_score: Optional[float] = None
    negative_epa_rate: Optional[float] = None
    panic_play_rate: Optional[float] = None

class QBListResponse(BaseModel):
    count: int
    results: list[QBRecord]

class AdvancedMetricsListResponse(BaseModel):
    count: int
    results: list[AdvancedMetricsRecord]

class HealthResponse(BaseModel):
    status: str
    service: str