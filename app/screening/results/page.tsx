"use client";

import React, { useState } from 'react';
import { 
  Filter, 
  Trophy, 
  Download, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const candidates = [
  { id: 1, name: 'Alex Johnson', score: 95, isBest: true, barColor: 'bg-emerald-500' },
  { id: 2, name: 'Sarah Williams', score: 92, isBest: false, barColor: 'bg-emerald-500' },
  { id: 3, name: 'Michael Chen', score: 88, isBest: false, barColor: 'bg-blue-500' },
  { id: 4, name: 'Emma Davis', score: 85, isBest: false, barColor: 'bg-blue-500' },
  { id: 5, name: 'James Wilson', score: 82, isBest: false, barColor: 'bg-blue-500' },
];

export default function ScreeningResultsPage() {
  const [activeCandidateId, setActiveCandidateId] = useState(1);

  return (
    <div className="flex flex-col h-full bg-dark text-cream">
      <TopNav />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto pb-20">
          
          <div className="mb-10 border-b border-cream/20 pb-8">
            <h1 className="text-4xl md:text-5xl font-black text-cream tracking-tight mb-3">Screening results</h1>
            <p className="text-cream/60 font-medium text-md">
              Senior Frontend Developer • Analyzed 5 candidates
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card padding="md" className="h-[800px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-cream">Top candidates</h2>
                  <button className="text-cream/60 hover:text-cream transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <select className="w-full bg-dark border border-cream/20 rounded-md px-4 py-3 text-sm text-cream font-bold outline-none focus:border-cream cursor-pointer appearance-none">
                    <option>All Scores</option>
                    <option>Top Matches</option>
                  </select>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {candidates.map((candidate, index) => {
                    const isActive = activeCandidateId === candidate.id;
                    return (
                      <div 
                        key={candidate.id}
                        onClick={() => setActiveCandidateId(candidate.id)}
                        className={`p-5 rounded-md border cursor-pointer transition-all ${
                          isActive 
                            ? 'bg-cream/10 border-cream border-l-4 border-l-emerald-500' 
                            : 'bg-cream/5 border-cream/10 border-l-4 border-l-transparent hover:border-cream/30'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            {candidate.isBest ? (
                              <div className="text-amber-400">
                                <Trophy className="w-5 h-5" />
                              </div>
                            ) : (
                              <div className="text-cream/40 font-black text-sm">
                                #{index + 1}
                              </div>
                            )}
                            <div className="font-semibold text-cream text-md">{candidate.name}</div>
                          </div>
                          <div className="font-black text-lg">{candidate.score}%</div>
                        </div>

                        {candidate.isBest && isActive && (
                          <div className="inline-block px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded mb-3">
                            Best Match
                          </div>
                        )}
                        
                        <div className="w-full bg-dark/50 h-1.5 rounded-full overflow-hidden mt-2">
                          <div 
                            className={`h-full rounded-full ${candidate.barColor}`}
                            style={{ width: `${candidate.score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card padding="lg" className="min-h-[800px]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 pb-8 border-b border-cream/10">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-cream tracking-tight mb-2">Alex Johnson</h2>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-cream leading-none">95%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Link href={`/applicants/${activeCandidateId}`}>
                      <Button variant="primary" className="px-6 py-3 font-bold rounded-md">
                        View Details
                      </Button>
                    </Link>
                    <button className="p-3 border border-cream/20 rounded-md cursor-pointer hover:bg-cream/10 transition-colors text-cream hidden sm:block">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Best Match Alert */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-md p-5 mb-10 flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <span className="text-emerald-500 font-bold text-sm">
                    Best Match - Top candidate for this position
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  {[
                    { label: 'Skills', value: '98%' },
                    { label: 'Experience', value: '95%' },
                    { label: 'Education', value: '90%' },
                    { label: 'Relevance', value: '97%' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-cream/5 border border-cream/10 rounded-md p-6 text-center hover:bg-cream/10 transition-colors">
                      <div className="text-3xl font-black text-cream mb-1">{stat.value}</div>
                      <div className="text-xs text-cream/60 font-bold">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Strengths */}
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-cream mb-6 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    Strengths
                  </h3>
                  <ul className="space-y-4 ml-2">
                    {[
                      "8 years React development experience",
                      "Strong TypeScript and GraphQL expertise",
                      "Led multiple frontend teams",
                      "Open source contributions in relevant tech stack"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-cream/80 font-medium">
                        <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gaps */}
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-cream mb-6 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-orange-500" />
                    Areas for consideration
                  </h3>
                  <ul className="space-y-4 ml-2">
                    {[
                      "Limited experience with Next.js"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-cream/80 font-medium">
                        <div className="w-2 h-2 mt-2 rounded-full bg-orange-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full h-px bg-cream/10 mb-10" />

                {/* AI Recommendation */}
                <div>
                  <h3 className="text-xl font-bold text-cream mb-4">
                    AI recommendation
                  </h3>
                  <p className="text-cream/80 font-medium leading-relaxed">
                    Highly recommended for interview. Excellent skill match and proven leadership experience. 
                    Their deep understanding of React and GraphQL aligns perfectly with the core requirements, 
                    though some ramp-up time may be needed for Next.js specific patterns.
                  </p>
                </div>

              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
