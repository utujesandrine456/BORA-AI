🚀 BORA — AI-Powered Recruitment Platform

“Where talent meets its true value”

🌍 Overview

BORA is an AI-powered recruitment platform that enables recruiters to efficiently screen, rank, and shortlist candidates using intelligent automation — while keeping humans in control of final hiring decisions.

This repository contains the Frontend Application, built with a focus on performance, scalability, and user experience.

🎯 Problem Statement

Recruiters today struggle with:

High volumes of applications
Time-consuming manual screening
Difficulty comparing diverse candidate profiles

👉 BORA solves this by:

Automating candidate evaluation
Providing objective ranking
Delivering clear, explainable insights
✨ Features
📄 Job creation & management
📂 Resume upload (PDF, CSV, Excel)
🧠 AI-powered screening
📊 Candidate ranking (Top 10 / Top 20)
💡 Explainable AI insights
📈 Analytics & insights dashboard
⚡ Fast and responsive UI
🧱 Tech Stack
Technology	Purpose
Next.js 14	Frontend Framework
TypeScript	Type Safety
Tailwind CSS	Styling
Redux Toolkit	State Management
React Hook Form + Zod	Form & Validation
Recharts	Data Visualization
React Dropzone	File Uploads
Axios	API Calls
Vercel	Deployment
🧠 How the AI Works (Simplified)
Collect job details and applicant data
Extract key information from resumes
Compare candidates to job requirements
Assign match scores (0–100)
Rank candidates and shortlist Top 10/20
Generate explanations (strengths, gaps, recommendations)
📄 Pages
Page	Route	Description
Auth	/login, /register	Login & Signup
Dashboard	/dashboard	Overview & KPIs
Jobs	/jobs	Job listings
Create Job	/jobs/create	Add job
Job Details	/jobs/[id]	Run screening
Applicants	/applicants	Upload/manage
AI Processing	/screening/loading	AI running
Results	/screening/results	Shortlist
Candidate Details	/screening/results/[id]	Profile
History	/history	Past screenings
Insights	/insights	Analytics
Settings	/settings	Preferences
⚙️ Getting Started
# Clone the project
git clone https://github.com/YOUR_ORG/bora-frontend.git

# Go into the project
cd bora-frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local

# Start development server
npm run dev

👉 Open: http://localhost:3000

🔐 Environment Variables

Create a .env.local file:

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

⚠️ Do not commit .env.local

🌿 Git Workflow
Branch Structure
main → production (stable)
dev  → integration branch
Personal Branches

Each team member works on their own branch:

sandrine
john
alice
eric
Workflow
# Get latest code
git checkout dev
git pull origin dev

# Create your branch
git checkout -b your-name

# Work and commit
git add .
git commit -m "feat: add feature"

# Push
git push origin your-name

# Open Pull Request → dev
Rules
❌ Do not push directly to main
❌ Do not merge directly to main
✅ Always merge into dev first
📏 Code Standards
TypeScript only
Tailwind CSS only
Clean and modular code
Reusable components
📦 Scripts
npm run dev
npm run build
npm run lint
npm run format
🚀 Deployment
Hosted on Vercel
Auto-deploy on merge to main

🌐 https://bora-ai.vercel.app

🏆 Hackathon Goal

To deliver a production-ready AI recruitment system that stands out in:

Real-world impact
AI explainability
Engineering quality
User experience
👥 Team

Built by Team BORA for the Umurava AI Hackathon 2026 🚀
