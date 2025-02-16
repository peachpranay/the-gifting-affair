// app/api/create-order/route.ts
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const amount = body.amount ?? 5000 // Default amount in cents (50 SGD)

    // Razorpay SG order parameters
    const orderData = {
      amount: amount,    // Must be in cents (e.g., 5000 = 50 SGD)
      currency: 'SGD',
      payment_capture: 1 // Automatically capture payment
    }

    // Create Razorpay Order
    const order = await razorpay.orders.create(orderData)
    return NextResponse.json(order)

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
}