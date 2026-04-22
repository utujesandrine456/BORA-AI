import { apiClient } from './client';
import { ProfileInput, BulkProfileInput } from './types';
import { TalentProfile } from '../types/profile';

// Extending standard interface for pagination metadata since list is paginated
export interface PaginatedProfiles {
  data: TalentProfile[];
  total: number;
  page: number;
  limit: number;
}

export const profilesApi = {
  addProfile: async (data: ProfileInput): Promise<TalentProfile> => {
    const response = await apiClient.post<TalentProfile>('/v1/profiles', data);
    return response.data;
  },

  getProfiles: async (params?: { jobId?: string; page?: number; limit?: number }): Promise<PaginatedProfiles> => {
    const response = await apiClient.get<PaginatedProfiles>('/v1/profiles', { params });
    return response.data;
  },

  bulkInsertProfiles: async (data: BulkProfileInput): Promise<{ inserted: number; errors: unknown[] }> => {
    const response = await apiClient.post<{ inserted: number; errors: unknown[] }>('/v1/profiles/bulk', data);
    return response.data;
  },

  getProfileById: async (id: string): Promise<TalentProfile> => {
    const response = await apiClient.get<TalentProfile>(`/v1/profiles/${id}`);
    return response.data;
  },

  /**
   * Fetches ALL applicant profiles (paginated internally) and downloads them
   * as a human-readable plain text report directly in the browser.
   */
  downloadApplicantsCSV: async (): Promise<void> => {
    const PAGE_SIZE = 100;
    let page = 1;
    let allProfiles: TalentProfile[] = [];

    // Fetch all pages
    while (true) {
      const res = await apiClient.get<PaginatedProfiles>('/v1/profiles', {
        params: { page, limit: PAGE_SIZE },
      });
      const { data, total } = res.data;
      allProfiles = allProfiles.concat(data);
      if (allProfiles.length >= total || data.length === 0) break;
      page++;
    }

    const val = (v: unknown): string => (v == null || v === '' ? 'N/A' : String(v));
    const divider = '═'.repeat(70);
    const thin    = '─'.repeat(70);

    const lines: string[] = [
      divider,
      '  BORA AI PLATFORM — APPLICANT EXPORT REPORT',
      `  Generated: ${new Date().toLocaleString()}`,
      `  Total applicants: ${allProfiles.length}`,
      divider,
      '',
    ];

    allProfiles.forEach((p, index) => {
      // ── Header ──────────────────────────────────────────────────────────────
      lines.push(`APPLICANT ${index + 1} OF ${allProfiles.length}`);
      lines.push(divider);
      lines.push(`  NAME         : ${val(p.firstName)} ${val(p.lastName)}`);
      lines.push(`  HEADLINE     : ${val(p.headline)}`);
      lines.push(`  EMAIL        : ${val(p.email)}`);
      lines.push(`  LOCATION     : ${val(p.location)}`);
      if (p.matchScore != null) {
        lines.push(`  AI MATCH     : ${p.matchScore}%`);
      }
      lines.push('');

      // ── Bio ─────────────────────────────────────────────────────────────────
      if (p.bio) {
        lines.push('  BIO');
        lines.push(thin);
        lines.push(`  ${p.bio}`);
        lines.push('');
      }

      // ── Summary (AI) ────────────────────────────────────────────────────────
      if (p.summary) {
        lines.push('  AI SUMMARY');
        lines.push(thin);
        lines.push(`  ${p.summary}`);
        lines.push('');
      }

      // ── Skills ──────────────────────────────────────────────────────────────
      if (p.skills?.length > 0) {
        lines.push('  SKILLS');
        lines.push(thin);
        p.skills.forEach((s) => {
          lines.push(`  • ${val(s.name)}  |  Level: ${val(s.level)}  |  Experience: ${val(s.yearsOfExperience)} yr(s)`);
        });
        lines.push('');
      }

      // ── Work Experience ─────────────────────────────────────────────────────
      if (p.experience?.length > 0) {
        lines.push('  WORK EXPERIENCE');
        lines.push(thin);
        p.experience.forEach((e) => {
          lines.push(`  ${val(e.role)} @ ${val(e.company)}`);
          lines.push(`    Period : ${val(e.startDate)} → ${e.isCurrent ? 'Present' : val(e.endDate)}`);
          if (e.description) lines.push(`    About  : ${e.description}`);
          if (e.technologies?.length > 0) {
            lines.push(`    Tech   : ${e.technologies.join(', ')}`);
          }
          lines.push('');
        });
      }

      // ── Education ───────────────────────────────────────────────────────────
      if (p.education?.length > 0) {
        lines.push('  EDUCATION');
        lines.push(thin);
        p.education.forEach((ed) => {
          lines.push(`  ${val(ed.degree)} in ${val(ed.fieldOfStudy)}`);
          lines.push(`    Institution : ${val(ed.institution)}`);
          lines.push(`    Years       : ${val(ed.startYear)} – ${val(ed.endYear)}`);
          lines.push('');
        });
      }

      // ── Certifications ──────────────────────────────────────────────────────
      if (p.certifications?.length) {
        lines.push('  CERTIFICATIONS');
        lines.push(thin);
        p.certifications.forEach((c) => {
          lines.push(`  • ${val(c.name)}  |  Issued by: ${val(c.issuer)}  |  Date: ${val(c.issueDate)}`);
        });
        lines.push('');
      }

      // ── Projects ────────────────────────────────────────────────────────────
      if (p.projects?.length > 0) {
        lines.push('  PROJECTS');
        lines.push(thin);
        p.projects.forEach((pr) => {
          lines.push(`  ${val(pr.name)}  (${val(pr.role)})`);
          if (pr.description) lines.push(`    ${pr.description}`);
          if (pr.technologies?.length > 0) lines.push(`    Tech: ${pr.technologies.join(', ')}`);
          if (pr.link) lines.push(`    Link: ${pr.link}`);
          lines.push('');
        });
      }

      // ── Languages ───────────────────────────────────────────────────────────
      if (p.languages?.length) {
        lines.push('  LANGUAGES');
        lines.push(thin);
        p.languages.forEach((l) => {
          lines.push(`  • ${val(l.name)}  |  ${val(l.proficiency)}`);
        });
        lines.push('');
      }

      // ── Availability ────────────────────────────────────────────────────────
      if (p.availability) {
        lines.push('  AVAILABILITY');
        lines.push(thin);
        lines.push(`  Status : ${val(p.availability.status)}`);
        lines.push(`  Type   : ${val(p.availability.type)}`);
        if (p.availability.startDate) {
          lines.push(`  From   : ${p.availability.startDate}`);
        }
        lines.push('');
      }

      // ── Social Links ────────────────────────────────────────────────────────
      if (p.socialLinks && Object.values(p.socialLinks).some(Boolean)) {
        lines.push('  SOCIAL LINKS');
        lines.push(thin);
        if (p.socialLinks.linkedin) lines.push(`  LinkedIn  : ${p.socialLinks.linkedin}`);
        if (p.socialLinks.github)   lines.push(`  GitHub    : ${p.socialLinks.github}`);
        if (p.socialLinks.portfolio) lines.push(`  Portfolio : ${p.socialLinks.portfolio}`);
        lines.push('');
      }

      lines.push(divider);
      lines.push('');
    });

    lines.push(`END OF REPORT — ${allProfiles.length} applicant(s) exported by BORA AI`);
    lines.push(divider);

    const fileContent = lines.join('\n');

    // Trigger browser download as a .txt file
    if (typeof window !== 'undefined') {
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applicants_${new Date().toISOString().slice(0, 10)}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  },
};
