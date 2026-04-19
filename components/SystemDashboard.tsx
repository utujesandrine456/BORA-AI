import React from 'react';
import { Activity, ShieldCheck, Terminal, Server } from 'lucide-react';

export const SystemDashboard = () => {
  return (
    <div className="w-full max-w-lg relative group">
      {/* Dashboard Container */}
      <div className="bg-[#050B18]/60 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="bg-white/5 px-8 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server size={16} className="text-bora-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Neural Infrastructure v4.2</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
        </div>

        {/* content */}
        <div className="p-8 space-y-8">
          {/* Main Visual: Animated Waveform */}
          <div className="h-32 w-full bg-bora-accent/5 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 400 100">
              <path
                d="M0 50 Q 50 20, 100 50 T 200 50 T 300 50 T 400 50"
                fill="none"
                stroke="rgba(59, 130, 246, 0.4)"
                strokeWidth="2"
                className="animate-chart"
                style={{ strokeDasharray: '20, 10' }}
              />
              <path
                d="M0 50 Q 50 80, 100 50 T 200 50 T 300 50 T 400 50"
                fill="none"
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="1"
                className="animate-chart"
                style={{ animationDelay: '-1s' }}
              />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/50 to-transparent" />
            <div className="absolute top-4 left-4 text-[10px] font-bold text-bora-accent/80 uppercase">Processing Load</div>
            <div className="absolute bottom-4 right-4 text-xs font-mono text-white/40">98.4 GigaFLOPS</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Security Badge */}
            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-3 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <ShieldCheck size={24} />
              </div>
              <span className="text-[10px] font-bold text-white/40 uppercase mb-1">Security Status</span>
              <span className="text-xs font-bold text-white">Quantum Secured</span>
            </div>

            {/* Performance Stats */}
            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-bora-accent/10 flex items-center justify-center text-bora-accent mb-3 border border-bora-accent/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Activity size={24} />
              </div>
              <span className="text-[10px] font-bold text-white/40 uppercase mb-1">Latency</span>
              <span className="text-xs font-bold text-white">0.034ms</span>
            </div>
          </div>

          {/* Console */}
          <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-[10px] leading-relaxed relative overflow-hidden h-24">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-bora-accent/30 animate-scan pointer-events-none" />
            <div className="text-bora-accent mb-1 flex items-center gap-2">
              <Terminal size={10} />
              <span>TERMINAL RECLOG-01</span>
            </div>
            <div className="space-y-1 text-white/60">
              <p>&gt; NEURAL_ENGINE_INIT: <span className="text-green-400">SUCCESS</span></p>
              <p>&gt; SYNCING_NODE_ALPHA... <span className="text-bora-accent italic">100%</span></p>
              <p>&gt; SECURITY_GATE_ACTIVE: <span className="text-green-400">LEVEL_5</span></p>
              <p className="animate-pulse">&gt; WAITING_FOR_OPERATIVE_ID_</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Outer Ring */}
      <div className="absolute -inset-4 bg-bora-accent/5 rounded-[2.5rem] -z-10 blur-xl group-hover:bg-bora-accent/10 transition-all duration-1000" />
    </div>
  );
};
