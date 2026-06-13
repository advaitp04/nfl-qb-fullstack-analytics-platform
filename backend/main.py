from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.qbs import router as qbs_router
from backend.routes.rankings import router as rankings_router
from backend.routes.advanced_metrics import router as advanced_metrics_router
from backend.routes.health import router as health_router

app = FastAPI(title="NFL QB Cortisol Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "NFL QB Cortisol Analytics API is running"}

app.include_router(health_router)
app.include_router(qbs_router)
app.include_router(rankings_router)
app.include_router(advanced_metrics_router)