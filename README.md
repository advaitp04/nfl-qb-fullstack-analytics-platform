# NFL QB Cortisol Index: Full-Stack NFL Analytics Platform

## Introduction

The NFL QB Cortisol Index is a full-stack sports analytics platform designed to evaluate quarterback stability, offensive consistency, and situational performance using NFL player statistics and play-by-play data.

The platform computes a custom QB Cortisol Index, a composite metric engineered to measure how effectively quarterbacks sustain drives, avoid stress-inducing mistakes, and maintain offensive efficiency across multiple NFL seasons.

Originally developed as a sports analytics dashboard, the project evolved into a modular full-stack analytics platform featuring:

- FastAPI backend APIs
- PostgreSQL integration
- Dockerized multi-service infrastructure
- Typed API contracts with Pydantic and TypeScript
- React + TypeScript frontend architecture
- Automated testing with Pytest
- CI workflows with GitHub Actions
- Query filtering, sorting, and pagination
- Interactive analytics visualizations
- Custom React hooks and reusable UI components

The project combines sports analytics, backend engineering, frontend architecture, API design, infrastructure orchestration, and data engineering into a production-style analytics system.

---

# Live Dashboard

[![Live Dashboard](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue)](https://advait-patil-nfl-qb-cortisol-analytics.streamlit.app/)

---

# Software Engineering Upgrade

The project was expanded from a standalone analytics notebook/dashboard into a modular full-stack analytics platform with production-style backend and frontend architecture.

Major engineering-focused additions include:

- FastAPI backend service for REST API endpoints
- PostgreSQL integration using SQLAlchemy
- Modular service-layer backend architecture
- Typed backend API contracts using Pydantic schemas
- Typed frontend API contracts using TypeScript interfaces
- Query filtering, validation, sorting, and pagination support
- Dockerized backend, database, and frontend services
- Docker Compose orchestration for local multi-service development
- Automated API testing with Pytest
- GitHub Actions CI pipeline
- Environment-variable based configuration management
- Reusable response helper utilities
- Structured backend route organization
- Graceful CSV fallback handling for local development/testing
- Modular React + TypeScript frontend architecture
- Interactive sorting, filtering, and comparison visualizations
- Custom React hooks for data fetching and state management
- Reusable transformation utilities for analytics visualizations
- Multi-page analytics dashboards

These upgrades significantly improved the platform’s scalability, maintainability, portability, developer experience, and production-readiness.

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

## QB Cortisol Leaderboard

![QB Cortisol Leaderboard](images/nflcortisoldashboard1.png)

## Advanced Metrics Dashboard

![Advanced Metrics Dashboard](images/nflcortisoldashboard2.png)

---

# Technology Stack

## Languages

- Python
- SQL
- TypeScript
- JavaScript

## Frontend Engineering

- React
- TypeScript
- Vite

## Backend Engineering

- FastAPI
- SQLAlchemy
- Pydantic

## Database

- PostgreSQL

## Data Engineering & Processing

- Pandas
- nflreadpy

## Frontend Visualization

- Custom SVG-based React visualizations
- Responsive React chart components

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

# Frontend Architecture

The React frontend follows a layered architecture where data flows through typed APIs, reusable hooks, transformation utilities, and feature-based UI components before rendering.

```text
FastAPI Backend
      ↓
Typed API Client Layer
      ↓
Custom React Hooks
      ↓
Filtering + Transformation Utilities
      ↓
Feature Components
      ↓
Page-Level Composition
```

The frontend architecture separates:

- API communication
- state ownership
- data transformation
- visualization rendering
- reusable UI composition
- page orchestration

to improve maintainability, scalability, and developer experience as the platform grows.

---

# Modern React Frontend Architecture

The frontend was refactored from a monolithic dashboard structure into a modular React + TypeScript architecture featuring:

- Feature-based React component organization
- Typed frontend-backend API contracts
- Reusable chart and visualization components
- Custom React hooks for state and data fetching
- Client/server-side filtering strategies
- Interactive leaderboard sorting
- Multi-page analytics dashboards
- Shared transformation utilities
- Stateful and presentational component separation
- Modular page orchestration

The architecture mirrors modern production frontend engineering practices by separating:

- data fetching
- business logic
- state management
- transformation logic
- UI rendering

into reusable and scalable layers.

---

# System Architecture

The platform is structured as a modular multi-service analytics system.

```text
React Frontend
        ↓
Typed API Client Layer
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
├── frontend/
│   ├── src/
│   │   ├── api/                # Typed frontend API client layer
│   │   ├── components/         # Reusable UI + chart components
│   │   ├── constants/          # Shared frontend constants
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page-level orchestration
│   │   ├── types/              # Frontend API contract types
│   │   ├── utils/              # Shared transformation utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│
├── backend/
│   ├── db/                     # Database connection layer
│   ├── models/                 # Pydantic response schemas
│   ├── routes/                 # FastAPI route modules
│   ├── services/               # Analytics/business logic layer
│   ├── utils/                  # Shared backend utilities
│   └── main.py                 # FastAPI application entrypoint
│
├── scripts/                    # Data pipeline scripts
├── tests/                      # Automated backend API tests
├── data/processed/             # Generated datasets
├── images/                     # Dashboard screenshots
├── .github/workflows/          # CI workflows
├── Dockerfile.api              # FastAPI backend container
├── docker-compose.yml          # Multi-container orchestration
├── requirements.txt
├── .env.example
└── README.md
```

---

# Frontend Features

## Home Dashboard

The primary leaderboard dashboard includes:

- Interactive QB Cortisol leaderboard
- Dynamic filtering by:
  - season
  - season type
  - minimum dropbacks
- Client/server-side filtering integration
- Interactive table sorting
- Gradient-based score visualizations
- QB comparison charts
- Responsive UI components
- Expandable methodology accordion

## Advanced Metrics Dashboard

The advanced analytics page includes:

- QB Volatility vs. Efficiency visualization
- Advanced QB comparison charts
- Red Zone Passing TD Leaders
- Third Down Performance Leaders
- QB Pressure Profile visualizations
- Percentile-based advanced trait analysis
- Dynamic top-N filtering

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

- `scripts/extract_data.py`
- `scripts/build_qb_metrics.py`
- `scripts/cortisol_calculation.py`
- `scripts/build_advanced_metrics.py`
- `scripts/run_pipeline.py`
- `scripts/load_to_postgres.py`

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

- Season filtering
- Season type filtering (`REG`, `POST`)
- Team filtering
- Pagination using `limit` and `offset`
- Typed response validation with Pydantic schemas
- Dynamic sorting using `sort_by` and `sort_order`

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

The React frontend consumes data exclusively through FastAPI REST APIs using a reusable typed API client layer.

This architecture introduces a clear separation between:

- frontend presentation logic
- backend business/query logic
- database persistence
- transformation and visualization logic

The frontend architecture includes:

- reusable typed API clients
- custom React hooks for data fetching
- transformation utilities for visualization shaping
- page-level orchestration components
- reusable feature components

This design improves scalability, maintainability, portability, and frontend extensibility while more closely mirroring modern full-stack software architectures.

---

# Engineering Challenges Solved

Key engineering problems addressed during development included:

- Refactoring a monolithic frontend into reusable React architecture
- Designing typed frontend-backend API contracts
- Resolving client-side filtering inconsistencies caused by paginated API responses
- Separating presentational and stateful React components
- Building reusable visualization transformation utilities
- Implementing modular backend query filtering and pagination
- Managing Dockerized multi-service orchestration
- Maintaining type-safe data flow across frontend and backend layers
- Designing reusable comparison and analytics visualization systems

---

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

- React frontend
- FastAPI backend service
- PostgreSQL database service

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

### React Frontend

```text
http://localhost:5173
```

---

# Testing & Continuous Integration

The platform includes automated backend API tests using Pytest.

Tests validate:

- endpoint availability
- query filtering
- pagination behavior
- invalid query handling
- response schema validation
- route integrity
- backend API contracts

Run tests locally:

```bash
python -m pytest
```

Frontend builds are validated using:

```bash
npm run build
```

GitHub Actions workflows automatically execute tests and validation checks on pushes and pull requests to help ensure backend and frontend stability.

---

# Containerization

The project uses Docker Compose to orchestrate a multi-service local development environment consisting of:

- React frontend service
- FastAPI backend service
- PostgreSQL database service

Mounted Docker volumes enable hot-reload development workflows while preserving PostgreSQL data persistence.

Docker Compose networking enables internal service-to-service communication between the frontend, backend, and PostgreSQL database containers.

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

- AWS cloud deployment
- Redis/API caching layer
- Authentication and user accounts
- React Query/TanStack Query integration
- Advanced observability and logging
- CI/CD deployment automation
- Player-specific analytics pages
- AI-generated QB scouting summaries
- Infrastructure monitoring and metrics
- Advanced frontend testing

---

# Summary

The NFL QB Cortisol Index evolved from a sports analytics dashboard into a modular full-stack analytics platform combining:

- frontend engineering
- backend API engineering
- database architecture
- containerized infrastructure
- automated testing
- queryable analytics services
- interactive visualization systems
- data engineering pipelines

The project demonstrates modern software engineering concepts including:

- service-oriented backend architecture
- typed frontend-backend API contracts
- modular React frontend architecture
- reusable transformation layers
- infrastructure orchestration
- environment-based configuration management
- scalable analytics system design
- interactive data visualization engineering