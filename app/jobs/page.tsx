'use client';

import React from 'react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import JobTable from '@/components/JobTable';

export default function JobsListingPage() {
  return (
    <div className="flex flex-col h-full bg-dark">
      <TopNav />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-cream/20 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-cream mb-4">Jobs Portal</h1>
            <p className="text-cream/60 font-medium text-md">Manage and track your active recruitment campaigns</p>
          </div>
          <Link href="/jobs/create">
            <button className="cursor-pointer w-full py-3 px-6 bg-cream text-dark font-semibold text-md rounded-md hover:bg-white transition-all shadow-xl">
              Post New Job
            </button>
          </Link>
        </div>

        <JobTable />
      </div>
    </div>
  );
}
