import React, { useState } from 'react';
import { NavPage, ActivityLog } from '../types';
import {
  Menu,
  Bell,
  RefreshCw,
  Search,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Sliders,
} from 'lucide-react';

interface HeaderProps {
  activePage: NavPage;
  onOpenMobileSidebar: () => void;
  recentLogs: ActivityLog[];
  onRefreshAll: () => void;
  isRefreshing: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onOpenMobileSidebar,
  recentLogs,
  onRefreshAll,
  isRefreshing,
  searchQuery,
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const pageMeta: Record<NavPage, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Platform Overview',
      subtitle: 'Real-time telemetry, model usage, and autonomous orchestrations',
    },
    agents: {
      title: 'AI Agents Manager',
      subtitle: 'Deploy, test, benchmark, and govern autonomous AI models',
    },
    analytics: {
      title: 'Analytics & Performance',
      subtitle: 'API latency distributions, error ratios, and telemetry exports',
    },
    settings: {
      title: 'Platform Settings',
      subtitle: 'API credentials, cluster configurations, and account preferences',
    },
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Page Titles */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
                {pageMeta[activePage].title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>
            <p className="text-xs text-slate-300 hidden md:block mt-0.5">
              {pageMeta[activePage].subtitle}
            </p>
          </div>
        </div>

        {/* Right: Search, Global Refresh & Notifications */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search agents, APIs..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Refresh telemetry button */}
          <button
            id="header-refresh-btn"
            onClick={onRefreshAll}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              isRefreshing
                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title="Refresh system metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              id="header-notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="View system alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-slate-950">
                {recentLogs.slice(0, 3).length}
              </span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div
                  id="notifications-dropdown"
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        System Feed & Alerts
                      </h4>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                      Live Stream
                    </span>
                  </div>

                  <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                    {recentLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-start gap-2.5 text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-slate-400">
                              {log.agentName}
                            </span>
                            <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                          </div>
                          <p className="text-slate-300 mt-0.5 text-[11px] leading-snug line-clamp-2">
                            {log.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Showing latest telemetry events</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
