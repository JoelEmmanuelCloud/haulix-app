import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Chat from '../../../models/Chat';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const chat = await Chat.findOne({ sessionId }).sort({ lastActivity: -1 });
    
    return NextResponse.json({ chat });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const { sessionId, message, customerName, sender = 'customer' } = await request.json();
    
    if (!sessionId || !message) {
      return NextResponse.json({ error: 'Session ID and message required' }, { status: 400 });
    }

    // Find existing chat or create new one
    let chat = await Chat.findOne({ sessionId });
    
    if (!chat) {
      chat = new Chat({
        sessionId,
        customerName: customerName || 'Anonymous Customer',
        messages: []
      });
    }

    // Update customer name if provided
    if (customerName && customerName !== 'Anonymous Customer') {
      chat.customerName = customerName;
    }

    // Add new message
    chat.messages.push({
      sender,
      message,
      timestamp: new Date()
    });

    // Update last activity
    chat.lastActivity = new Date();

    await chat.save();
    
    return NextResponse.json({ success: true, chat });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET all chats for admin
export async function PUT(request) {
  try {
    await connectDB();
    
    const chats = await Chat.find({ status: 'active' })
      .sort({ lastActivity: -1 })
      .limit(50);
    
    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}