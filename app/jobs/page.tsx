'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import JobTable from '@/components/JobTable';
import Button from '@/components/ui/Button';

export default function JobsListingPage() {
  return (
    <div className="flex flex-col h-full bg-dark">
      <TopNav />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-cream/20 pb-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-cream uppercase mb-4">Jobs Portal</h1>
            <p className="text-cream/60 font-medium text-md">Manage and track your active recruitment campaigns</p>
          </div>
          <Link href="/jobs/create">
            <Button variant="primary" icon={Plus} size="lg" className="rounded-md font-semibold text-lg px-6 py-3">
              Post New Job
            </Button>
          </Link>
        </div>

        <JobTable />
      </div>
    </div>
  );
}
