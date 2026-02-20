'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Play, RefreshCw, CheckCircle, XCircle, AlertTriangle, Terminal } from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'attention';
  duration: string;
  output: string;
}

interface BotTests {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'attention';
  passedTests: number;
  totalTests: number;
  lastRun: string;
  testCases: TestCase[];
}

const MOCK_TEST_DATA: BotTests[] = [
  {
    id: 'oliver',
    name: 'Oliver',
    status: 'passed',
    passedTests: 13,
    totalTests: 15,
    lastRun: '5 minutes ago',
    testCases: [
      {
        id: 'auth-test',
        name: 'Authentication Flow',
        status: 'passed',
        duration: '2.3s',
        output: `✅ Starting authentication test...
✅ Connecting to OpenClaw service
✅ Validating API credentials
✅ Testing session persistence
✅ Authentication flow completed successfully

Test Duration: 2.3s
Status: PASSED`,
      },
      {
        id: 'message-test',
        name: 'Message Processing',
        status: 'passed',
        duration: '1.8s',
        output: `✅ Starting message processing test...
✅ Loading test message payload
✅ Parsing message content
✅ Applying sentiment analysis
✅ Generating response
✅ Message processing completed

Processed: 3 test messages
Response time avg: 0.6s
Status: PASSED`,
      },
      {
        id: 'memory-test',
        name: 'Memory Management',
        status: 'failed',
        duration: '4.1s',
        output: `❌ Starting memory management test...
✅ Loading memory context
✅ Testing short-term memory
❌ Long-term memory persistence failed
❌ Memory context size exceeded limit

Error: Memory buffer overflow at line 142
Expected: < 1MB, Actual: 1.3MB
Status: FAILED`,
      },
      {
        id: 'response-time',
        name: 'Response Time',
        status: 'attention',
        duration: '3.2s',
        output: `⚠️  Starting response time test...
✅ Sending test message
⚠️  Response delayed beyond threshold
✅ Response received and validated

Response times:
- Message 1: 2.1s (threshold: 2.0s)
- Message 2: 2.8s (threshold: 2.0s)
- Message 3: 1.9s (threshold: 2.0s)
Status: NEEDS ATTENTION`,
      },
    ],
  },
  {
    id: 'max',
    name: 'Max',
    status: 'passed',
    passedTests: 12,
    totalTests: 12,
    lastRun: '10 minutes ago',
    testCases: [
      {
        id: 'personality-test',
        name: 'Personality Consistency',
        status: 'passed',
        duration: '1.5s',
        output: `✅ Starting personality test...
✅ Testing casual tone consistency
✅ Validating emoji usage patterns
✅ Checking response warmth metrics
✅ Personality test completed

Tone consistency: 98%
Emoji usage: Within guidelines
Warmth score: 8.7/10
Status: PASSED`,
      },
      {
        id: 'calendar-integration',
        name: 'Calendar Integration',
        status: 'passed',
        duration: '2.1s',
        output: `✅ Starting calendar integration test...
✅ Connecting to calendar service
✅ Testing appointment scheduling
✅ Validating timezone handling
✅ Calendar integration working properly

Scheduled: 2 test appointments
Timezone accuracy: 100%
Status: PASSED`,
      },
    ],
  },
  {
    id: 'henry',
    name: 'Henry',
    status: 'failed',
    passedTests: 8,
    totalTests: 14,
    lastRun: '2 hours ago',
    testCases: [
      {
        id: 'analytics-test',
        name: 'Analytics Processing',
        status: 'failed',
        duration: '5.2s',
        output: `❌ Starting analytics processing test...
✅ Loading test data set
✅ Initializing analytics engine
❌ Data processing pipeline failed
❌ Unable to generate insights

Error: NullReferenceException at analytics.js:89
Data rows processed: 1,247 of 2,500
Status: FAILED`,
      },
      {
        id: 'reporting-test',
        name: 'Report Generation',
        status: 'attention',
        duration: '7.8s',
        output: `⚠️  Starting report generation test...
✅ Collecting data sources
✅ Processing metrics
⚠️  Chart generation taking longer than expected
✅ PDF export completed

Processing time: 7.8s (threshold: 5.0s)
Charts generated: 4 of 5
Status: NEEDS ATTENTION`,
      },
    ],
  },
];

