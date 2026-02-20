'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, Eye, FileText, Settings, Activity, Wifi, WifiOff } from 'lucide-react';

interface Bot {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'connecting';
  lastSeen: string;
  messagesSent: number;
  uptime: string;
}

interface BotConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string;
}

const BOTS: Bot[] = [
  {
    id: 'oliver',
    name: 'Oliver',
    status: 'online',
    lastSeen: '2 minutes ago',
    messagesSent: 1247,
    uptime: '5d 14h 23m',
  },
  {
    id: 'max',
    name: 'Max',
    status: 'online',
    lastSeen: '5 minutes ago',
    messagesSent: 892,
    uptime: '3d 8h 15m',
  },
  {
    id: 'henry',
    name: 'Henry',
    status: 'offline',
    lastSeen: '2 hours ago',
    messagesSent: 634,
    uptime: '1d 4h 12m',
  },
];

const BOT_CONFIGS: Record<string, BotConfig[]> = {
  oliver: [
    {
      name: 'openclaw.json',
      icon: Settings,
      content: `{
  "agent": "main",
  "name": "Oliver",
  "model": "claude-sonnet-4",
  "skills": ["bluebubbles", "web_search", "tts"],
  "personality": "professional",
  "memory_retention": "high"
}`,
    },
    {
      name: 'MEMORY.md',
      icon: FileText,
      content: `# Oliver's Memory

## Recent Conversations
- Helped with customer support for BlueGo AI
- Processed 247 messages in the last 24 hours
- Maintained 98% response accuracy

## Key Learnings
- Customer inquiries mainly about pricing and features
- Most active during business hours (9 AM - 6 PM PST)
- Prefers concise, professional responses`,
    },
    {
      name: 'SOUL.md',
      icon: Activity,
      content: `# Oliver - Professional Assistant

## Core Identity
You are Oliver, a professional AI assistant representing BlueGo AI. Your primary role is customer support and business development.

## Personality
- Professional yet approachable
- Clear and concise communication
- Problem-solving focused
- Always helpful and positive

## Guidelines
- Respond within 30 seconds
- Keep messages under 200 words unless detailed explanation needed
- Always ask follow-up questions to better assist customers`,
    },
  ],
  max: [
    {
      name: 'openclaw.json',
      icon: Settings,
      content: `{
  "agent": "main",
  "name": "Max",
  "model": "claude-sonnet-4",
  "skills": ["bluebubbles", "web_search", "calendar"],
  "personality": "casual",
  "memory_retention": "medium"
}`,
    },
    {
      name: 'MEMORY.md',
      icon: FileText,
      content: `# Max's Memory

## Recent Activities
- Handled 142 casual conversations
- Scheduled 23 meetings this week
- Maintained friendly rapport with users

## Behavioral Patterns
- Users prefer casual, friendly tone
- Often asked about product demos
- Peak usage during afternoons`,
    },
    {
      name: 'SOUL.md',
      icon: Activity,
      content: `# Max - Friendly Assistant

## Core Identity
You are Max, a friendly and casual AI assistant. You handle general inquiries and scheduling.

## Personality
- Casual and friendly
- Uses emojis when appropriate
- Relaxed communication style
- Supportive and encouraging

## Guidelines
- Be conversational and warm
- Use first names when possible
- Keep things light and positive`,
    },
  ],
  henry: [
    {
      name: 'openclaw.json',
      icon: Settings,
      content: `{
  "agent": "main",
  "name": "Henry",
  "model": "claude-sonnet-4",
  "skills": ["bluebubbles", "web_search", "analytics"],
  "personality": "analytical",
  "memory_retention": "high"
}`,
    },
    {
      name: 'MEMORY.md',
      icon: FileText,
      content: `# Henry's Memory

## Data Analysis
- Processed 89 analytical requests
- Generated 15 reports this week
- Tracked user engagement metrics

## Insights
- Users appreciate detailed analysis
- Questions often about ROI and metrics
- Prefers data-driven responses`,
    },
    {
      name: 'SOUL.md',
      icon: Activity,
      content: `# Henry - Analytical Assistant

## Core Identity
You are Henry, an analytical AI assistant focused on data analysis and insights.

## Personality
- Detail-oriented and precise
- Data-driven approach
- Thorough and methodical
- Strategic thinking

## Guidelines
- Always back claims with data
- Provide actionable insights
- Use charts and metrics when helpful`,
    },
  ],
};

