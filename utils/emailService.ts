import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP Server connection error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Order Confirmation</h1>
      <p>Dear ${data.customerName},</p>
      <p>Thank you for your order! We have received your order and it is currently pending payment verification.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
        <h2 style="color: #333; margin-top: 0;">Order Details</h2>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Total Amount:</strong> ₹${data.total.toFixed(2)}</p>
      </div>

      <h3 style="color: #333;">Items Ordered</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f5f5f5;">
          <th style="padding: 8px; text-align: left;">Item</th>
          <th style="padding: 8px; text-align: right;">Quantity</th>
          <th style="padding: 8px; text-align: right;">Price</th>
        </tr>
        ${data.items.map(item => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
          </tr>
        `).join('')}
      </table>

      <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Shipping Address</h3>
        <p style="margin: 0;">${data.shippingAddress.address}</p>
        <p style="margin: 0;">${data.shippingAddress.city}, ${data.shippingAddress.state}</p>
        <p style="margin: 0;">${data.shippingAddress.pincode}</p>
      </div>

      <p style="color: #666;">Please note that your order is pending payment verification. We will process your order once the payment is confirmed.</p>
      
      <p style="color: #666;">If you have any questions, please contact our customer support.</p>
      
      <div style="text-align: center; margin-top: 30px; color: #666;">
        <p>Thank you for shopping with us!</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.customerEmail,
      subject: `Order Confirmation #${data.orderNumber} - Payment Pending`,
      html: emailHtml
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
