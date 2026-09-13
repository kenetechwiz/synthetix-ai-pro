import React, { useState } from 'react';
import { REVENUE_CHART_DATA } from '../../data/mockData';
import { DollarSign, Cpu, Activity, TrendingUp } from 'lucide-react';

type TimeRange = '24h' | '7d' | '30d';
type MetricType = 'revenue' | 'tokens' | 'requests';

export const RevenueChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [metric, setMetric] = useState<MetricType>('revenue');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const rawData = REVENUE_CHART_DATA[timeRange];

  // Metric configs
  const metricConfigs = {
    revenue: {
      label: 'Platform Revenue',
      format: (val: number) => `$${val.toLocaleString()}`,
      color: '#06b6d4', // cyan-500
      secondaryColor: '#3b82f6',
      icon: DollarSign,
      unit: 'USD',
      summary: timeRange === '24h' ? '$48,920' : timeRange === '7d' ? '$282,100' : '$1,077,200',
      delta: '+24.6% vs prev period',
    },
    tokens: {
      label: 'Token Throughput',
      format: (val: number) => `${val.toFixed(1)}M tokens`,
      color: '#818cf8', // indigo-400
      secondaryColor: '#c084fc',
      icon: Cpu,
      unit: 'Tokens',
      summary: timeRange === '24h' ? '68.9M' : timeRange === '7d' ? '473.6M' : '1.82B',
      delta: '+31.2% model calls',
    },
    requests: {
      label: 'API Invocations',
      format: (val: number) => `${val.toLocaleString()} reqs`,
      color: '#10b981', // emerald-500
      secondaryColor: '#06b6d4',
      icon: Activity,
      unit: 'Invocations',
      summary: timeRange === '24h' ? '2,499 req' : timeRange === '7d' ? '15,460 req' : '62,200 req',
      delta: '+19.8% capacity',
    },
  };

  const currentConfig = metricConfigs[metric];

  // SVG Chart Geometry
  const width = 800;
  const height = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const values = rawData.map((d) => d[metric]);
  const minValue = 0;
  const maxValue = Math.max(...values) * 1.15 || 100;

  // Calculate coordinates
  const points = rawData.map((d, index) => {
    const x = padding.left + (index / (rawData.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - (d[metric] / maxValue) * innerHeight;
    return { x, y, data: d };
  });

  // Construct smooth SVG path
  const linePath = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prev = points[index - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  }, '');

  // Construct fill area path
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    padding.top + innerHeight
  } L ${points[0].x} ${padding.top + innerHeight} Z`;

  const activePoint = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div
      id="revenue-usage-chart-container"
      className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm"
    >
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tight text-white font-sans">
              Autonomous Operations & Financials
            </h3>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              {currentConfig.delta}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real-time multi-agent billing volume & token inference rates
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            {(['revenue', 'tokens', 'requests'] as MetricType[]).map((m) => (
              <button
                key={m}
                id={`chart-metric-${m}`}
                onClick={() => setMetric(m)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                  metric === m
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            {(['24h', '7d', '30d'] as TimeRange[]).map((tr) => (
              <button
                key={tr}
                id={`chart-range-${tr}`}
                onClick={() => setTimeRange(tr)}
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-lg uppercase transition-all ${
                  timeRange === tr
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Summary Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 font-medium">Window Total</span>
          <p className="text-lg sm:text-xl font-extrabold text-white font-mono mt-0.5">
            {currentConfig.summary}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 font-medium">Peak Rate</span>
          <p className="text-lg sm:text-xl font-extrabold text-cyan-300 font-mono mt-0.5">
            {currentConfig.format(Math.max(...values))}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 font-medium">Mean Average</span>
          <p className="text-lg sm:text-xl font-extrabold text-indigo-300 font-mono mt-0.5">
            {currentConfig.format(Math.round(values.reduce((a, b) => a + b, 0) / values.length))}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 font-medium">Cost per 1k Tokens</span>
          <p className="text-lg sm:text-xl font-extrabold text-emerald-300 font-mono mt-0.5">
            $0.00185
          </p>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full aspect-[16/6] min-h-[220px] max-h-[300px]">
        <svg
          id="interactive-revenue-svg"
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={currentConfig.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={currentConfig.color} stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={currentConfig.color} />
              <stop offset="100%" stopColor={currentConfig.secondaryColor} />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + innerHeight * (1 - ratio);
            const gridVal = minValue + ratio * (maxValue - minValue);
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-500 text-[10px] font-mono"
                >
                  {currentConfig.format(Math.round(gridVal))}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Line Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineStrokeGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points and Interaction Bars */}
          {points.map((pt, i) => {
            const isHovered = hoverIndex === i;
            return (
              <g key={i}>
                {/* Vertical transparent touch/hover strip */}
                <rect
                  x={pt.x - innerWidth / rawData.length / 2}
                  y={padding.top}
                  width={innerWidth / rawData.length}
                  height={innerHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                />

                {/* X-axis labels */}
                <text
                  x={pt.x}
                  y={height - 12}
                  textAnchor="middle"
                  className={`text-[11px] font-mono transition-colors ${
                    isHovered ? 'fill-cyan-400 font-bold' : 'fill-slate-400'
                  }`}
                >
                  {pt.data.label}
                </text>

                {/* Data node point */}
                <circle
                  cx={pt.x}
                  y={pt.y}
                  r={isHovered ? 6 : 3.5}
                  fill={isHovered ? '#ffffff' : currentConfig.color}
                  stroke={currentConfig.secondaryColor}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150 pointer-events-none"
                />
              </g>
            );
          })}

          {/* Hover Crosshair & Tooltip */}
          {activePoint && (
            <g pointerEvents="none">
              <line
                x1={activePoint.x}
                y1={padding.top}
                x2={activePoint.x}
                y2={padding.top + innerHeight}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </g>
          )}
        </svg>

        {/* Dynamic HTML Tooltip */}
        {activePoint && (
          <div
            id="chart-hover-tooltip"
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900/95 border border-cyan-500/40 rounded-xl px-3 py-2 shadow-2xl shadow-cyan-950/60 text-xs backdrop-blur-md transition-all duration-75"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${(activePoint.y / height) * 100 - 4}%`,
            }}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span>{activePoint.data.label}</span>
              <span>•</span>
              <span className="text-cyan-400">{currentConfig.label}</span>
            </div>
            <div className="font-extrabold text-sm text-white font-mono mt-0.5">
              {currentConfig.format(activePoint.data[metric])}
            </div>
          </div>
        )}
      </div>

      {/* Footer Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span>Autonomous Pipeline Rate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
            <span>Inference Cache Hit (89.2%)</span>
          </div>
        </div>
        <span className="font-mono text-[11px] text-slate-400">
          Hover over data points for granular readings
        </span>
      </div>
    </div>
  );
};
