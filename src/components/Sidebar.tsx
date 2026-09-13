import React from 'react';
import { NavPage } from '../types';
import {
  LayoutDashboard,
  Bot,
  BarChart3,
  Settings,
  Cpu,
  ShieldCheck,
  Zap,
  Radio,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  activeAgentsCount: number;
  totalAgentsCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  activeAgentsCount,
  totalAgentsCount,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavPage,
      label: 'Dashboard',
      description: 'KPIs & Telemetry',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      id: 'agents' as NavPage,
      label: 'AI Agents',
      description: 'Models & Runners',
      icon: Bot,
      badge: `${activeAgentsCount}/${totalAgentsCount}`,
    },
    {
      id: 'analytics' as NavPage,
      label: 'Analytics & Perf',
      description: 'API & Traffic Metrics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings' as NavPage,
      label: 'Settings',
      description: 'Keys & Platform Config',
      icon: Settings,
      badge: null,
    },
  ];

  const handleNav = (page: NavPage) => {
    onNavigate(page);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 lg:w-72 bg-[#0B101E] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0B101E] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-sans">
                  SYNTHETIX
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide font-medium">
                Autonomous Ops v3.4
              </p>
            </div>
          </div>
        </div>

        {/* System Cluster Status Pill */}
        <div className="px-4 pt-4 pb-2">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Cluster: us-central1</p>
                <p className="text-[10px] text-slate-400 font-mono">SLA 99.98% • Active</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-medium px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Low Latency</span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav id="sidebar-nav" className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Platform Navigation
          </div>

          {navItems.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-200 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 via-indigo-500/10 to-transparent border border-cyan-500/30 text-white shadow-lg shadow-cyan-950/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-r-full shadow-sm shadow-cyan-400" />
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-850 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold tracking-tight">{item.label}</span>
                    <span className="block text-[11px] text-slate-300 font-normal group-hover:text-slate-200">
                      {item.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Security / Compliance Badge */}
        <div className="px-4 py-3 border-t border-slate-800/60">
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="text-[11px]">
              <p className="font-semibold text-slate-200">SOC2 Type II & HIPAA</p>
              <p className="text-slate-300 font-mono text-[10px]">Zero data retention active</p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
                AM
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">Alex Mercer</p>
                <p className="text-[10px] text-slate-300 truncate">alex.mercer@synthetix.ai</p>
              </div>
            </div>
            <button
              onClick={() => handleNav('settings')}
              id="sidebar-user-settings-btn"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
              title="Open Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
