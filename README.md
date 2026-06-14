# NFL QB Cortisol Index: Full-Stack NFL Analytics Platform

## Introduction

The NFL QB Cortisol Index is a production-deployed full-stack sports analytics platform designed to evaluate quarterback stability, offensive consistency, and situational performance using NFL player statistics and play-by-play data.

The platform computes a custom QB Cortisol Index, a composite metric engineered to measure how effectively quarterbacks sustain drives, avoid stress-inducing mistakes, and maintain offensive efficiency across multiple NFL seasons.

Originally developed as a sports analytics dashboard, the platform evolved into a cloud-deployed production-style analytics system featuring:

- React + TypeScript frontend architecture
- FastAPI backend APIs
- PostgreSQL integration
- Dockerized infrastructure
- AWS cloud deployment
- ECS container orchestration
- HTTPS/TLS-secured production services
- Automated CI validation workflows

The project combines sports analytics, backend engineering, frontend architecture, API design, cloud infrastructure, DevOps, and data engineering into a modern full-stack analytics platform.

---

# Live Deployment

## Production Frontend

https://www.nflcortisol.com

## Production Backend API

https://api.nflcortisol.com

## API Documentation

https://api.nflcortisol.com/docs

---

# Software Engineering Upgrade

The project was expanded from a standalone analytics dashboard into a modular full-stack analytics platform with production-style backend and frontend architecture.

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
- GitHub Actions CI workflows
- Environment-variable based configuration management
- Reusable response helper utilities
- Structured backend route organization
- Graceful CSV fallback handling for local development/testing
- Modular React + TypeScript frontend architecture
- Interactive sorting, filtering, and comparison visualizations
- Custom React hooks for data fetching and state management
- Reusable transformation utilities for analytics visualizations
- Multi-page analytics dashboards
- Production AWS cloud deployment
- ECS Fargate container orchestration
- HTTPS/TLS-secured frontend and backend APIs

These upgrades significantly improved the platform’s scalability, maintainability, portability, developer experience, cloud readiness, and production reliability.

---

# Key Engineering Concepts

This project demonstrates:

- Typed frontend-backend API contracts
- Stateful vs. presentational React component separation
- Custom React hook architecture
- Service-layer backend architecture
- Query filtering and pagination systems
- Dockerized multi-service infrastructure
- Container build optimization and service isolation
- CI-based automated validation
- Distributed local development workflows
- Reusable transformation and visualization layers
- Cloud-native deployment architecture
- HTTPS/TLS infrastructure
- Container orchestration
- DNS and networking configuration
- Cloud security group isolation
- Browser security concepts including CORS

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

![QB Cortisol Leaderboard](images/nflfullstackplatform1.png)

## Advanced Metrics Dashboard

![Advanced Metrics Dashboard](images/nflfullstackplatform2.png)

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

## Cloud Infrastructure & Containerization

- Docker
- Docker Compose
- AWS ECS Fargate
- AWS ECR
- AWS RDS
- AWS Amplify
- AWS ACM
- AWS Application Load Balancer
- Cloudflare DNS

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

# Cloud Deployment Architecture

The platform is deployed as a production-style cloud-native analytics system using AWS infrastructure and Cloudflare DNS.

## Production Architecture

```text
User Browser
↓
Cloudflare DNS
↓
AWS Amplify
↓
React + TypeScript Frontend
↓
HTTPS API Requests
↓
AWS Application Load Balancer
↓
AWS ECS Fargate
↓
Dockerized FastAPI Backend
↓
AWS RDS PostgreSQL
```

## Cloud Infrastructure

### Frontend Hosting
- AWS Amplify
- CloudFront CDN distribution
- Custom domain integration
- HTTPS/TLS termination

### Backend Infrastructure
- AWS ECS Fargate
- Dockerized FastAPI containers
- AWS ECR container registry
- Application Load Balancer routing
- Health check monitoring

### Database Infrastructure
- AWS RDS PostgreSQL
- Private VPC networking
- Security-group controlled access

### Networking & Security
- HTTPS/TLS certificates via AWS ACM
- Cloudflare DNS routing
- ECS/RDS security group isolation
- FastAPI CORS allowlist configuration

### Deployment Workflow

