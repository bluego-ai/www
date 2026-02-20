'use client';

import { useState } from 'react';
import { Search, Filter, Plus, Mail, Phone, MessageCircle, Users, Building, Clock } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed-won' | 'closed-lost';
  lastContact: string;
  channel: 'email' | 'phone' | 'imessage';
}

// Mock data - empty for now as requested
const MOCK_LEADS: Lead[] = [
  // Uncomment for demo data:
  // {
  //   id: '1',
  //   name: 'Sarah Johnson',
  //   email: 'sarah.j@techcorp.com',
  //   company: 'TechCorp Solutions',
  //   status: 'new',
  //   lastContact: '2 hours ago',
  //   channel: 'email',
  // },
];

const STATUS_COLORS = {
  'new': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'contacted': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'qualified': 'bg-green-500/20 text-green-400 border-green-500/30',
  'proposal': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'closed-won': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'closed-lost': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const CHANNEL_ICONS = {
  'email': Mail,
  'phone': Phone,
  'imessage': MessageCircle,
};

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');

  const getChannelIcon = (channel: Lead['channel']) => {
    const IconComponent = CHANNEL_ICONS[channel];
    return <IconComponent className="w-4 h-4" />;
  };

  const getStatusColor = (status: Lead['status']) => {
    return STATUS_COLORS[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const formatStatus = (status: Lead['status']) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Filter leads based on search and filters
  const filteredLeads = MOCK_LEADS.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || lead.channel === channelFilter;
    
    return matchesSearch && matchesStatus && matchesChannel;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-200">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track your campaign leads
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white transition-colors">
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Leads</p>
              <p className="text-2xl font-semibold text-gray-200">
                {MOCK_LEADS.length}
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">New This Week</p>
              <p className="text-2xl font-semibold text-gray-200">0</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <Plus className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Qualified</p>
              <p className="text-2xl font-semibold text-gray-200">0</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Building className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Conversion Rate</p>
              <p className="text-2xl font-semibold text-gray-200">-</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-full">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200 placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="closed-won">Closed Won</option>
              <option value="closed-lost">Closed Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Channel</label>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200"
            >
              <option value="all">All Channels</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="imessage">iMessage</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setChannelFilter('all');
              }}
              className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded text-sm text-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
        {MOCK_LEADS.length === 0 ? (
          // Empty State
          <div className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-200 mb-2">No leads yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Leads from your campaigns will appear here. Start a campaign or manually add leads to get started.
            </p>
            <div className="flex justify-center gap-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white transition-colors">
                Add Lead Manually
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-sm text-gray-200 transition-colors">
                Import from CSV
              </button>
            </div>
          </div>
        ) : filteredLeads.length === 0 ? (
          // No results state
          <div className="p-12 text-center">
            <p className="text-gray-500">No leads found matching your filters.</p>
            <p className="text-sm text-gray-600 mt-2">
              Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          // Table with leads
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-200">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{lead.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(lead.status)}`}>
                        {formatStatus(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{lead.lastContact}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-400">
                        {getChannelIcon(lead.channel)}
                        <span className="text-sm capitalize">{lead.channel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredLeads.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredLeads.length} of {MOCK_LEADS.length} leads
        </div>
      )}
    </div>
  );
}