'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  useReactTable, 
  getCoreRowModel, 
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import type { BotMessage } from '@/lib/db/schema/messages';
import { Search, RefreshCw, Filter, ArrowUp, ArrowDown, Flag, Users, User } from 'lucide-react';

interface MessagesResponse {
  messages: BotMessage[];
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface MessageFilters {
  botId: string;
  direction: string;
  isGroup: string;
  flagged: boolean;
  search: string;
  timeRange: string;
}

const TIME_RANGES = [
  { label: 'Last 1 hour', value: '1h' },
  { label: 'Last 6 hours', value: '6h' },
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'All time', value: 'all' },
];

const BOT_COLORS = {
  oliver: 'bg-green-500/20 text-green-400 border-green-500/30',
  max: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  henry: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

function getTimeRangeQuery(range: string) {
  const now = new Date();
  switch (range) {
    case '1h':
      return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    case '6h':
      return new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return null;
  }
}

export default function MessagesPage() {
  const [filters, setFilters] = useState<MessageFilters>({
    botId: 'all',
    direction: 'all',
    isGroup: 'all',
    flagged: false,
    search: '',
    timeRange: '24h',
  });

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [pollingEnabled, setPollingEnabled] = useState(true);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    
    if (filters.botId !== 'all') params.set('botId', filters.botId);
    if (filters.direction !== 'all') params.set('direction', filters.direction);
    if (filters.isGroup !== 'all') params.set('isGroup', filters.isGroup);
    if (filters.flagged) params.set('flagged', 'true');
    if (filters.search) params.set('search', filters.search);
    
    const startDate = getTimeRangeQuery(filters.timeRange);
    if (startDate) params.set('startDate', startDate);
    
    params.set('limit', '100');
    params.set('offset', '0');
    
    return params.toString();
  }, [filters]);

  const { data, isLoading, error, refetch } = useQuery<MessagesResponse>({
    queryKey: ['messages', queryParams],
    queryFn: async () => {
      const response = await fetch(`/api/messages?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    refetchInterval: pollingEnabled ? 5000 : false,
  });

  const columnHelper = createColumnHelper<BotMessage>();

  const columns = [
    columnHelper.accessor('createdAt', {
      header: 'Time',
      cell: (info) => {
        const date = new Date(info.getValue());
        return (
          <div className="text-xs font-mono text-gray-400">
            {date.toLocaleTimeString()} <br />
            <span className="text-gray-500">{date.toLocaleDateString()}</span>
          </div>
        );
      },
      size: 100,
    }),
    columnHelper.accessor('botName', {
      header: 'Bot',
      cell: (info) => {
        const botId = info.row.original.botId;
        const colorClass = BOT_COLORS[botId as keyof typeof BOT_COLORS] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium border ${colorClass}`}>
            {info.getValue()}
          </span>
        );
      },
      size: 80,
    }),
    columnHelper.accessor('direction', {
      header: 'Dir',
      cell: (info) => {
        const isOutbound = info.getValue() === 'outbound';
        return (
          <div className="flex items-center justify-center">
            {isOutbound ? (
              <ArrowUp className={`w-4 h-4 ${isOutbound ? 'text-blue-400' : 'text-gray-400'}`} />
            ) : (
              <ArrowDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        );
      },
      size: 50,
    }),
    columnHelper.accessor('senderName', {
      header: 'From',
      cell: (info) => (
        <div className="text-sm">
          <div className="text-gray-200 truncate max-w-24">{info.getValue() || '-'}</div>
          <div className="text-xs text-gray-500 truncate max-w-24">{info.row.original.senderAddress}</div>
        </div>
      ),
      size: 120,
    }),
    columnHelper.accessor('recipientName', {
      header: 'To',
      cell: (info) => {
        const isGroup = info.row.original.isGroup;
        return (
          <div className="text-sm flex items-center gap-1">
            {isGroup ? <Users className="w-3 h-3 text-gray-500" /> : <User className="w-3 h-3 text-gray-500" />}
            <div>
              <div className="text-gray-200 truncate max-w-24">
                {info.row.original.chatName || info.getValue() || '-'}
              </div>
              <div className="text-xs text-gray-500 truncate max-w-24">{info.row.original.recipientAddress}</div>
            </div>
          </div>
        );
      },
      size: 140,
    }),
    columnHelper.accessor('messageText', {
      header: 'Message',
      cell: (info) => {
        const text = info.getValue() || '';
        const isExpanded = expandedRows.has(info.row.original.id);
        return (
          <div className="font-mono text-sm">
            <div className={isExpanded ? 'whitespace-pre-wrap' : 'truncate max-w-96'}>
              {text || <span className="text-gray-500 italic">No text</span>}
            </div>
            {text.length > 100 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newExpanded = new Set(expandedRows);
                  if (isExpanded) {
                    newExpanded.delete(info.row.original.id);
                  } else {
                    newExpanded.add(info.row.original.id);
                  }
                  setExpandedRows(newExpanded);
                }}
                className="text-xs text-blue-400 hover:text-blue-300 mt-1"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        );
      },
      size: 400,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        const colors = {
          sent: 'text-green-400',
          delivered: 'text-green-300',
          failed: 'text-red-400',
          received: 'text-blue-400',
        };
        return (
          <span className={`text-xs font-medium ${colors[status as keyof typeof colors] || 'text-gray-400'}`}>
            {status}
          </span>
        );
      },
      size: 80,
    }),
    columnHelper.accessor('flagged', {
      header: 'Flags',
      cell: (info) => {
        const flagged = info.getValue();
        return (
          <div className="flex items-center justify-center">
            {flagged && (
              <div title={info.row.original.flagReason || 'Flagged'}>
                <Flag className="w-4 h-4 text-red-400" />
              </div>
            )}
          </div>
        );
      },
      size: 60,
    }),
  ];

  const table = useReactTable({
    data: data?.messages || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const updateFilter = (key: keyof MessageFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">Error loading messages: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-200">Message Feed</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time message logs from all fleet bots
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPollingEnabled(!pollingEnabled)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
              pollingEnabled
                ? 'bg-green-900/30 border-green-700 text-green-400 hover:bg-green-900/50'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${pollingEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            {pollingEnabled ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Filters</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Bot</label>
            <select
              value={filters.botId}
              onChange={(e) => updateFilter('botId', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200"
            >
              <option value="all">All Bots</option>
              <option value="oliver">Oliver</option>
              <option value="max">Max</option>
              <option value="henry">Henry</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Direction</label>
            <select
              value={filters.direction}
              onChange={(e) => updateFilter('direction', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200"
            >
              <option value="all">All</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Type</label>
            <select
              value={filters.isGroup}
              onChange={(e) => updateFilter('isGroup', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200"
            >
              <option value="all">All</option>
              <option value="true">Group</option>
              <option value="false">DM</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Time Range</label>
            <select
              value={filters.timeRange}
              onChange={(e) => updateFilter('timeRange', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200"
            >
              {TIME_RANGES.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Flagged Only</label>
            <label className="flex items-center pt-2">
              <input
                type="checkbox"
                checked={filters.flagged}
                onChange={(e) => updateFilter('flagged', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-800 border border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-300">Show flagged only</span>
            </label>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200 placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center gap-2 text-gray-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Loading messages...
            </div>
          </div>
        ) : data?.messages.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">No messages found matching your filters.</p>
            <p className="text-sm text-gray-600 mt-2">
              Try adjusting your search criteria or check back later.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {table.getRowModel().rows.map(row => {
                  const isFlagged = row.original.flagged;
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-gray-800/30 transition-colors cursor-pointer ${
                        isFlagged ? 'bg-red-900/10 border-l-2 border-red-500/50' : ''
                      }`}
                      onClick={() => {
                        const newExpanded = new Set(expandedRows);
                        if (expandedRows.has(row.original.id)) {
                          newExpanded.delete(row.original.id);
                        } else {
                          newExpanded.add(row.original.id);
                        }
                        setExpandedRows(newExpanded);
                      }}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-3 py-3 text-sm text-gray-300">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        {data?.messages.length || 0} messages • {pollingEnabled ? 'Auto-refreshes every 5 seconds' : 'Polling paused'}
      </div>
    </div>
  );
}