# NFL QB Cortisol Index: Full-Stack NFL Analytics Platform

## Introduction

The NFL QB Cortisol Index is a full-stack sports analytics platform designed to evaluate quarterback stability and offensive consistency using NFL player statistics and play-by-play data.

The platform computes a custom QB Cortisol Index, a composite metric engineered to measure how effectively quarterbacks sustain drives, avoid stress-inducing mistakes, and maintain offensive efficiency across multiple NFL seasons.

Originally developed as a sports analytics dashboard, the project evolved into a modular backend-focused analytics platform featuring:

- FastAPI backend APIs
- PostgreSQL integration
- Dockerized multi-service infrastructure
- Typed API contracts with Pydantic
- Automated testing with Pytest
- CI workflows with GitHub Actions
- Query filtering and pagination
- Streamlit analytics dashboard

The project combines sports analytics, backend engineering, data engineering, API architecture, and infrastructure orchestration into a production-style analytics system.

## Live Dashboard

[![Streamlit App](https://img.shields.io/badge/Live%20Dashboard-Streamlit-green)](https://advait-patil-nfl-qb-cortisol-analytics.streamlit.app/)

---

# Software Engineering Upgrade

The project was expanded from a standalone analytics notebook/dashboard into a modular full-stack analytics platform with production-style backend architecture.

Major engineering-focused additions include:

- FastAPI backend service for REST API endpoints
- PostgreSQL integration using SQLAlchemy
- Modular service-layer backend architecture
- Pydantic response schemas for typed API contracts
- Query filtering, validation, and pagination support
- Dockerized backend, database, and dashboard services
- Docker Compose orchestration for local multi-service development
- Automated API testing with Pytest
- GitHub Actions CI pipeline
- Environment-variable based configuration management
- Reusable response helper utilities
- Structured backend route organization
- Graceful CSV fallback handling for local development/testing
- Streamlit frontend fully integrated with FastAPI backend APIs
- API-driven frontend architecture replacing direct CSV-based frontend access

These upgrades significantly improved the platform’s scalability, maintainability, portability, and production-readiness.

---

# QB Cortisol Index Methodology

The QB Cortisol Index measures how consistently a quarterback sustains offensive productivity while minimizing high-stress plays that negatively impact drives and offensive rhythm.

The score is calculated using normalized quarterback performance metrics grouped into three categories.

## Drive Sustainability

Measures a quarterback’s ability to maintain offensive drives.

- First Down Rate
- Completion Percentage

## Turnover Risk

Captures plays that commonly increase fan stress and disrupt offensive momentum.

- Interception Rate
- Fumble Lost Rate
- Sack Rate

## Offensive Success

Measures overall offensive productivity and efficiency.

- EPA per Dropback
- Yards per Attempt
- Touchdown Rate

Metrics are normalized and inverted when necessary so that higher scores represent more stable quarterback performance.

The final QB Cortisol Index combines these normalized metrics into a composite score used to rank quarterbacks across multiple NFL seasons.

---

# Dashboard Preview

![QB Cortisol Dashboard](images/nflcortisoldashboard1.png)

![QB Advanced Metrics](images/nflcortisoldashboard2.png)

---

# Technology Stack

## Languages

- Python
- SQL

## Backend Engineering

- FastAPI
- SQLAlchemy
- Pydantic

## Frontend / Dashboard

- Streamlit

## Database

- PostgreSQL

## Data Engineering & Processing

- Pandas
- nflreadpy

## Visualization

- Plotly
- Altair

## Testing & CI

- Pytest
- GitHub Actions

## Infrastructure & Containerization

- Docker
- Docker Compose

## Version Control

- Git
- GitHub

---

# System Architecture

The platform is structured as a modular multi-service analytics system.

```text
Streamlit Frontend Dashboard
            ↓
Reusable API Client Layer
            ↓
FastAPI Backend API
            ↓
Service Layer / Query Logic
            ↓
PostgreSQL Database
            ↓
Dockerized Multi-Service Infrastructure
```

---

# Repository Structure

```text
nfl-qb-cortisol-analytics/
│
├── app/                         # Streamlit dashboard frontend
├── backend/
│   ├── db/                      # Database connection layer
│   ├── models/                  # Pydantic response schemas
│   ├── routes/                  # FastAPI route modules
│   ├── services/                # Analytics/business logic layer
│   ├── utils/                   # Shared backend utilities
│   └── main.py                  # FastAPI application entrypoint
│
├── scripts/                     # Data pipeline scripts
├── tests/                       # Automated backend API tests
├── data/processed/              # Generated datasets
├── .github/workflows/           # CI workflows
├── Dockerfile.api               # FastAPI backend container
├── dockerfile                   # Streamlit dashboard container
├── docker-compose.yml           # Multi-container orchestration
├── requirements.txt
├── .env.example
└── README.md
```

---

# Data Pipeline

The analytics pipeline processes NFL player statistics and play-by-play datasets into a unified quarterback analytics dataset.

Pipeline stages include:

1. Extract NFL player statistics
2. Aggregate QB performance metrics
3. Calculate QB Cortisol scores
4. Compute advanced situational metrics
5. Generate unified analytics dataset
6. Load analytics dataset into PostgreSQL

Primary scripts:

* `scripts/extract_data.py`
* `scripts/build_qb_metrics.py`
* `scripts/cortisol_calculation.py`
* `scripts/build_advanced_metrics.py`
* `scripts/run_pipeline.py`
* `scripts/load_to_postgres.py`

---

# REST API

The platform exposes quarterback analytics through a FastAPI backend service.

## Available Endpoints

| Endpoint                     | Description                              |
| ---------------------------- | ---------------------------------------- |
| `GET /`                      | API status check                         |
| `GET /api/health`            | Backend health check                     |
| `GET /api/qbs`               | Retrieve quarterback records             |
| `GET /api/qbs/{name}`        | Retrieve quarterback data by player name |
| `GET /api/rankings/cortisol` | Retrieve QB Cortisol rankings            |
| `GET /api/advanced-metrics`  | Retrieve advanced QB analytics           |

---

# API Query Features

Supported backend query functionality includes:

* Season filtering
* Season type filtering (`REG`, `POST`)
* Team filtering
* Pagination using `limit` and `offset`
* Typed response validation with Pydantic schemas
* Dynamic sorting using `sort_by` and `sort_order`

---

# Example API Response

```json
{
  "count": 10,
  "results": [
    {
      "player_display_name": "Patrick Mahomes",
      "season": 2023,
      "season_type": "REG",
      "team": "KC",
      "adjusted_cortisol_score": 0.6175
    }
  ]
}
```

---
# Frontend-Backend Integration

The Streamlit dashboard consumes data exclusively through FastAPI REST endpoints rather than directly accessing CSV datasets.

This architecture introduces a clear separation between:

- frontend presentation logic
- backend business/query logic
- database persistence

The frontend communicates with the backend through a reusable API client layer that handles:

- endpoint requests
- pagination
- query parameter construction
- response parsing
- API-driven data retrieval

This design improves scalability, maintainability, and portability while more closely mirroring modern full-stack software architectures.


# Local Development Setup

## 1. Clone Repository

```bash
git clone https://github.com/advaitp04/nfl-qb-cortisol-analytics.git
cd nfl-qb-cortisol-analytics
```

---

## 2. Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/nfl_cortisol
```

A sample `.env.example` file is included for local development setup.

---

## 3. Launch Full Stack

```bash
docker compose up
```

This launches:

* FastAPI backend service
* PostgreSQL database service
* Streamlit dashboard service

---

## 4. Run Data Pipeline

```bash
python -m scripts.run_pipeline
```

---

## 5. Load Data into PostgreSQL

```bash
python -m scripts.load_to_postgres
```

---

## 6. Access Services

### FastAPI Swagger Docs

```text
http://localhost:8001/docs
```

### Streamlit Dashboard

```text
http://localhost:7860
```

---

# Testing & Continuous Integration

The platform includes automated backend API tests using Pytest.

Tests validate:

* Endpoint availability
* Query filtering
* Pagination behavior
* Invalid query handling
* Response schema validation
* Route integrity
* Backend API contracts

Run tests locally:

```bash
python -m pytest
```

GitHub Actions workflows automatically execute tests on pushes and pull requests to help ensure backend stability and reliability.

The backend API layer includes automated validation for filtering, pagination, sorting, and response contracts using FastAPI query validation and Pydantic schemas.

---

# Containerization

The project uses Docker Compose to orchestrate a multi-service local development environment consisting of:

* FastAPI backend service
* PostgreSQL database service
* Streamlit dashboard service

Mounted Docker volumes enable hot-reload development workflows while preserving PostgreSQL data persistence.

Docker Compose networking enables internal service-to-service communication between the Streamlit frontend, FastAPI backend, and PostgreSQL database containers.

Run the full stack locally:

```bash
docker compose up
```

---

# Data Source

The project uses nflreadpy and nflverse datasets for NFL player statistics and play-by-play data analysis.

## nflreadpy

Installation:
https://www.piwheels.org/project/nflreadpy/

Documentation:
https://nflreadr.nflverse.com/index.html

---

# Future Roadmap

Planned future enhancements include:

* React + TypeScript frontend migration leveraging existing FastAPI backend APIs
* AWS cloud deployment
* Redis/API caching layer
* Authentication and user accounts
* Advanced analytics filtering and sorting
* AI-generated QB scouting summaries
* CI/CD deployment automation
* Observability and logging infrastructure

---

# Summary

The NFL QB Cortisol Index evolved from a sports analytics dashboard into a modular full-stack analytics platform combining:

* Backend API engineering
* Database architecture
* Containerized infrastructure
* Automated testing
* Queryable analytics services
* Interactive frontend visualization
* Data engineering pipelines

The project demonstrates modern software engineering concepts including service-oriented backend architecture, typed API contracts, infrastructure orchestration, environment-based configuration management, and scalable analytics system design.
