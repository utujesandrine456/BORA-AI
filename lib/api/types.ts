import { TalentProfile } from "../types/profile";

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  role?: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company?: string;
  createdAt: string;
}

export interface Job {
  _id?: string;
  title: string;
  company: string;
  description: string;
  type?: string;
  requirements?: string[];
  skills?: string[];
  experienceYears?: number;
  experienceLevel?: string;
  education?: string;
  location?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileInput extends Omit<TalentProfile, 'socialLinks'> {
  socialLinks?: Record<string, string>;
  jobId?: string; // Optional if tied to a specific job
}

export interface BulkProfileInput {
  profiles: ProfileInput[];
}

export interface ScreeningResult {
  jobId: string;
  profileId: string;
  score: number;
  matchAnalysis: string;
  version: number;
  createdAt: string;
}
