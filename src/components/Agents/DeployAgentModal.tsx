import React, { useState } from 'react';
import { AIAgent } from '../../types';
import { X, Bot, Sparkles, Plus } from 'lucide-react';

interface DeployAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (agent: AIAgent) => void;
}

export const DeployAgentModal: React.FC<DeployAgentModalProps> = ({
  isOpen,
  onClose,
  onDeploy,
}) => {
  const [name, setName] = useState('');
  const [codeName, setCodeName] = useState('');
  const [family, setFamily] = useState('Gemini 2.0 Flash Omni');
  const [role, setRole] = useState('Autonomous Worker');
  const [description, setDescription] = useState('');
  const [temperature, setTemperature] = useState(0.5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAgent: AIAgent = {
      id: `agent-${Date.now()}`,
      name: name.trim(),
      codeName: codeName.trim() || name.toLowerCase().replace(/\s+/g, '-'),
      version: 'v1.0.0',
      family,
      status: 'active',
      uptime: '100.0%',
      requestsServed: 0,
      errorRate: 0.0,
      avgLatencyMs: Math.round(100 + Math.random() * 120),
      temperature,
      maxTokens: 4096,
      description: description.trim() || 'Custom deployed autonomous worker agent.',
      role,
      badgeColor: 'cyan',
    };

    onDeploy(newAgent);
    onClose();
  };

  return (
    <div
      id="deploy-agent-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="deploy-agent-modal"
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                Deploy New Autonomous Agent
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Register a new model runner to the Synthetix mesh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Agent Name</label>
            <input
              id="deploy-agent-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!codeName) {
                  setCodeName(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                }
              }}
              placeholder="e.g., KnowledgeBase Synthesizer"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Code Slug</label>
              <input
                id="deploy-agent-slug"
                type="text"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                placeholder="kb-synthesizer-v1"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Foundational Model
              </label>
              <select
                id="deploy-agent-family"
                value={family}
                onChange={(e) => setFamily(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Gemini 2.0 Flash Omni">Gemini 2.0 Flash Omni</option>
                <option value="Claude 3.5 Sonnet Engine">Claude 3.5 Sonnet Engine</option>
                <option value="GPT-4o DataStream">GPT-4o DataStream</option>
                <option value="DeepSeek R1 Hardened">DeepSeek R1 Hardened</option>
                <option value="Llama 3.3 70B Instruct">Llama 3.3 70B Instruct</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Role & Objective</label>
            <input
              id="deploy-agent-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Real-time Knowledge Extraction"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              id="deploy-agent-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this agent will autonomously orchestrate..."
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-deploy-agent-btn"
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy to Cluster</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
