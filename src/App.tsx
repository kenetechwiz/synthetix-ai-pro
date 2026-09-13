import React, { useState, useEffect } from 'react';
import {
  NavPage,
  AIAgent,
  ActivityLog,
  ApiEndpointTelemetry,
  UserSettings,
  ApiKeyData,
  ToastMessage,
} from './types';
import {
  INITIAL_AGENTS,
  INITIAL_LOGS,
  MOCK_NEW_LOG_MESSAGES,
  INITIAL_ENDPOINTS,
  INITIAL_USER_SETTINGS,
  INITIAL_API_KEYS,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { DashboardPage } from './components/Dashboard/DashboardPage';
import { AgentsPage } from './components/Agents/AgentsPage';
import { AnalyticsPage } from './components/Analytics/AnalyticsPage';
import { SettingsPage } from './components/Settings/SettingsPage';

export default function App() {
  // Navigation state
  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Primary platform state
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [endpoints, setEndpoints] = useState<ApiEndpointTelemetry[]>(INITIAL_ENDPOINTS);
  const [userSettings, setUserSettings] = useState<UserSettings>(INITIAL_USER_SETTINGS);
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>(INITIAL_API_KEYS);

  // System states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefreshingLogs, setIsRefreshingLogs] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast helper
  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Agent Active / Paused status
  const handleToggleAgentStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? {
              ...agent,
              status: agent.status === 'active' ? 'paused' : 'active',
            }
          : agent
      )
    );
  };

  // Deploy new custom agent
  const handleDeployAgent = (newAgent: AIAgent) => {
    setAgents((prev) => [newAgent, ...prev]);
  };

  // Refresh Activity Feed logs (simulates real incoming system telemetry)
  const handleRefreshLogs = () => {
    setIsRefreshingLogs(true);

    setTimeout(() => {
      // Pick random simulated message
      const randomSeed =
        MOCK_NEW_LOG_MESSAGES[Math.floor(Math.random() * MOCK_NEW_LOG_MESSAGES.length)];
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        level: randomSeed.level,
        agentName: randomSeed.agentName,
        message: randomSeed.message,
        latencyMs: Math.round(randomSeed.latencyMs * (0.9 + Math.random() * 0.2)),
        tokens: randomSeed.tokens,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 49)]); // Keep up to 50 logs
      setIsRefreshingLogs(false);
      showToast(
        'Telemetry Logs Refreshed',
        `New event ingested from ${newLog.agentName}.`,
        newLog.level === 'error' ? 'warning' : 'info'
      );
    }, 350);
  };

  // Clear Activity Feed
  const handleClearLogs = () => {
    setLogs([]);
    showToast('Activity Log Cleared', 'In-memory telemetry buffer reset.', 'info');
  };

  // Global telemetry sync
  const handleSyncAllTelemetry = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      // Add slight jitter to endpoints and stats to simulate real-time live telemetry
      setEndpoints((prev) =>
        prev.map((ep) => ({
          ...ep,
          requests24h: ep.requests24h + Math.floor(Math.random() * 45),
          avgLatencyMs: Math.max(12, ep.avgLatencyMs + Math.floor((Math.random() - 0.5) * 6)),
        }))
      );

      // Also ingest a new log
      const randomSeed =
        MOCK_NEW_LOG_MESSAGES[Math.floor(Math.random() * MOCK_NEW_LOG_MESSAGES.length)];
      const freshLog: ActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        level: 'success',
        agentName: 'synth-core-v3',
        message: 'Global cluster heartbeat sync acknowledged across all 6 regions.',
        latencyMs: 38,
        tokens: 120,
      };
      setLogs((prev) => [freshLog, ...prev.slice(0, 49)]);

      setIsRefreshing(false);
      showToast(
        'Telemetry Synchronized',
        'Global edge mesh and model runners polled successfully.',
        'success'
      );
    }, 600);
  };

  const activeAgentsCount = agents.filter((a) => a.status === 'active').length;

  return (
    <div id="synthetix-platform-root" className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Persistent Left-Hand Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setIsMobileSidebarOpen(false);
        }}
        activeAgentsCount={activeAgentsCount}
        totalAgentsCount={agents.length}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Layout Area (offset for desktop sidebar) */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activePage={activePage}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          recentLogs={logs}
          onRefreshAll={handleSyncAllTelemetry}
          isRefreshing={isRefreshing}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dynamic Page Views */}
        <main id="main-content-viewport" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardPage
              agents={agents}
              logs={logs}
              onRefreshLogs={handleRefreshLogs}
              onClearLogs={handleClearLogs}
              isRefreshingLogs={isRefreshingLogs}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'agents' && (
            <AgentsPage
              agents={agents}
              onToggleStatus={handleToggleAgentStatus}
              onDeployAgent={handleDeployAgent}
              onShowToast={showToast}
            />
          )}

          {activePage === 'analytics' && (
            <AnalyticsPage
              endpoints={endpoints}
              onShowToast={showToast}
            />
          )}

          {activePage === 'settings' && (
            <SettingsPage
              settings={userSettings}
              onUpdateSettings={setUserSettings}
              apiKeys={apiKeys}
              onUpdateApiKeys={setApiKeys}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}
