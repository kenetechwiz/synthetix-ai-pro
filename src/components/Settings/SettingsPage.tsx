import React, { useState } from 'react';
import { UserSettings, ApiKeyData } from '../../types';
import {
  Settings,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  Shield,
  Bell,
  Sliders,
  User,
  Mail,
  Building,
  CheckCircle2,
  Trash2,
  Plus,
} from 'lucide-react';

interface SettingsPageProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  apiKeys: ApiKeyData[];
  onUpdateApiKeys: (keys: ApiKeyData[]) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  apiKeys,
  onUpdateApiKeys,
  onShowToast,
}) => {
  // Local form state
  const [profileName, setProfileName] = useState(settings.profileName);
  const [email, setEmail] = useState(settings.email);
  const [organization, setOrganization] = useState(settings.organization);
  const [role, setRole] = useState(settings.role);
  const [environment, setEnvironment] = useState(settings.environment);

  // Notifications toggles
  const [notifyOnSpikes, setNotifyOnSpikes] = useState(settings.notifyOnSpikes);
  const [notifyOnErrors, setNotifyOnErrors] = useState(settings.notifyOnErrors);
  const [dailyDigest, setDailyDigest] = useState(settings.dailyDigest);
  const [rateLimitPerMin, setRateLimitPerMin] = useState(settings.rateLimitPerMin);

  // API Key state
  const [revealedKeyIds, setRevealedKeyIds] = useState<Record<string, boolean>>({});
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Handle Account Preferences Save
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      const updated: UserSettings = {
        profileName: profileName.trim(),
        email: email.trim(),
        organization: organization.trim(),
        role: role.trim(),
        environment,
        notifyOnSpikes,
        notifyOnErrors,
        dailyDigest,
        rateLimitPerMin,
      };

      onUpdateSettings(updated);
      setIsSaving(false);
      onShowToast(
        'Preferences Saved Successfully',
        'Account credentials, environment scope, and notification profiles were updated.',
        'success'
      );
    }, 400);
  };

  // Toggle Reveal / Hide Key
  const handleToggleRevealKey = (id: string) => {
    setRevealedKeyIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Functional Copy Key with Clipboard Feedback
  const handleCopyKey = (keyItem: ApiKeyData) => {
    navigator.clipboard.writeText(keyItem.key);
    setCopiedKeyId(keyItem.id);
    setTimeout(() => setCopiedKeyId(null), 2000);

    onShowToast(
      'API Key Copied to Clipboard',
      `Secret key for ${keyItem.name} copied successfully.`,
      'info'
    );
  };

  // Generate / Roll New Key
  const handleRollKey = (id: string) => {
    const randomHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const newKeyStr = `sk_live_synth_${randomHex}`;

    const updated = apiKeys.map((k) =>
      k.id === id
        ? {
            ...k,
            key: newKeyStr,
            lastUsed: 'Just generated',
          }
        : k
    );

    onUpdateApiKeys(updated);
    onShowToast(
      'New Secret Key Generated',
      'Old credential revoked and new key active in cluster immediately.',
      'success'
    );
  };

  // Create another key
  const handleCreateNewKey = () => {
    const randomHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const newKey: ApiKeyData = {
      id: `key-${Date.now()}`,
      name: 'Custom Service Worker Key',
      key: `sk_live_synth_${randomHex}`,
      createdAt: 'Today',
      lastUsed: 'Never',
    };
    onUpdateApiKeys([...apiKeys, newKey]);
    onShowToast('API Key Created', 'New service credentials created.', 'success');
  };

  return (
    <div id="settings-page" className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* 1. Account Preferences Form */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight font-sans">
              Account Preferences & Identity
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage your administrator identity, team organization, and deployment environment
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePreferences} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Profile Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Profile Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="settings-profile-name"
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="settings-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="work.email@synthetix.ai"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                />
              </div>
            </div>

            {/* Organization */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Organization Entity
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="settings-organization"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Synthetix Systems"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Platform Role
              </label>
              <input
                id="settings-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Principal Architect"
                className="w-full px-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          {/* Environment Scope */}
          <div className="pt-4 border-t border-slate-800/80">
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Deployment Target Environment
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['production', 'staging', 'development'] as const).map((env) => (
                <button
                  type="button"
                  key={env}
                  id={`settings-env-${env}`}
                  onClick={() => setEnvironment(env)}
                  className={`p-3 rounded-xl border text-left capitalize transition-all ${
                    environment === env
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-md shadow-cyan-950/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{env}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        env === 'production'
                          ? 'bg-emerald-400'
                          : env === 'staging'
                          ? 'bg-amber-400'
                          : 'bg-indigo-400'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {env === 'production'
                      ? 'Multi-region redundancy'
                      : env === 'staging'
                      ? 'Pre-flight sandbox'
                      : 'Local loopback'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications & Alert Toggles */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-cyan-400" />
              Automated Operations Alerts
            </h4>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Anomaly & Latency Spike Alerts
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Notify on Slack when median p99 latency crosses 450ms
                  </span>
                </div>
                <input
                  id="toggle-notify-spikes"
                  type="checkbox"
                  checked={notifyOnSpikes}
                  onChange={(e) => setNotifyOnSpikes(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    High Error Rate Tripwire
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Trigger incident pager if error threshold crosses 1.0% in 5 minutes
                  </span>
                </div>
                <input
                  id="toggle-notify-errors"
                  type="checkbox"
                  checked={notifyOnErrors}
                  onChange={(e) => setNotifyOnErrors(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              id="save-preferences-btn"
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Account Preferences'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Secure API Key Management Card */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight font-sans">
                Secure API Key Management
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentication credentials for SDK routing, webhook proxies, and external pipelines
              </p>
            </div>
          </div>

          <button
            id="generate-new-key-btn"
            onClick={handleCreateNewKey}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 hover:text-white transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Secret Key</span>
          </button>
        </div>

        {/* List of API Keys */}
        <div className="mt-6 space-y-4">
          {apiKeys.map((keyItem) => {
            const isRevealed = !!revealedKeyIds[keyItem.id];
            const isCopied = copiedKeyId === keyItem.id;

            // Mask format: sk_live_••••••••••••••••••••••••3f8a
            const maskedKey = `${keyItem.key.slice(0, 8)}••••••••••••••••••••${keyItem.key.slice(-4)}`;
            const displayKey = isRevealed ? keyItem.key : maskedKey;

            return (
              <div
                key={keyItem.id}
                id={`api-key-card-${keyItem.id}`}
                className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">{keyItem.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      Created {keyItem.createdAt}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Last used: <span className="text-slate-200">{keyItem.lastUsed}</span>
                  </span>
                </div>

                {/* Key value bar with Reveal / Hide and Copy Key buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 select-all overflow-x-auto">
                    {displayKey}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Reveal / Hide Toggle Button */}
                    <button
                      id={`toggle-reveal-key-${keyItem.id}`}
                      onClick={() => handleToggleRevealKey(keyItem.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      title={isRevealed ? 'Hide secret key' : 'Reveal secret key'}
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Reveal</span>
                        </>
                      )}
                    </button>

                    {/* Copy Key Button with Feedback */}
                    <button
                      id={`copy-key-btn-${keyItem.id}`}
                      onClick={() => handleCopyKey(keyItem)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                        isCopied
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300 hover:text-white'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Key</span>
                        </>
                      )}
                    </button>

                    {/* Roll Key */}
                    <button
                      id={`roll-key-btn-${keyItem.id}`}
                      onClick={() => handleRollKey(keyItem.id)}
                      className="p-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                      title="Roll Key (Revoke and regenerate)"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security advisory */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center gap-3 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            API keys possess root cluster execution privileges. Never commit keys to public
            repositories or expose them directly to client-side bundles.
          </span>
        </div>
      </div>
    </div>
  );
};
