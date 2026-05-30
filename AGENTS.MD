# AGENTS.md

## Project Overview
Full-stack real estate platform developed as a bachelor's thesis project.

The system simulates a real-world property marketplace with:
- Public property browsing (no authentication required)
- Agent dashboard for managing properties and leads
- Admin panel for managing agents

---

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- PostgreSQL
- Prisma ORM

---

## System Roles

### 👑 Admin
- Creates and manages agents
- Activates / deactivates agents
- No property management

### 🧑‍💼 Agent
- Manages own properties (CRUD)
- Views leads/messages
- Updates property status

### 👤 Public User (NO LOGIN)
- Browses properties
- Filters/searches listings
- Views property details
- Sends messages via contact form

---

## Authentication System (IMPORTANT)

Only Admin and Agents authenticate.

### Flow:
1. Login with email + password
2. Backend verifies credentials (bcrypt)
3. If valid → JWT generated
4. JWT stored in HTTP-only cookie
5. Middleware validates token on requests

### JWT Payload:
- userId
- role (admin | agent)

---

## Feature Development Workflow (MANDATORY - THESIS GRADE)

### STEP 1 — PLANNING MODE (NO CODE)

For every feature:

- Analyze request in detail
- Ask clarifying questions if needed
- DO NOT implement anything
- Generate a full specification document:

Path:
`/docs/specs/<feature-name>.spec.md`

---

### SPEC DOCUMENT MUST BE THESIS-READY

Each spec is also part of bachelor thesis documentation and MUST include:

---

## 1. General Information
- Feature name
- Feature type (frontend / backend / full-stack)
- Version
- Author: Claudiu Ștefan

---

## 2. Problem Statement
- What problem the feature solves
- Why it is needed in the system

---

## 3. Objectives
- Main goals
- Secondary goals

---

## 4. Functional Requirements
- Detailed system behaviors
- User interactions
- Business rules

---

## 5. Non-Functional Requirements
- Performance requirements
- Security requirements
- Usability requirements
- Maintainability considerations

---

## 6. User Stories
- As a user I want...
- As an agent I want...
- As an admin I want...

---

## 7. System Design

### Backend Design
- API endpoints
- Controllers
- Services

### Frontend Design
- Pages affected
- Components used
- State handling

---

## 8. Database Design (if applicable)
- Tables
- Fields
- Relationships
- Constraints

---

## 9. Data Flow
- Step-by-step flow between frontend, backend, and database

---

## 10. Validation Rules
- Input validation rules
- Business logic constraints

---

## 11. Security Considerations
- Authentication rules
- Authorization rules
- Data protection

---

## 12. Edge Cases
- Possible failures
- Error handling strategies

---

## 13. Acceptance Criteria
- Clear checklist of requirements

---

## 14. Future Improvements
- Optional enhancements

---

### STEP 2 — APPROVAL GATE

- No implementation without explicit approval ("approved")
- If changes are required → update spec first

---

### STEP 3 — IMPLEMENTATION

- Implement ONLY approved spec
- No scope expansion
- No extra features
- Keep code simple and readable

---

## Backend Rules

- REST API only
- Express.js with controllers + services (simple)
- No business logic in controllers
- Zod validation for inputs
- Centralized error handling

---

## Frontend Rules (NEXT.JS)

- Use App Router
- Server Components by default
- Client Components only when needed
- Keep UI simple and reusable

---

## Database Rules

Entities:
- users (admin, agent)
- properties
- leads

Rules:
- Prisma ORM only
- Migrations required
- No manual DB changes
- Explicit relationships required

---

## Core Business Rules

- Users have NO accounts
- Only admin and agents authenticate
- Each property belongs to one agent
- Each lead belongs to property + agent
- Leads created via public contact form

---

## API Rules

- RESTful design
- JSON responses only

Standard response:
```json
{
  "success": true,
  "data": {},
  "error": null
}
```

---

## Security Rules

- bcrypt password hashing
- JWT authentication (admin/agent only)
- HTTP-only cookies for token storage
- Role-based access control
- Input validation (Zod)
- Environment variables for secrets

---

## Code Style

- TypeScript strict mode
- No `any`
- Small functions (<50 lines)
- Clean naming conventions
- No duplication
- Simplicity over abstraction

---

## UI Rules

- Mobile-first design
- Tailwind CSS only
- Clean minimal UI
- Reusable components

---

## Routing Structure

Public:
- /
- /properties
- /properties/[id]
- /contact

Auth:
- /login

Admin:
- /admin/*

Agent:
- /agent/*

---

## Restrictions

Do NOT use:
- Microservices
- CQRS
- Event sourcing
- Over-engineering
- Complex architectures
- Unnecessary libraries

---

## Documentation Rule

All feature specs must be stored in:
`/docs/specs/`

Every spec MUST include:
Author: Claudiu Ștefan

---

## Golden Rule

Keep everything simple, readable, and easy to explain in a bachelor thesis defense.