```text
Local Development
↓
Docker Image Build
↓
Push Image to AWS ECR
↓
Update ECS Task Definition
↓
Deploy ECS Service Revision
↓
ALB Routes Production Traffic
```

---

# Repository Structure

```text
nfl-qb-cortisol-analytics/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│
├── backend/
│   ├── db/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── main.py
│
├── scripts/
├── tests/
├── data/processed/
├── images/
├── .github/workflows/
├── Dockerfile.api
├── Dockerfile.frontend
├── docker-compose.yml
├── .dockerignore
├── requirements.txt
├── .env.example
└── README.md
```

---

# REST API

The platform exposes quarterback analytics through a FastAPI backend service.

## Available Endpoints

| Endpoint | Description |
|---|---|
| `GET /` | API status check |
| `GET /api/health` | Backend health check |
| `GET /api/qbs` | Retrieve quarterback records |
| `GET /api/qbs/{name}` | Retrieve quarterback data by player name |
| `GET /api/rankings/cortisol` | Retrieve QB Cortisol rankings |
| `GET /api/advanced-metrics` | Retrieve advanced QB analytics |

---

# Local Development Setup

## 1. Clone Repository

```bash
git clone https://github.com/advaitp04/nfl-qb-cortisol-analytics.git
cd nfl-qb-cortisol-analytics
```

## 2. Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/nfl_cortisol
VITE_API_BASE_URL=http://localhost:8001
```

## 3. Launch Full Stack

```bash
docker compose up --build
```

This launches:

- React frontend
- FastAPI backend service
- PostgreSQL database service

## 4. Run Data Pipeline

```bash
python -m scripts.run_pipeline
```

## 5. Load Data into PostgreSQL

```bash
python -m scripts.load_to_postgres
```

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

Run backend tests locally:

```bash
python -m pytest
```

Validate the frontend production build locally:

```bash
cd frontend
npm run build
```

GitHub Actions workflows automatically execute backend tests and frontend build validation on pushes and pull requests.

AWS Amplify automatically deploys frontend changes from connected GitHub branches.

Backend ECS deployments are currently performed manually through Docker image pushes and ECS service updates, with full CI/CD deployment automation planned as a future enhancement.

---

# Engineering Challenges Solved

Key engineering problems addressed during development included:

- Refactoring a monolithic frontend into reusable React architecture
- Designing typed frontend-backend API contracts
- Resolving client-side filtering inconsistencies caused by paginated API responses
- Separating presentational and stateful React components
- Managing Dockerized multi-service orchestration
- Optimizing Docker build contexts and layer caching
- ECS service-linked IAM role configuration
- ECR authentication and permissions
- ARM64 vs AMD64 Docker image compatibility
- ECS stale image deployments caused by reused `latest` tags
- Application Load Balancer health check failures
- RDS PostgreSQL connectivity and security group configuration
- HTTPS mixed-content blocking
- AWS ACM certificate validation and HTTPS listener setup
- Cloudflare DNS configuration
- FastAPI CORS policy debugging and browser preflight handling
- Multi-service cloud networking and container orchestration

---

# Future Roadmap

Planned future enhancements include:

- Full CI/CD automation for ECS deployments
- Infrastructure as Code using Terraform
- Redis/API caching layer
- Authentication and user accounts
- React Query/TanStack Query integration
- Advanced observability and CloudWatch monitoring
- Frontend integration testing
- Player-specific analytics pages
- AI-generated QB scouting summaries
- Real-time analytics pipelines
- Autoscaling ECS services
- Advanced predictive analytics

---

# Summary

The NFL QB Cortisol Index evolved from a sports analytics dashboard into a production-style full-stack analytics platform combining:

- frontend engineering
- backend API engineering
- database architecture
- containerized infrastructure
- cloud deployment
- HTTPS/TLS networking
- automated testing
- interactive visualization systems
- data engineering pipelines

The project demonstrates modern software engineering concepts including:

- service-oriented backend architecture
- typed frontend-backend API contracts
- modular React frontend architecture
- reusable transformation layers
- infrastructure orchestration
- scalable analytics system design
- cloud-native deployment workflows
- interactive data visualization engineering

---

# Author

Advait Patil

- GitHub: https://github.com/advaitp04
- LinkedIn: https://www.linkedin.com/in/advaitspatil/