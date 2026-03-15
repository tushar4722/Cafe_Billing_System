# Restaurant Billing Software

A comprehensive POS and billing system for restaurants/cafes, featuring a React frontend and Node.js backend.

## Project Structure

- `client/`: Frontend React application.
- `src/`: Backend Node.js server source code.
- `scripts/`: Utility scripts for database management and maintenance.
- `docs/`: (Future) Project documentation.

## Getting Started

### Prerequisites
- Node.js (v14+)
- MySQL

### Setup
1. Clone the repository.
2. Install root dependencies: `npm install`.
3. Install frontend dependencies: `cd client && npm install`.
4. Configure `.env` file (copy from `.env.example`).
5. Run the project: `npm run dev` (starts both client and server).

## Branching Model
- `main`: Stable production-ready code.
- `develop`: Integration branch for features.
- `feature/*`: Specific feature developement.
