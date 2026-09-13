import React, { useState } from 'react';
import { ActivityLog, LogLevel } from '../../types';
import {
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  Filter,
  Trash2,
  Zap,
} from 'lucide-react';

interface ActivityFeedProps {
  logs: ActivityLog[];
  onRefreshLogs: () => void;
  onClearLogs: () => void;
  isRefreshing: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  logs,
  onRefreshLogs,
  onClearLogs,
  isRefreshing,
}) => {
  const [filter, setFilter] = useState<'all' | LogLevel>('all');
  const [autoStream, setAutoStream] = useState<boolean>(true);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case 'success':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            OK
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            WARN
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            ERR
          </span>
        );
      case 'info':
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Info className="w-3 h-3" />
            INFO
          </span>
        );
    }
  };

  return (
    <div
      id="activity-feed-card"
      className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold tracking-tight text-white font-sans">
              Autonomous Activity Feed
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {filteredLogs.length} events
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Decentralized agent execution logs, circuit trips, and routing steps
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            id="refresh-logs-btn"
            onClick={onRefreshLogs}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-all shadow-sm hover:shadow-cyan-950/40 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Logs</span>
          </button>

          {/* Clear Logs */}
          <button
            id="clear-logs-btn"
            onClick={onClearLogs}
            className="p-1.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear Activity Feed"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-slate-800/60">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800/80">
          {(['all', 'info', 'success', 'warning', 'error'] as const).map((lvl) => (
            <button
              key={lvl}
              id={`filter-log-${lvl}`}
              onClick={() => setFilter(lvl)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg capitalize transition-all ${
                filter === lvl
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer select-none">
            <input
              id="toggle-auto-stream-feed"
              type="checkbox"
              checked={autoStream}
              onChange={(e) => setAutoStream(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
            />
            <span>Auto-poll stream</span>
          </label>
        </div>
      </div>

      {/* Logs Scroll Area */}
      <div
        id="logs-scroll-area"
        className="flex-1 mt-3 space-y-2.5 overflow-y-auto max-h-[380px] pr-1"
      >
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Activity className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-50" />
            <p className="text-xs">No events match current filter.</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-2 text-xs text-cyan-400 hover:underline"
            >
              Reset to all events
            </button>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              id={`log-entry-${log.id}`}
              className="group p-3 rounded-xl bg-slate-950/50 hover:bg-slate-950/90 border border-slate-800/60 hover:border-slate-700/80 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5">{getLevelBadge(log.level)}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-cyan-300">
                      {log.agentName}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed break-words font-sans">
                    {log.message}
                  </p>
                </div>
              </div>

              {/* Metrics metadata */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{log.latencyMs}ms</span>
                </div>
                {log.tokens && (
                  <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-indigo-300">
                    {log.tokens.toLocaleString()} tok
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer status */}
      <div className="pt-3 mt-auto border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Ingesting telemetry at 42.4 events/sec</span>
        </div>
        <span className="font-mono text-[10px]">Buffer: 500 max</span>
      </div>
    </div>
  );
};
