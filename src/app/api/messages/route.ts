import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { botMessages } from '@/lib/db/schema/messages';
import { and, eq, ilike, gte, lte, desc, or } from 'drizzle-orm';

// Schema for POST request validation
const createMessageSchema = z.object({
  botId: z.string().min(1),
  botName: z.string().min(1),
  direction: z.enum(['inbound', 'outbound']),
  senderName: z.string().optional(),
  senderAddress: z.string().optional(),
  recipientName: z.string().optional(),
  recipientAddress: z.string().optional(),
  chatGuid: z.string().optional(),
  chatName: z.string().optional(),
  messageText: z.string().optional(),
  messageId: z.string().optional(),
  hasMedia: z.boolean().default(false),
  mediaType: z.string().optional(),
  isGroup: z.boolean().default(false),
  status: z.enum(['sent', 'delivered', 'failed', 'received']),
  errorText: z.string().optional(),
  tokenCount: z.number().int().optional(),
  responseTimeMs: z.number().int().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Auto-flag patterns
const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const ERROR_PATTERNS = [
  /error/i,
  /failed/i,
  /exception/i,
  /timeout/i,
  /connection refused/i,
  /not found/i,
  /unauthorized/i,
  /forbidden/i,
  /internal server error/i,
];

function autoFlagMessage(messageText: string | null): { flagged: boolean; flagReason?: string } {
  if (!messageText) return { flagged: false };
  
  // Check for UUID patterns
  if (UUID_PATTERN.test(messageText)) {
    return { flagged: true, flagReason: 'Contains UUID patterns' };
  }
  
  // Check for error patterns
  for (const pattern of ERROR_PATTERNS) {
    if (pattern.test(messageText)) {
      return { flagged: true, flagReason: 'Contains error-like text' };
    }
  }
  
  return { flagged: false };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const botId = searchParams.get('botId');
    const direction = searchParams.get('direction');
    const isGroup = searchParams.get('isGroup');
    const flagged = searchParams.get('flagged');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build dynamic where conditions
    const conditions = [];
    
    if (botId && botId !== 'all') {
      conditions.push(eq(botMessages.botId, botId));
    }
    
    if (direction && direction !== 'all') {
      conditions.push(eq(botMessages.direction, direction as 'inbound' | 'outbound'));
    }
    
    if (isGroup !== null && isGroup !== 'all') {
      conditions.push(eq(botMessages.isGroup, isGroup === 'true'));
    }
    
    if (flagged === 'true') {
      conditions.push(eq(botMessages.flagged, true));
    }
    
    if (search) {
      conditions.push(
        or(
          ilike(botMessages.messageText, `%${search}%`),
          ilike(botMessages.senderName, `%${search}%`),
          ilike(botMessages.recipientName, `%${search}%`),
          ilike(botMessages.chatName, `%${search}%`)
        )
      );
    }
    
    if (startDate) {
      conditions.push(gte(botMessages.createdAt, new Date(startDate)));
    }
    
    if (endDate) {
      conditions.push(lte(botMessages.createdAt, new Date(endDate)));
    }

    const messages = await db
      .select()
      .from(botMessages)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(botMessages.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      messages,
      pagination: {
        limit,
        offset,
        hasMore: messages.length === limit,
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createMessageSchema.parse(body);
    
    // Auto-flag the message if needed
    const flagResult = autoFlagMessage(validatedData.messageText || null);
    
    const messageData = {
      ...validatedData,
      flagged: flagResult.flagged,
      flagReason: flagResult.flagReason || null,
    };

    const [newMessage] = await db
      .insert(botMessages)
      .values(messageData)
      .returning();

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}