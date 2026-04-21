export type ProficiencyLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type LanguageProficiency = "Basic" | "Conversational" | "Fluent" | "Native";
export type AvailabilityStatus = "Available" | "Open to Opportunities" | "Not Available";
export type EmploymentType = "Full-time" | "Part-time" | "Contract";

export interface Skill {
    name: string;
    level: ProficiencyLevel;
    yearsOfExperience: number;
}

export interface Language {
    name: string;
    proficiency: LanguageProficiency;
}

export interface WorkExperience {
    company: string;
    role: string;
    startDate: string; // YYYY-MM
    endDate: string; // YYYY-MM | Present
    description: string;
    technologies: string[];
    isCurrent: boolean;
}

export interface Education {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: number;
    endYear: number;
}

export interface Certification {
    name: string;
    issuer: string;
    issueDate: string; // YYYY-MM
}

export interface Project {
    name: string;
    description: string;
    technologies: string[];
    role: string;
    link?: string;
    startDate: string; // YYYY-MM
    endDate: string; // YYYY-MM
}

export interface Availability {
    status: AvailabilityStatus;
    type: EmploymentType;
    startDate?: string; // YYYY-MM-DD
}

export interface SocialLinks {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    [key: string]: string | undefined;
}

export interface TalentProfile {
    _id?: string;
    jobId?: string;
    createdAt?: string;
    firstName: string;
    lastName: string;
    email: string;
    headline: string;
    bio?: string;
    location: string;
    skills: Skill[];
    languages?: Language[];
    experience: WorkExperience[];
    education: Education[];
    certifications?: Certification[];
    projects: Project[];
    availability: Availability;
    socialLinks?: SocialLinks;
    // Optional fields returned by the API after screening
    matchScore?: number;
    summary?: string;
}
