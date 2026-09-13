import React, { useState, useEffect } from 'react';
import { AIAgent } from '../../types';
import {
  X,
  Play,
  Send,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Cpu,
  Clock,
  Zap,
} from 'lucide-react';

interface TestPromptModalProps {
  agent: AIAgent | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export const TestPromptModal: React.FC<TestPromptModalProps> = ({
  agent,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [prompt, setPrompt] = useState(
    'Analyze the following incoming user query, detect intent, and provide a structured JSON response with safety classification.'
  );
  const [temperature, setTemperature] = useState(0.4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generationStats, setGenerationStats] = useState<{
    latencyMs: number;
    tokensGenerated: number;
    speedTokSec: number;
  } | null>(null);

  useEffect(() => {
    if (agent) {
      setTemperature(agent.temperature);
      setGeneratedResponse(null);
      setGenerationStats(null);
    }
  }, [agent]);

  if (!isOpen || !agent) return null;

  const handleSimulateRun = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedResponse(null);

    // Realistic simulation of AI thinking and generation
    setTimeout(() => {
      const simulatedResponses: Record<string, string> = {
        'synth-core-v3': `{\n  "intent": "autonomous_orchestration_request",\n  "confidence": 0.994,\n  "delegated_agent": "codesynth-pro",\n  "safety_score": 1.0,\n  "pipeline_steps": [\n    "1. parse_input_ast",\n    "2. execute_vector_retrieval(namespace='infra')",\n    "3. apply_strict_typecheck()"\n  ],\n  "estimated_cluster_cost": "$0.00034",\n  "status": "APPROVED"\n}`,
        'codesynth-pro': `// Synthetix Autonomous Code Generation\n// Target: Ultra-high performance micro-router\n\nimport { createRouter } from '@synthetix/mesh';\n\nexport const agentGateway = createRouter({\n  rateLimit: { max: 10000, windowMs: 60000 },\n  circuitBreaker: { threshold: 0.05, timeoutMs: 1500 },\n  async handler(req, res) {\n    const telemetry = await req.trace();\n    return res.json({ status: 'healthy', latency: telemetry.duration });\n  }\n});`,
        'dataminer-x': `[\n  { "metric": "qps_rate", "value": 4820.4, "anomaly": false },\n  { "metric": "p99_latency", "value": 142.1, "unit": "ms", "anomaly": false },\n  { "metric": "token_efficiency_ratio", "value": 0.988, "anomaly": false }\n]\n\nAnalysis: All clusters operating within nominal bounds. No semantic drift detected across last 50,000 queries.`,
      };

      const fallbackResponse = `Synthetix autonomous model (${agent.codeName}) evaluated the prompt at temperature ${temperature}:\n\n` +
        `• Intent parsed: High-priority operational directive.\n` +
        `• Execution context: Verified compliant with SOC2 and local sandboxing policies.\n` +
        `• Output verdict: Autonomous execution plan generated with 0 validation warnings.\n` +
        `• Token consumption: 384 input tokens, 192 output tokens.`;

      const responseText = simulatedResponses[agent.codeName] || fallbackResponse;

      setGeneratedResponse(responseText);
      setIsGenerating(false);
      setGenerationStats({
        latencyMs: Math.round(agent.avgLatencyMs * (0.85 + Math.random() * 0.3)),
        tokensGenerated: Math.round(180 + Math.random() * 120),
        speedTokSec: Math.round(65 + Math.random() * 25),
      });

      onShowToast('Prompt Evaluated', `Generated output from ${agent.name}`, 'success');
    }, 900);
  };

  const handleCopy = () => {
    if (!generatedResponse) return;
    navigator.clipboard.writeText(generatedResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('Copied to Clipboard', 'Model inference response copied', 'info');
  };

  return (
    <div
      id="test-prompt-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="test-prompt-modal"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-sans">
                  Test Model: {agent.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {agent.codeName}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {agent.family} • {agent.version}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Temperature & Token Controls */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Temperature
                </span>
                <span className="font-mono text-cyan-400">{temperature}</span>
              </div>
              <input
                id="test-temperature-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Deterministic (0.0)</span>
                <span>Creative (1.0)</span>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-slate-300 font-medium mb-1 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Active Model Parameters
              </span>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  Max tokens: {agent.maxTokens}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  Latency SLA: &lt;{agent.avgLatencyMs * 2}ms
                </span>
              </div>
            </div>
          </div>

          {/* Prompt input field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Input Prompt / Directive
            </label>
            <textarea
              id="test-prompt-textarea"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your system directive or testing prompt..."
              className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 font-mono transition-all resize-none"
            />
          </div>

          {/* Run Action */}
          <div className="flex justify-end gap-2">
            <button
              id="reset-prompt-btn"
              onClick={() =>
                setPrompt(
                  'Analyze the following incoming user query, detect intent, and provide a structured JSON response with safety classification.'
                )
              }
              className="px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Prompt</span>
            </button>
            <button
              id="execute-prompt-btn"
              onClick={handleSimulateRun}
              disabled={isGenerating || !prompt.trim()}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Response...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Test Prompt</span>
                </>
              )}
            </button>
          </div>

          {/* Output Display Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Simulated Inference Output
              </label>
              {generatedResponse && (
                <button
                  id="copy-model-output-btn"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Output'}</span>
                </button>
              )}
            </div>

            <div
              id="model-output-container"
              className={`p-4 rounded-xl border min-h-[140px] flex flex-col justify-between transition-all ${
                generatedResponse
                  ? 'bg-slate-950 border-cyan-500/30'
                  : 'bg-slate-950/40 border-slate-800/80 items-center justify-center'
              }`}
            >
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-6 text-slate-400 space-y-2">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono text-cyan-300">
                    Routing prompt through {agent.codeName}...
                  </span>
                </div>
              ) : generatedResponse ? (
                <>
                  <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {generatedResponse}
                  </pre>
                  {generationStats && (
                    <div className="flex flex-wrap items-center gap-3 pt-3 mt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Clock className="w-3 h-3" />
                        {generationStats.latencyMs} ms
                      </span>
                      <span>•</span>
                      <span className="text-indigo-400">
                        {generationStats.tokensGenerated} tokens
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400">
                        ~{generationStats.speedTokSec} tok/sec
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-500 font-mono text-center">
                  Click &quot;Execute Test Prompt&quot; to test model reasoning and latency.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Target Cluster: us-central1-a (Dedicated VRAM)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
