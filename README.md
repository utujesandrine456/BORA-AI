<div align="center">

# 🚀 BORA — AI-Powered Recruitment Platform

### *"Where talent meets its true value"*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Status](https://img.shields.io/badge/Status-In_Development-yellow?style=for-the-badge)]()

<br/>

> BORA is an AI-powered recruitment platform that enables recruiters to efficiently  
> screen, rank, and shortlist candidates using intelligent automation —  
> while keeping **humans in control** of final hiring decisions.

<br/>

</div>

---

## 🌍 Overview

This repository contains the **Frontend Application** for BORA, built with a focus on performance, scalability, and user experience.

### 🎯 The Problem

Recruiters today struggle with:

- 📥 High volumes of job applications
- ⏳ Time-consuming manual screening
- 📊 Difficulty comparing diverse candidate profiles

### ✅ How BORA Solves It

- 🤖 Automates candidate evaluation using **Gemini AI**
- 🏆 Provides objective ranking with match scores **(0–100)**
- 💡 Delivers clear, explainable insights per candidate

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 Job Management | Create, edit, and manage job postings |
| 📂 Resume Upload | Support for PDF, CSV, and Excel files |
| 🧠 AI Screening | Gemini-powered candidate analysis |
| 🏆 Candidate Ranking | Shortlist Top 10 or Top 20 automatically |
| 💡 AI Explanations | Strengths, gaps & recommendations per candidate |
| 📈 Insights Dashboard | Analytics, score trends, and skill gaps |
| ⚡ Fast UI | Responsive, modern recruiter-focused interface |

---

## 🧱 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | Frontend Framework |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Styling |
| **Redux Toolkit** | State Management |
| **React Hook Form + Zod** | Forms & Validation |
| **Recharts** | Data Visualization |
| **React Dropzone** | File Uploads |
| **Axios** | API Calls |
| **Vercel** | Deployment |

---

## 🧠 How the AI Works

```
1. 📝  Collect job details and applicant data
2. 📄  Extract key information from resumes
3. 🔍  Compare candidates to job requirements
4. 🎯  Assign match scores (0 – 100)
5. 📊  Rank candidates → Shortlist Top 10 / 20
6. 💬  Generate explanations (strengths, gaps, recommendations)
```

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| 🔐 Login / Register | `/login` `/register` | Authentication |
| 🏠 Dashboard | `/dashboard` | KPIs and activity overview |
| 💼 Jobs | `/jobs` | All job listings |
| ➕ Create Job | `/jobs/create` | Add a new job |
| 🔍 Job Details | `/jobs/[id]` | View job + run AI screening |
| 👥 Applicants | `/applicants` | Manage and upload candidates |
| ⏳ AI Processing | `/screening/loading` | Live AI screening progress |
| 🏆 Results | `/screening/results` | Ranked shortlist with AI explanations |
| 👤 Candidate Details | `/screening/results/[id]` | Full candidate profile |
| 📋 History | `/history` | Past screening sessions |
| 📊 Insights | `/insights` | Analytics and trends |
| ⚙️ Settings | `/settings` | Profile and preferences |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js **v18+**
- npm or yarn
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_ORG/bora-frontend.git
cd bora-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Fill in the values below

# 4. Start the development server
npm run dev
```

Open 👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔐 Environment Variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env.local` to GitHub.** It is already in `.gitignore`.

---

## 🌿 Git Workflow

We follow a structured branching strategy.  
**No one pushes directly to `main` or `dev`.**

### Branch Structure

```
main  →  final production code (protected)
dev   →  integration branch (team merges here first)
your-name  →  your personal working branch
```

### Step by Step

```bash
# 1. Start from latest dev
git checkout dev
git pull origin dev

# 2. Switch to your personal branch
git checkout your-name

# 3. Work and save your progress
git add .
git commit -m "feat: describe what you built"

# 4. Push your branch
git push origin your-name
```

> 👉 Then open a **Pull Request** on GitHub — set `base: dev`

### Personal Branches

```
sandrine   →  team lead + main branch manager
john       →  assigned pages
alice      →  assigned pages
eric       →  assigned pages
```

---

## 📏 Code Standards

- ✅ Use **TypeScript** only — no plain `.js` files
- ✅ Use **Tailwind CSS** only — no inline styles
- ✅ Write clean, modular, reusable components
- ✅ Every PR needs **at least one review** before merging
- ✅ Pull from `dev` **every morning** before starting work

---

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Run Prettier formatter
npm run type-check   # TypeScript check
```

---

## 🚀 Deployment

Hosted on **Vercel** — every merge to `main` triggers an automatic deployment.

```
🌐 Live URL: https://bora-ai.vercel.app
```

---

## 🏆 Hackathon Goal

Build a production-ready AI recruitment system that excels in:

- 🌍 **Real-world impact** — solves a genuine HR problem
- 🤖 **AI explainability** — every decision is transparent
- ⚙️ **Engineering quality** — clean, scalable codebase
- 🎨 **User experience** — intuitive recruiter workflow

---

<div align="center">

**Built with ❤️ by Team BORA · Umurava AI Hackathon 2026 🏆**

</div>
