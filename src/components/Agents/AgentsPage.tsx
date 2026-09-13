import React, { useState } from 'react';
import { AIAgent } from '../../types';
import { AgentCard } from './AgentCard';
import { TestPromptModal } from './TestPromptModal';
import { DeployAgentModal } from './DeployAgentModal';
import {
  Bot,
  Plus,
  Search,
  Filter,
  Activity,
  CheckCircle2,
  PauseCircle,
  Zap,
  SlidersHorizontal,
} from 'lucide-react';

interface AgentsPageProps {
  agents: AIAgent[];
  onToggleStatus: (id: string) => void;
  onDeployAgent: (agent: AIAgent) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({
  agents,
  onToggleStatus,
  onDeployAgent,
  onShowToast,
}) => {
  const [selectedAgentForTest, setSelectedAgentForTest] = useState<AIAgent | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeAgents = agents.filter((a) => a.status === 'active');
  const pausedAgents = agents.filter((a) => a.status === 'paused');

  // Filtered list
  const filteredAgents = agents.filter((agent) => {
    const matchesStatus =
      statusFilter === 'all' ? true : agent.status === statusFilter;
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.codeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenTestPrompt = (agent: AIAgent) => {
    setSelectedAgentForTest(agent);
    setIsTestModalOpen(true);
  };

  const handleToggle = (id: string) => {
    onToggleStatus(id);
    const agent = agents.find((a) => a.id === id);
    if (agent) {
      const nextStatus = agent.status === 'active' ? 'Paused' : 'Active';
      onShowToast(
        `Agent ${agent.name} ${nextStatus}`,
        `Operational status switched to ${nextStatus.toLowerCase()} instantly.`,
        nextStatus === 'Active' ? 'success' : 'warning'
      );
    }
  };

  return (
    <div id="agents-manager-page" className="space-y-6 pb-12">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Registered</span>
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono mt-1">{agents.length}</p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Across 5 foundational engines
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active Runners</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            {activeAgents.length}
          </p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            {Math.round((activeAgents.length / agents.length) * 100)}% active cluster share
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Paused Runners</span>
            <PauseCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
            {pausedAgents.length}
          </p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">Standby mode</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Mean Response</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono mt-1">
            {Math.round(
              agents.reduce((acc, curr) => acc + curr.avgLatencyMs, 0) / agents.length
            )}{' '}
            ms
          </p>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            -8.4% edge acceleration
          </span>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="agents-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model, code slug, or role..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-sans"
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

          {/* Status Filter Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
            {(['all', 'active', 'paused'] as const).map((filter) => (
              <button
                key={filter}
                id={`filter-agents-${filter}`}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  statusFilter === filter
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter} {filter !== 'all' && `(${filter === 'active' ? activeAgents.length : pausedAgents.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Deploy New Agent Trigger */}
        <button
          id="open-deploy-agent-modal-btn"
          onClick={() => setIsDeployModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy New Model Agent</span>
        </button>
      </div>

      {/* Agents Grid */}
      {filteredAgents.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
          <Bot className="w-12 h-12 mx-auto text-slate-600 mb-3 opacity-60" />
          <h4 className="text-base font-semibold text-white">No agents matched your criteria</h4>
          <p className="text-xs text-slate-400 mt-1">Try resetting your search query or status filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-cyan-400 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onToggleStatus={handleToggle}
              onTestPrompt={handleOpenTestPrompt}
            />
          ))}
        </div>
      )}

      {/* Test Prompt Modal */}
      <TestPromptModal
        agent={selectedAgentForTest}
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onShowToast={onShowToast}
      />

      {/* Deploy Agent Modal */}
      <DeployAgentModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        onDeploy={(newAgent) => {
          onDeployAgent(newAgent);
          onShowToast(
            'Agent Deployed',
            `Successfully deployed ${newAgent.name} to the cluster.`,
            'success'
          );
        }}
      />
    </div>
  );
};
