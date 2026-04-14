'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import JobTable from '@/components/JobTable';
import Button from '@/components/ui/Button';

export default function JobsListingPage() {
  return (
    <div className="flex flex-col h-full">
      <TopNav />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-[40px] font-black text-slate-900 tracking-tight mb-2">Jobs Overview</h1>
          <p className="text-slate-500 font-normal text-lg">Manage and track your active recruitment campaigns</p>
        </div>
        <Link href="/jobs/create">
          <Button variant="primary" icon={Plus} size="lg" className="shadow-xl shadow-[#0c2d48]/20 px-8">
            Post New Job
          </Button>
        </Link>
      </div>

        <JobTable />
      </div>
    </div>
  );
}