export default function TestRunnerPage() {
  const [expandedBots, setExpandedBots] = useState<Set<string>>(new Set());
  const [isRunning, setIsRunning] = useState(false);

  const toggleBot = (botId: string) => {
    const newExpanded = new Set(expandedBots);
    if (expandedBots.has(botId)) {
      newExpanded.delete(botId);
    } else {
      newExpanded.add(botId);
    }
    setExpandedBots(newExpanded);
  };

  const getStatusIcon = (status: 'passed' | 'failed' | 'attention') => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'attention':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: 'passed' | 'failed' | 'attention') => {
    switch (status) {
      case 'passed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'attention':
        return 'text-yellow-400';
    }
  };

  const getTestCaseIcon = (status: 'passed' | 'failed' | 'attention') => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'attention':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const runAllTests = () => {
    setIsRunning(true);
    // Simulate test running
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  const totalPassed = MOCK_TEST_DATA.reduce((sum, bot) => sum + bot.passedTests, 0);
  const totalTests = MOCK_TEST_DATA.reduce((sum, bot) => sum + bot.totalTests, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-200">Test Runner</h1>
          <p className="text-sm text-gray-500 mt-1">
            Automated testing and validation for all bots
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {totalPassed}/{totalTests} tests passing
          </div>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 rounded-lg text-sm text-white transition-colors"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-400">
              {MOCK_TEST_DATA.filter(bot => bot.status === 'passed').length}
            </div>
            <div className="text-sm text-gray-400">Bots Passing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-red-400">
              {MOCK_TEST_DATA.filter(bot => bot.status === 'failed').length}
            </div>
            <div className="text-sm text-gray-400">Bots Failing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-yellow-400">
              {MOCK_TEST_DATA.filter(bot => bot.status === 'attention').length}
            </div>
            <div className="text-sm text-gray-400">Need Attention</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-200">
              {Math.round((totalPassed / totalTests) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Test Results Table Header */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-sm font-medium text-gray-400 uppercase tracking-wider">
          <div className="col-span-4">Bot</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Test Cases</div>
          <div className="col-span-3">Last Run</div>
        </div>

        {/* Bot Test Results */}
        <div className="divide-y divide-gray-800">
          {MOCK_TEST_DATA.map((bot) => {
            const isExpanded = expandedBots.has(bot.id);

            return (
              <div key={bot.id}>
                <div
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-800/30 cursor-pointer transition-colors"
                  onClick={() => toggleBot(bot.id)}
                >
                  <div className="col-span-4 flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-200">{bot.name}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    {getStatusIcon(bot.status)}
                    <span className={`text-sm capitalize ${getStatusColor(bot.status)}`}>
                      {bot.status}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-sm text-gray-300">
                      {bot.passedTests}/{bot.totalTests} test cases passed
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-sm text-gray-400">{bot.lastRun}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-800 bg-gray-900/20">
                    <div className="p-6">
                      <h4 className="text-sm font-medium text-gray-300 mb-4">Test Cases</h4>
                      <div className="space-y-4">
                        {bot.testCases.map((testCase) => (
                          <div key={testCase.id} className="border border-gray-700 rounded-lg">
                            <div className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {getTestCaseIcon(testCase.status)}
                                <div>
                                  <div className="font-medium text-gray-200">{testCase.name}</div>
                                  <div className="text-sm text-gray-400">Duration: {testCase.duration}</div>
                                </div>
                              </div>
                              <Terminal className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="border-t border-gray-700 bg-gray-900 p-4">
                              <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-x-auto">
                                {testCase.output}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}