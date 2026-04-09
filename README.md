🚀 BORA — AI-Powered Recruitment Platform

“Where talent meets its true value”








🌍 Overview

BORA is an AI-powered recruitment platform that helps recruiters screen, evaluate, and shortlist candidates efficiently using intelligent automation — while ensuring humans remain in control of final hiring decisions.

This repository contains the Frontend Application, designed for scalability, speed, and an excellent user experience.

🎯 Problem We Solve

Recruiters face:

High volumes of applications
Difficulty comparing diverse candidate profiles
Time-consuming screening processes

👉 BORA solves this by using AI to:

Analyze applicants
Rank candidates objectively
Provide clear, explainable insights
✨ Key Features
📄 Job creation & management
📂 Resume and applicant uploads (PDF, CSV, Excel)
🧠 AI-powered candidate screening
📊 Ranked shortlist (Top 10 / Top 20)
💡 Explainable AI (strengths, gaps, recommendations)
📈 Insights & analytics dashboard
⚡ Fast, responsive, modern UI
🧱 Tech Stack
Technology	Role
Next.js 14	Frontend Framework
TypeScript	Type Safety
Tailwind CSS	Styling
Redux Toolkit	State Management
React Hook Form + Zod	Form Handling
Recharts	Data Visualization
React Dropzone	File Uploads
Axios	API Communication
Vercel	Deployment
🧠 AI Workflow (Simplified)
Input Collection
Job details (skills, experience, education)
Applicant data (profiles, resumes, spreadsheets)
Data Processing
Extract key candidate information
Normalize structured & unstructured data
Matching & Scoring
Compare candidates to job requirements
Assign scores (0–100) based on relevance
Ranking & Shortlisting
Sort candidates by score
Select Top 10 / Top 20
Explainability
Generate strengths, gaps, and recommendations
📄 Application Pages
Page	Route	Description
Authentication	/login, /register	User login & signup
Dashboard	/dashboard	KPIs & activity overview
Jobs	/jobs	View all jobs
Create Job	/jobs/create	Add new job
Job Details	/jobs/[id]	Run AI screening
Applicants	/applicants	Upload candidates
AI Processing	/screening/loading	AI execution
Results	/screening/results	Ranked shortlist
Candidate Details	/screening/results/[id]	Full profile
History	/history	Past screenings
Insights	/insights	Analytics
Settings	/settings	Preferences
⚙️ Getting Started
# Clone repository
git clone https://github.com/YOUR_ORG/bora-frontend.git
cd bora-frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local

# Start development
npm run dev

🌐 Open: http://localhost:3000

🔐 Environment Variables
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

⚠️ Never commit .env.local

🌿 Git Workflow & Branching Strategy

We follow a professional, scalable workflow.

🔒 Protected Branches
main → production-ready (DO NOT push directly)
dev  → integration branch
👨‍💻 Personal Branches

Each team member works on their own branch:

sandrine
john
alice
eric
🔁 Workflow
# 1. Get latest code
git checkout dev
git pull origin dev

# 2. Create your branch
git checkout -b your-name

# 3. Work and commit
git add .
git commit -m "feat: add dashboard UI"

# 4. Push branch
git push origin your-name

# 5. Open Pull Request → dev

# 6. Merge into dev after review

# 7. dev → main (only when stable)
🚫 Rules
❌ No direct push to main
❌ No direct merge to main
✅ Always go through dev
✅ Keep PRs small and focused
📏 Code Standards
✅ TypeScript only
✅ Tailwind CSS only
✅ Clean, modular code
✅ Reusable components
✅ Consistent naming conventions
📦 Available Scripts
npm run dev      # Development
npm run build    # Production build
npm run lint     # Lint code
npm run format   # Format code
🚀 Deployment
Hosted on Vercel
Auto-deploy on merge to main

🌐 Live URL:
https://bora-ai.vercel.app

📌 Project Vision

To build a scalable AI recruitment assistant that:

Saves recruiter time
Improves hiring quality
Ensures fairness and transparency
🏆 Hackathon Goal

Deliver a production-ready AI system that excels in:

Real-world impact
AI explainability
Engineering quality
User experience
👥 Team BORA

Built for the Umurava AI Hackathon 2026 🚀
