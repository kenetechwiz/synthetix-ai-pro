import React from 'react';
import { ActivityLog, AIAgent, NavPage } from '../../types';
import { RevenueChart } from './RevenueChart';
import { ActivityFeed } from './ActivityFeed';
import {
  DollarSign,
  Bot,
  Zap,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  Server,
  Layers,
  Cpu,
} from 'lucide-react';

interface DashboardPageProps {
  agents: AIAgent[];
  logs: ActivityLog[];
  onRefreshLogs: () => void;
  onClearLogs: () => void;
  isRefreshingLogs: boolean;
  onNavigate: (page: NavPage) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  agents,
  logs,
  onRefreshLogs,
  onClearLogs,
  isRefreshingLogs,
  onNavigate,
}) => {
  const activeAgents = agents.filter((a) => a.status === 'active');
  const avgLatency = Math.round(
    agents.reduce((acc, curr) => acc + curr.avgLatencyMs, 0) / agents.length
  );
  const totalRequests = agents.reduce((acc, curr) => acc + curr.requestsServed, 0);

  const kpis = [
    {
      id: 'kpi-revenue',
      title: 'Total Platform Revenue',
      value: '$184,920.00',
      change: '+18.4%',
      trend: 'up' as const,
      period: 'vs previous 30 days',
      icon: DollarSign,
      iconColor: 'text-cyan-400',
      bgGlow: 'from-cyan-500/10 to-transparent',
      borderColor: 'border-cyan-500/20',
      sparkline: [20, 32, 28, 45, 52, 60, 78],
    },
    {
      id: 'kpi-agents',
      title: 'Active AI Agents',
      value: `${activeAgents.length} / ${agents.length}`,
      subvalue: `${Math.round((activeAgents.length / agents.length) * 100)}% Online`,
      change: '+2 deployed today',
      trend: 'up' as const,
      period: 'autonomous pool',
      icon: Bot,
      iconColor: 'text-indigo-400',
      bgGlow: 'from-indigo-500/10 to-transparent',
      borderColor: 'border-indigo-500/20',
      sparkline: [3, 3, 4, 4, 5, 5, activeAgents.length],
    },
    {
      id: 'kpi-latency',
      title: 'Median API Latency',
      value: `${avgLatency} ms`,
      change: '-14 ms (-8.9%)',
      trend: 'down' as const, // down is good for latency!
      trendGood: true,
      period: 'global edge mesh',
      icon: Zap,
      iconColor: 'text-amber-400',
      bgGlow: 'from-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/20',
      sparkline: [180, 165, 158, 150, 145, 142, avgLatency],
    },
    {
      id: 'kpi-health',
      title: 'System Health & SLA',
      value: '99.98%',
      change: 'Nominal (+0.02%)',
      trend: 'up' as const,
      period: 'zero degradation',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/20',
      sparkline: [99.8, 99.9, 99.95, 99.96, 99.97, 99.98, 99.98],
    },
  ];

  return (
    <div id="dashboard-page" className="space-y-6 pb-12">
      {/* Top Banner Alert / Highlights */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-slate-900/60 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Synthetix Cluster v3.4 Active & Auto-Balancing
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Handling {totalRequests.toLocaleString()} aggregate requests with multi-model
              failover and automated prompt caching enabled.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('agents')}
          id="dashboard-explore-agents-btn"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Manage Active Agents</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const isPositive = kpi.trendGood !== undefined ? kpi.trendGood : kpi.trend === 'up';

          return (
            <div
              key={kpi.id}
              id={kpi.id}
              className={`relative overflow-hidden p-5 rounded-2xl bg-slate-900/80 border ${kpi.borderColor} backdrop-blur-sm transition-all duration-200 hover:border-slate-700 hover:shadow-xl`}
            >
              {/* Subtle gradient background glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${kpi.bgGlow} opacity-60 pointer-events-none`}
              />

              <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 tracking-wide">
                    {kpi.title}
                  </span>
                  <div className={`p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 ${kpi.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                      {kpi.value}
                    </span>
                    {kpi.subvalue && (
                      <span className="text-xs font-mono text-slate-400">{kpi.subvalue}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-1">
                      {isPositive ? (
                        <span className="flex items-center text-xs font-bold text-emerald-400">
                          <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                          {kpi.change}
                        </span>
                      ) : (
                        <span className="flex items-center text-xs font-bold text-rose-400">
                          <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                          {kpi.change}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 ml-1 truncate">{kpi.period}</span>
                    </div>

                    {/* Mini SVG Sparkline */}
                    <svg className="w-14 h-5 overflow-visible" viewBox="0 0 70 20">
                      <polyline
                        fill="none"
                        stroke={isPositive ? '#34d399' : '#f87171'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={kpi.sparkline
                          .map((val, idx) => {
                            const min = Math.min(...kpi.sparkline);
                            const max = Math.max(...kpi.sparkline) || 1;
                            const x = (idx / (kpi.sparkline.length - 1)) * 68 + 1;
                            const y = 18 - ((val - min) / (max - min || 1)) * 14;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Chart (7 cols on large screens) */}
        <div className="lg:col-span-7 space-y-6">
          <RevenueChart />

          {/* Quick Model Allocation Bar */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white font-sans">
                  Active Model Fleet Distribution
                </h4>
              </div>
              <button
                onClick={() => onNavigate('agents')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                <span>View all {agents.length} agents</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="h-3 rounded-full bg-slate-950 overflow-hidden flex p-0.5 border border-slate-800">
                <div style={{ width: '42%' }} className="bg-cyan-500 rounded-l-full" title="Gemini (42%)" />
                <div style={{ width: '28%' }} className="bg-indigo-500" title="Claude (28%)" />
                <div style={{ width: '18%' }} className="bg-emerald-500" title="GPT-4o (18%)" />
                <div style={{ width: '12%' }} className="bg-purple-500 rounded-r-full" title="DeepSeek (12%)" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span className="text-slate-300">Gemini 2.0 (42%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-slate-300">Claude 3.5 (28%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-300">GPT-4o (18%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-slate-300">DeepSeek (12%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live-Updating Activity Feed (5 cols on large screens) */}
        <div className="lg:col-span-5">
          <ActivityFeed
            logs={logs}
            onRefreshLogs={onRefreshLogs}
            onClearLogs={onClearLogs}
            isRefreshing={isRefreshingLogs}
          />
        </div>
      </div>
    </div>
  );
};
