import { db } from '@/lib/db';
import { botMessages } from '@/lib/db/schema/messages';

const SAMPLE_MESSAGES = [
  // Oliver messages
  {
    botId: 'oliver',
    botName: 'Oliver',
    direction: 'inbound' as const,
    senderName: 'John Smith',
    senderAddress: '+1234567890',
    recipientName: 'Oliver',
    messageText: 'Hey Oliver, can you help me with my insurance claim?',
    messageId: 'msg_001',
    hasMedia: false,
    isGroup: false,
    status: 'received' as const,
    tokenCount: 12,
    responseTimeMs: 1200,
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    botId: 'oliver',
    botName: 'Oliver',
    direction: 'outbound' as const,
    senderName: 'Oliver',
    recipientName: 'John Smith',
    recipientAddress: '+1234567890',
    messageText: "I'd be happy to help you with your insurance claim! Can you please provide me with your policy number and a brief description of what happened?",
    messageId: 'msg_002',
    hasMedia: false,
    isGroup: false,
    status: 'sent' as const,
    tokenCount: 45,
    responseTimeMs: 2800,
    createdAt: new Date(Date.now() - 4 * 60 * 1000), // 4 minutes ago
  },
  {
    botId: 'oliver',
    botName: 'Oliver',
    direction: 'outbound' as const,
    senderName: 'Oliver',
    recipientName: 'Sarah Johnson',
    recipientAddress: 'sarah.johnson@email.com',
    messageText: 'Your claim has been processed and approved! Reference: bc4a7e6f-3c2d-4b9a-8f5e-1234567890ab',
    messageId: 'msg_003',
    hasMedia: false,
    isGroup: false,
    status: 'delivered' as const,
    tokenCount: 28,
    responseTimeMs: 1500,
    flagged: true, // Flagged for UUID pattern
    flagReason: 'Contains UUID patterns',
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
  },

  // Max messages (customer support)
  {
    botId: 'max',
    botName: 'Max',
    direction: 'inbound' as const,
    senderName: 'Emily Davis',
    senderAddress: 'emily.davis@email.com',
    recipientName: 'Max',
    messageText: 'I need help resetting my password',
    messageId: 'msg_004',
    hasMedia: false,
    isGroup: false,
    status: 'received' as const,
    tokenCount: 8,
    responseTimeMs: 800,
    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
  },
  {
    botId: 'max',
    botName: 'Max',
    direction: 'outbound' as const,
    senderName: 'Max',
    recipientName: 'Emily Davis',
    recipientAddress: 'emily.davis@email.com',
    messageText: 'I can help you reset your password. Please check your email for a secure reset link.',
    messageId: 'msg_005',
    hasMedia: false,
    isGroup: false,
    status: 'delivered' as const,
    tokenCount: 22,
    responseTimeMs: 1800,
    createdAt: new Date(Date.now() - 9 * 60 * 1000), // 9 minutes ago
  },
  {
    botId: 'max',
    botName: 'Max',
    direction: 'outbound' as const,
    senderName: 'Max',
    recipientName: 'Tech Support Team',
    recipientAddress: 'chat_guid:any;+;12345',
    chatGuid: 'chat_guid:any;+;12345',
    chatName: 'Tech Support Team',
    messageText: 'Error: Connection timeout when processing user request. Failed to establish database connection.',
    messageId: 'msg_006',
    hasMedia: false,
    isGroup: true,
    status: 'failed' as const,
    errorText: 'Connection timeout after 30 seconds',
    tokenCount: 35,
    responseTimeMs: 30000,
    flagged: true, // Flagged for error-like text
    flagReason: 'Contains error-like text',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },

  // Henry messages (sales)
  {
    botId: 'henry',
    botName: 'Henry',
    direction: 'inbound' as const,
    senderName: 'Michael Wilson',
    senderAddress: '+19876543210',
    recipientName: 'Henry',
    messageText: 'What are your pricing options for the premium plan?',
    messageId: 'msg_007',
    hasMedia: false,
    isGroup: false,
    status: 'received' as const,
    tokenCount: 12,
    responseTimeMs: 1000,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    botId: 'henry',
    botName: 'Henry',
    direction: 'outbound' as const,
    senderName: 'Henry',
    recipientName: 'Michael Wilson',
    recipientAddress: '+19876543210',
    messageText: 'Great question! Our premium plan starts at $99/month and includes unlimited users, advanced analytics, and 24/7 priority support. Would you like me to schedule a demo?',
    messageId: 'msg_008',
    hasMedia: false,
    isGroup: false,
    status: 'delivered' as const,
    tokenCount: 48,
    responseTimeMs: 3200,
    createdAt: new Date(Date.now() - 29 * 60 * 1000), // 29 minutes ago
  },
  {
    botId: 'henry',
    botName: 'Henry',
    direction: 'outbound' as const,
    senderName: 'Henry',
    recipientName: 'Sales Team',
    recipientAddress: 'chat_guid:any;+;54321',
    chatGuid: 'chat_guid:any;+;54321',
    chatName: 'Sales Team',
    messageText: '📈 New qualified lead: Michael Wilson - interested in premium plan. Follow-up scheduled for tomorrow at 2 PM.',
    messageId: 'msg_009',
    hasMedia: true,
    mediaType: 'image',
    isGroup: true,
    status: 'sent' as const,
    tokenCount: 28,
    responseTimeMs: 1800,
    createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
  },

  // More varied messages for better demo
  {
    botId: 'oliver',
    botName: 'Oliver',
    direction: 'inbound' as const,
    senderName: 'Lisa Chen',
    senderAddress: 'lisa.chen@company.com',
    recipientName: 'Oliver',
    messageText: 'My car was damaged in the storm last night. How do I file a claim?',
    messageId: 'msg_010',
    hasMedia: false,
    isGroup: false,
    status: 'received' as const,
    tokenCount: 18,
    responseTimeMs: 1100,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    botId: 'oliver',
    botName: 'Oliver',
    direction: 'outbound' as const,
    senderName: 'Oliver',
    recipientName: 'Lisa Chen',
    recipientAddress: 'lisa.chen@company.com',
    messageText: "I'm sorry to hear about the storm damage. I can help you file your claim right away. Please take photos of the damage and provide your policy number: AUTO-2024-xxx",
    messageId: 'msg_011',
    hasMedia: false,
    isGroup: false,
    status: 'sent' as const,
    tokenCount: 52,
    responseTimeMs: 4200,
    createdAt: new Date(Date.now() - 2.9 * 60 * 60 * 1000), // 2.9 hours ago
  },

  // Some group chat messages
  {
    botId: 'max',
    botName: 'Max',
    direction: 'outbound' as const,
    senderName: 'Max',
    recipientName: 'Customer Success Team',
    recipientAddress: 'chat_guid:any;+;team_success',
    chatGuid: 'chat_guid:any;+;team_success',
    chatName: 'Customer Success Team',
    messageText: 'Daily summary: Handled 47 support tickets today. 3 escalations, 2 still pending review. Overall customer satisfaction: 4.8/5.',
    messageId: 'msg_012',
    hasMedia: false,
    isGroup: true,
    status: 'delivered' as const,
    tokenCount: 32,
    responseTimeMs: 2100,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },

  // Some failed messages
  {
    botId: 'henry',
    botName: 'Henry',
    direction: 'outbound' as const,
    senderName: 'Henry',
    recipientName: 'Amanda Rodriguez',
    recipientAddress: '+15551234567',
    messageText: 'Thanks for your interest in our enterprise solution. I tried to send you the proposal but encountered an internal server error.',
    messageId: 'msg_013',
    hasMedia: false,
    isGroup: false,
    status: 'failed' as const,
    errorText: 'Message delivery failed: recipient number not found',
    tokenCount: 28,
    responseTimeMs: 5000,
    flagged: true,
    flagReason: 'Contains error-like text',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },

  // Some older messages for time range testing
  {
    botId: 'oliver',
    botName: 'Oliver',
    direction: 'outbound' as const,
    senderName: 'Oliver',
    recipientName: 'David Park',
    recipientAddress: 'david.park@email.com',
    messageText: 'Your monthly premium has been automatically deducted. Thank you for being a valued customer for over 5 years!',
    messageId: 'msg_014',
    hasMedia: false,
    isGroup: false,
    status: 'delivered' as const,
    tokenCount: 24,
    responseTimeMs: 1600,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    botId: 'max',
    botName: 'Max',
    direction: 'inbound' as const,
    senderName: 'Jennifer White',
    senderAddress: 'jen.white@startup.co',
    recipientName: 'Max',
    messageText: 'Hi! I love your product but I\'m having trouble integrating with our API. Can you help?',
    messageId: 'msg_015',
    hasMedia: false,
    isGroup: false,
    status: 'received' as const,
    tokenCount: 22,
    responseTimeMs: 1300,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    botId: 'max',
    botName: 'Max',
    direction: 'outbound' as const,
    senderName: 'Max',
    recipientName: 'Jennifer White',
    recipientAddress: 'jen.white@startup.co',
    messageText: 'Absolutely! I\'d be happy to help with your API integration. Let me connect you with our technical team. Here\'s our API documentation: https://docs.ourapp.com/api',
    messageId: 'msg_016',
    hasMedia: false,
    isGroup: false,
    status: 'sent' as const,
    tokenCount: 38,
    responseTimeMs: 2800,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000), // 3 days ago + 5 mins
  },

  // More recent messages for good demo experience
  {
    botId: 'henry',
    botName: 'Henry',
    direction: 'inbound' as const,
    senderName: 'Robert Taylor',
    senderAddress: '+17025551234',
    recipientName: 'Henry',
    messageText: 'Do you offer any discounts for nonprofits?',
    messageId: 'msg_017',
    hasMedia: false,
    isGroup: false,
    status: 'received' as const,
    tokenCount: 9,
    responseTimeMs: 900,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  },
  {
    botId: 'henry',
    botName: 'Henry',
    direction: 'outbound' as const,
    senderName: 'Henry',
    recipientName: 'Robert Taylor',
    recipientAddress: '+17025551234',
    messageText: 'Yes! We offer a 50% discount for qualified nonprofit organizations. I can help you apply for our nonprofit program. Do you have your tax-exempt documentation ready?',
    messageId: 'msg_018',
    hasMedia: false,
    isGroup: false,
    status: 'delivered' as const,
    tokenCount: 42,
    responseTimeMs: 3100,
    createdAt: new Date(Date.now() - 14 * 60 * 1000), // 14 minutes ago
  },

  // Some media messages
  {
    botId: 'oliver',
    botName: 'Oliver',
    direction: 'inbound' as const,
    senderName: 'Kevin Martinez',
    senderAddress: '+18885551234',
    recipientName: 'Oliver',
    messageText: 'Here are the photos of my car damage from the accident',
    messageId: 'msg_019',
    hasMedia: true,
    mediaType: 'image',
    isGroup: false,
    status: 'received' as const,
    tokenCount: 12,
    responseTimeMs: 1000,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    botId: 'oliver',
    botName: 'Oliver',
    direction: 'outbound' as const,
    senderName: 'Oliver',
    recipientName: 'Kevin Martinez',
    recipientAddress: '+18885551234',
    messageText: 'Thank you for the photos, Kevin. I can see the damage clearly. Based on the images, I\'m creating your claim now. You should receive a confirmation email within 10 minutes.',
    messageId: 'msg_020',
    hasMedia: false,
    isGroup: false,
    status: 'sent' as const,
    tokenCount: 48,
    responseTimeMs: 3800,
    createdAt: new Date(Date.now() - 58 * 60 * 1000), // 58 minutes ago
  },

  // Some problematic messages with UUIDs and errors
  {
    botId: 'max',
    botName: 'Max',
    direction: 'outbound' as const,
    senderName: 'Max',
    recipientName: 'Debug Team',
    recipientAddress: 'chat_guid:any;+;debug_team',
    chatGuid: 'chat_guid:any;+;debug_team',
    chatName: 'Debug Team',
    messageText: 'System encountered exception in user session f47ac10b-58cc-4372-a567-0e02b2c3d479. Stack trace: AuthenticationException: Token validation failed.',
    messageId: 'msg_021',
    hasMedia: false,
    isGroup: true,
    status: 'sent' as const,
    errorText: null,
    tokenCount: 28,
    responseTimeMs: 2000,
    flagged: true,
    flagReason: 'Contains UUID patterns',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
];

export async function seedMessages() {
  console.log('Seeding messages...');
  
  try {
    // Clear existing messages (optional - comment out if you want to keep existing data)
    await db.delete(botMessages);
    console.log('Cleared existing messages');
    
    // Insert sample messages
    for (const message of SAMPLE_MESSAGES) {
      await db.insert(botMessages).values(message);
    }
    
    console.log(`Seeded ${SAMPLE_MESSAGES.length} messages successfully!`);
  } catch (error) {
    console.error('Error seeding messages:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedMessages()
    .then(() => {
      console.log('Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}