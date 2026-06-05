from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_cortisol_rankings_with_query_params():
    response = client.get("/api/rankings/cortisol?season=2023&limit=10")
    assert response.status_code == 200

    data = response.json()
    assert "count" in data
    assert "results" in data
    assert isinstance(data["results"], list)
    assert data["count"] <= 10
    assert len(data["results"]) <= 10


def test_qb_by_name():
    response = client.get("/api/qbs/mahomes")
    assert response.status_code == 200

    data = response.json()
    assert "count" in data
    assert "results" in data
    assert isinstance(data["results"], list)
    assert data["count"] == len(data["results"])

def test_invalid_qb_name():
    response = client.get("/api/qbs/thisqbdoesnotexist")
    assert response.status_code == 404

def test_advanced_metrics_endpoint():
    response = client.get("/api/advanced-metrics?season=2023&limit=10")
    assert response.status_code == 200

    data = response.json()
    assert "count" in data
    assert "results" in data
    assert isinstance(data["results"], list)
    assert data["count"] <= 10
    assert len(data["results"]) <= 10

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_qbs_with_team_filter():
    response = client.get("/api/qbs?season=2023&team=KC&limit=10")
    assert response.status_code == 200

    data = response.json()
    assert "count" in data
    assert "results" in data
    assert isinstance(data["results"], list)
    assert data["count"] <= 10
    assert len(data["results"]) <= 10

def test_qbs_with_pagination():
    response = client.get("/api/qbs?limit=5&offset=5")
    assert response.status_code == 200

    data = response.json()
    assert "count" in data
    assert "results" in data
    assert isinstance(data["results"], list)
    assert data["count"] <= 5
    assert len(data["results"]) <= 5


def test_qbs_invalid_limit():
    response = client.get("/api/qbs?limit=1000")
    assert response.status_code == 422

def test_qbs_endpoint():
    response = client.get("/api/qbs")
    assert response.status_code == 200
    data = response.json()
    assert "count" in data
    assert "results" in data
    assert isinstance(data["results"], list)

def test_qbs_with_query_params():
    response = client.get("/api/qbs?season=2023&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] <= 10
    assert len(data["results"]) <= 10