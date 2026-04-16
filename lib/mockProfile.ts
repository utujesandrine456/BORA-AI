import { TalentProfile } from "@/lib/types/profile";

export const mockProfile: TalentProfile = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    headline: "Senior Full Stack Engineer | AI & Cloud Architecture",
    bio: "Passionate software architect with 8+ years of experience in building scalable web applications and AI-driven solutions. Expert in TypeScript, React, Node.js, and specialized in integrating LLMs into production workflows. Committed to clean code, mentoring, and continuous learning.",
    location: "Kigali, Rwanda",
    socialLinks: {
        linkedin: "https://linkedin.com/in/janedoe",
        github: "https://github.com/janedoe",
        portfolio: "https://janedoe.dev"
    },
    availability: {
        status: "Available",
        type: "Full-time",
        startDate: "2026-05-01"
    },
    skills: [
        { name: "TypeScript", level: "Expert", yearsOfExperience: 6 },
        { name: "React", level: "Expert", yearsOfExperience: 7 },
        { name: "Node.js", level: "Advanced", yearsOfExperience: 5 },
        { name: "Next.js", level: "Expert", yearsOfExperience: 4 },
        { name: "Python", level: "Intermediate", yearsOfExperience: 3 },
        { name: "PostgreSQL", level: "Advanced", yearsOfExperience: 5 },
        { name: "Docker", level: "Intermediate", yearsOfExperience: 3 }
    ],
    languages: [
        { name: "English", proficiency: "Native" },
        { name: "French", proficiency: "Fluent" },
        { name: "Kinyarwanda", proficiency: "Native" }
    ],
    experience: [
        {
            company: "TechPulse Solutions",
            role: "Lead Backend Engineer",
            startDate: "2022-03",
            endDate: "Present",
            description: "Leading the development of a microservices architecture for a high-traffic e-commerce platform. Improved system response time by 40% through redis caching and query optimization.",
            technologies: ["Node.js", "Redis", "PostgreSQL", "AWS"],
            isCurrent: true
        },
        {
            company: "Innovate AI",
            role: "Full Stack Developer",
            startDate: "2019-06",
            endDate: "2022-02",
            description: "Developed and deployed multiple AI-powered features using OpenAI API. Built a custom CRM dashboard for internal use with React and Redux.",
            technologies: ["React", "Python", "Flask", "OpenAI"],
            isCurrent: false
        }
    ],
    education: [
        {
            institution: "University of Rwanda",
            degree: "Bachelor's",
            fieldOfStudy: "Computer Science",
            startYear: 2015,
            endYear: 2019
        }
    ],
    certifications: [
        {
            name: "AWS Certified Developer – Associate",
            issuer: "Amazon Web Services",
            issueDate: "2023-11"
        },
        {
            name: "Professional Cloud Architect",
            issuer: "Google Cloud",
            issueDate: "2024-01"
        }
    ],
    projects: [
        {
            name: "BORA Screening Tool",
            description: "An AI-powered candidate screening platform that automates the recruitment process by scoring talent based on specific job requirements.",
            technologies: ["Next.js", "Tailwind CSS", "Gemini API"],
            role: "Lead Frontend Engineer",
            link: "https://bora.app",
            startDate: "2025-10",
            endDate: "2026-04"
        },
        {
            name: "EcoTrack",
            description: "A community-based platform for tracking and reporting local environmental issues.",
            technologies: ["React Native", "Firebase", "Google Maps SDK"],
            role: "Founder & Developer",
            link: "https://ecotrack.rw",
            startDate: "2021-01",
            endDate: "2021-12"
        }
    ]
};
