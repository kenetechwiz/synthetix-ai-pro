import React from 'react';
import { AIAgent } from '../../types';
import {
  Bot,
  Play,
  Pause,
  Zap,
  Clock,
  Sparkles,
  Shield,
  Activity,
  Sliders,
  ChevronRight,
} from 'lucide-react';

interface AgentCardProps {
  agent: AIAgent;
  onToggleStatus: (id: string) => void;
  onTestPrompt: (agent: AIAgent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onToggleStatus,
  onTestPrompt,
}) => {
  const isActive = agent.status === 'active';

  return (
    <div
      id={`agent-card-${agent.id}`}
      className={`group relative p-5 sm:p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between backdrop-blur-sm ${
        isActive
          ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/20'
          : 'bg-slate-950/70 border-slate-800/60 opacity-80 hover:opacity-100 hover:border-slate-700'
      }`}
    >
      {/* Top Accent line */}
      <div
        className={`absolute top-0 left-6 right-6 h-[2px] transition-all ${
          isActive
            ? 'bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent'
            : 'bg-transparent'
        }`}
      />

      <div>
        {/* Card Header: Icon, Name, and Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border transition-colors ${
                isActive
                  ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
              }`}
            >
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {agent.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[11px] text-cyan-400 font-semibold">
                  {agent.codeName}
                </span>
                <span className="text-slate-600 text-xs">•</span>
                <span className="text-[11px] text-slate-400 font-mono">{agent.version}</span>
              </div>
            </div>
          </div>

          {/* Active Status Badge */}
          <div className="flex items-center gap-2">
            <span
              id={`agent-status-badge-${agent.id}`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-mono border transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-950/40'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              {isActive ? 'ACTIVE' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Model Specs & Role */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-mono">
            {agent.family}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
            {agent.role}
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-2">
          {agent.description}
        </p>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/60">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-300 block">Avg Latency</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-white flex items-center gap-1 mt-0.5">
              <Zap className="w-3 h-3 text-amber-400" />
              {agent.avgLatencyMs}ms
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-300 block">Requests</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-cyan-300 mt-0.5 block truncate">
              {(agent.requestsServed / 1000).toFixed(1)}k
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-300 block">Error Rate</span>
            <span
              className={`text-xs sm:text-sm font-bold font-mono mt-0.5 block ${
                agent.errorRate < 0.1 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {agent.errorRate.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Test Prompt & Toggle Status */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {/* Toggle Status Button */}
        <button
          id={`toggle-agent-status-btn-${agent.id}`}
          onClick={() => onToggleStatus(agent.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
            isActive
              ? 'bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-amber-400 border-slate-800 hover:border-amber-500/30'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-sm'
          }`}
          title={isActive ? 'Pause this agent' : 'Resume this agent'}
        >
          {isActive ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              <span>Pause Agent</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
              <span>Resume Agent</span>
            </>
          )}
        </button>

        {/* Test Prompt Button */}
        <button
          id={`test-prompt-btn-${agent.id}`}
          onClick={() => onTestPrompt(agent)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-white transition-all shadow-sm hover:shadow-cyan-950/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Test Prompt</span>
        </button>
      </div>
    </div>
  );
};
