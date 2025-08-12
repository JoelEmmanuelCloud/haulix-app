import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('trackingId');
    
    if (trackingId) {
      // Get specific order by tracking ID
      const order = await Order.findOne({ trackingId: trackingId.toUpperCase() });
      
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      
      return NextResponse.json({ order });
    } else {
      // Get all orders (for admin)
      const orders = await Order.find({}).sort({ createdAt: -1 }).limit(100);
      return NextResponse.json({ orders });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const { 
      chatSessionId, 
      customerName, 
      description, 
      deliveryAddress, 
      pickupAddress,
      estimatedDelivery 
    } = await request.json();
    
    if (!chatSessionId || !description || !deliveryAddress) {
      return NextResponse.json({ 
        error: 'Chat session ID, description, and delivery address are required' 
      }, { status: 400 });
    }

    const order = new Order({
      chatSessionId,
      customerName: customerName || 'Anonymous Customer',
      description,
      deliveryAddress,
      pickupAddress: pickupAddress || '',
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null
    });

    await order.save();
    
    return NextResponse.json({ 
      success: true, 
      order,
      trackingId: order.trackingId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    
    const { trackingId, status, note } = await request.json();
    
    if (!trackingId || !status) {
      return NextResponse.json({ 
        error: 'Tracking ID and status are required' 
      }, { status: 400 });
    }

    const validStatuses = ['created', 'processing', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status' 
      }, { status: 400 });
    }

    const order = await Order.findOne({ trackingId: trackingId.toUpperCase() });
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update current status
    order.currentStatus = status;
    
    // Add to status history
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || ''
    });

    await order.save();
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}