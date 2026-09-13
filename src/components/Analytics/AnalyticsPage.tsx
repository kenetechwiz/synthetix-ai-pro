import React, { useState } from 'react';
import { ApiEndpointTelemetry, EndpointPriority } from '../../types';
import {
  BarChart3,
  Download,
  Filter,
  Search,
  Zap,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  Gauge,
  HardDrive,
  RefreshCw,
} from 'lucide-react';

interface AnalyticsPageProps {
  endpoints: ApiEndpointTelemetry[];
  onShowToast: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ endpoints, onShowToast }) => {
  const [priorityFilter, setPriorityFilter] = useState<EndpointPriority>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof ApiEndpointTelemetry>('requests24h');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isExporting, setIsExporting] = useState(false);

  // Filter endpoints
  const filteredEndpoints = endpoints.filter((ep) => {
    // Priority filter
    if (priorityFilter === 'high' && ep.priority !== 'high' && ep.priority !== 'critical') {
      return false;
    }
    if (priorityFilter === 'errors' && ep.errorRate <= 0.1) {
      return false;
    }
    // Search query
    if (
      searchQuery &&
      !ep.path.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ep.method.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Sort endpoints
  const sortedEndpoints = [...filteredEndpoints].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    }
    return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const handleSort = (field: keyof ApiEndpointTelemetry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Real CSV Generator & Export Handler
  const handleExportCSV = () => {
    setIsExporting(true);

    setTimeout(() => {
      try {
        const headers = ['Method', 'Endpoint Path', 'Priority', '24h Requests', 'Avg Latency (ms)', 'p99 Latency (ms)', 'Error Rate (%)', 'Status'];
        const csvRows = [
          headers.join(','),
          ...sortedEndpoints.map((ep) =>
            [
              ep.method,
              `"${ep.path}"`,
              ep.priority,
              ep.requests24h,
              ep.avgLatencyMs,
              ep.p99LatencyMs,
              ep.errorRate.toFixed(2),
              ep.status,
            ].join(',')
          ),
        ];

        const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
        const link = document.createElement('a');
        link.setAttribute('href', csvContent);
        link.setAttribute('download', `synthetix_api_telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsExporting(false);
        onShowToast(
          'Telemetry Export Complete',
          `Successfully exported ${sortedEndpoints.length} endpoint records to CSV.`,
          'success'
        );
      } catch (err) {
        setIsExporting(false);
        onShowToast('Export Error', 'Failed to generate CSV export.', 'error');
      }
    }, 450);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'POST':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'GET':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'DELETE':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'PUT':
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  const getStatusBadge = (status: ApiEndpointTelemetry['status']) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Healthy
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            Degraded
          </span>
        );
      case 'alert':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            Alert
          </span>
        );
    }
  };

  const totalReqs = endpoints.reduce((sum, e) => sum + e.requests24h, 0);
  const avgClusterLatency = Math.round(
    endpoints.reduce((sum, e) => sum + e.avgLatencyMs, 0) / endpoints.length
  );
  const aggregateErrorRate = (
    endpoints.reduce((sum, e) => sum + e.errorRate, 0) / endpoints.length
  ).toFixed(2);

  return (
    <div id="analytics-performance-page" className="space-y-6 pb-12">
      {/* Top Analytics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Global 24h Traffic</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono mt-1">
            {(totalReqs / 1000000).toFixed(2)}M calls
          </p>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            +14.2% ingress throughput
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Cluster p99 Latency</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-300 font-mono mt-1">312 ms</p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Mean p50: {avgClusterLatency}ms
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Aggregate Error Ratio</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
            {aggregateErrorRate}%
          </p>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            Well below 0.5% SLA limit
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Prompt Cache Hit</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">89.4%</p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Saved ~$3,840 in raw compute
          </span>
        </div>
      </div>

      {/* Action and Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Filter Buttons & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Priority filter buttons: All, High Priority, Errors Only */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              id="filter-endpoints-all"
              onClick={() => setPriorityFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                priorityFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Endpoints ({endpoints.length})
            </button>
            <button
              id="filter-endpoints-high"
              onClick={() => setPriorityFilter('high')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                priorityFilter === 'high'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              High Priority
            </button>
            <button
              id="filter-endpoints-errors"
              onClick={() => setPriorityFilter('errors')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                priorityFilter === 'errors'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Errors Only
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="analytics-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search route or method..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Working Export CSV Button */}
        <button
          id="export-csv-btn"
          onClick={handleExportCSV}
          disabled={isExporting}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-slate-950 hover:bg-slate-850 text-cyan-400 border border-cyan-500/40 rounded-xl shadow-lg shadow-cyan-950/20 transition-all hover:border-cyan-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
          <span>{isExporting ? 'Exporting CSV...' : 'Export CSV Report'}</span>
        </button>
      </div>

      {/* Main Telemetry Table Card */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table id="api-telemetry-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                <th
                  onClick={() => handleSort('path')}
                  className="p-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Endpoint Route</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('priority')}
                  className="p-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('requests24h')}
                  className="p-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>24h Invocations</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('avgLatencyMs')}
                  className="p-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Avg Latency</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('p99LatencyMs')}
                  className="p-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>p99 SLA</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('errorRate')}
                  className="p-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Error Ratio</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-600" />
                  </div>
                </th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {sortedEndpoints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No endpoint records matched the selected filter.
                  </td>
                </tr>
              ) : (
                sortedEndpoints.map((ep) => (
                  <tr
                    key={ep.id}
                    id={`endpoint-row-${ep.id}`}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Route & Method */}
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${getMethodBadge(
                            ep.method
                          )}`}
                        >
                          {ep.method}
                        </span>
                        <span className="font-mono text-slate-200 font-medium group-hover:text-cyan-300 transition-colors">
                          {ep.path}
                        </span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="p-4">
                      <span
                        className={`capitalize font-mono text-[11px] px-2 py-0.5 rounded ${
                          ep.priority === 'critical'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : ep.priority === 'high'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {ep.priority}
                      </span>
                    </td>

                    {/* 24h Volume */}
                    <td className="p-4 font-mono text-white font-bold">
                      {ep.requests24h.toLocaleString()}
                    </td>

                    {/* Avg Latency with mini bar */}
                    <td className="p-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{ep.avgLatencyMs} ms</span>
                        <div className="w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div
                            style={{
                              width: `${Math.min(100, (ep.avgLatencyMs / 500) * 100)}%`,
                            }}
                            className={`h-full rounded-full ${
                              ep.avgLatencyMs > 300 ? 'bg-amber-400' : 'bg-cyan-400'
                            }`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* p99 */}
                    <td className="p-4 font-mono text-slate-300">
                      <span className={ep.p99LatencyMs > 600 ? 'text-rose-400 font-bold' : ''}>
                        {ep.p99LatencyMs} ms
                      </span>
                    </td>

                    {/* Error rate */}
                    <td className="p-4 font-mono">
                      <span
                        className={`font-bold ${
                          ep.errorRate > 1.0
                            ? 'text-rose-400'
                            : ep.errorRate > 0.2
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {ep.errorRate.toFixed(2)}%
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="p-4">{getStatusBadge(ep.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{sortedEndpoints.length}</strong> of{' '}
            <strong className="text-white">{endpoints.length}</strong> endpoints
          </span>
          <span className="font-mono text-[11px]">Auto-aggregated window: Last 24 Hours</span>
        </div>
      </div>
    </div>
  );
};