export default function DashboardPage() {
  const [expandedBots, setExpandedBots] = useState<Set<string>>(new Set());
  const [expandedConfigs, setExpandedConfigs] = useState<Set<string>>(new Set());

  const toggleBot = (botId: string) => {
    const newExpanded = new Set(expandedBots);
    if (expandedBots.has(botId)) {
      newExpanded.delete(botId);
      // Also collapse all configs for this bot
      BOT_CONFIGS[botId]?.forEach(config => {
        expandedConfigs.delete(`${botId}-${config.name}`);
      });
      setExpandedConfigs(new Set(expandedConfigs));
    } else {
      newExpanded.add(botId);
    }
    setExpandedBots(newExpanded);
  };

  const toggleConfig = (botId: string, configName: string) => {
    const configKey = `${botId}-${configName}`;
    const newExpanded = new Set(expandedConfigs);
    if (expandedConfigs.has(configKey)) {
      newExpanded.delete(configKey);
    } else {
      newExpanded.add(configKey);
    }
    setExpandedConfigs(newExpanded);
  };

  const getStatusColor = (status: Bot['status']) => {
    switch (status) {
      case 'online':
        return 'text-green-400';
      case 'offline':
        return 'text-red-400';
      case 'connecting':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: Bot['status']) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-green-400" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-red-400" />;
      case 'connecting':
        return <Wifi className="w-4 h-4 text-yellow-400 animate-pulse" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-200">Fleet Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage your AI bot fleet
          </p>
        </div>
        <div className="text-sm text-gray-400">
          {BOTS.filter(bot => bot.status === 'online').length} of {BOTS.length} bots online
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Messages</p>
              <p className="text-2xl font-semibold text-gray-200">
                {BOTS.reduce((sum, bot) => sum + bot.messagesSent, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Bots</p>
              <p className="text-2xl font-semibold text-gray-200">
                {BOTS.filter(bot => bot.status === 'online').length}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <Wifi className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Response Time</p>
              <p className="text-2xl font-semibold text-gray-200">1.2s</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bot List */}
      <div className="space-y-4">
        {BOTS.map((bot) => {
          const isExpanded = expandedBots.has(bot.id);
          const configs = BOT_CONFIGS[bot.id] || [];

          return (
            <div key={bot.id} className="bg-gray-900/50 border border-gray-800 rounded-lg">
              <div
                className="p-6 cursor-pointer hover:bg-gray-800/30 transition-colors"
                onClick={() => toggleBot(bot.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <h3 className="text-lg font-medium text-gray-200">{bot.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(bot.status)}
                      <span className={`text-sm capitalize ${getStatusColor(bot.status)}`}>
                        {bot.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-sm text-gray-400">
                    <div>
                      <span className="text-gray-500">Messages:</span>{' '}
                      <span className="text-gray-300">{bot.messagesSent.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Uptime:</span>{' '}
                      <span className="text-gray-300">{bot.uptime}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last seen:</span>{' '}
                      <span className="text-gray-300">{bot.lastSeen}</span>
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-800">
                  <div className="p-6 pt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-4">Configuration Files</h4>
                    <div className="space-y-3">
                      {configs.map((config) => {
                        const configKey = `${bot.id}-${config.name}`;
                        const isConfigExpanded = expandedConfigs.has(configKey);

                        return (
                          <div key={config.name} className="border border-gray-700 rounded-lg">
                            <div
                              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                              onClick={() => toggleConfig(bot.id, config.name)}
                            >
                              <div className="flex items-center gap-3">
                                <config.icon className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-300">
                                  {config.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Implement file viewer modal
                                  }}
                                  className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-300"
                                  title="View file"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Implement search functionality
                                  }}
                                  className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-300"
                                  title="Search file"
                                >
                                  <Search className="w-4 h-4" />
                                </button>
                                {isConfigExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                            
                            {isConfigExpanded && (
                              <div className="border-t border-gray-700 p-4">
                                <pre className="text-xs text-gray-300 bg-gray-900 p-3 rounded border overflow-x-auto">
                                  <code>{config.content}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
