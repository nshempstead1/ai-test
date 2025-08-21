/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Stripe from 'stripe';
import type { Handler } from '@netlify/functions';

// IMPORTANT: Set your Stripe secret key in your Netlify environment variables.
// Do not hardcode it here!
// Environment variable name: STRIPE_SECRET_KEY
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: 'Method Not Allowed',
    };
  }

  try {
    const { amount, customerEmail, customerName, description } = JSON.parse(event.body || '{}');

    // Basic validation
    if (!amount || typeof amount !== 'number' || !customerEmail || !customerName || !description) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing required payment information.' }),
        };
    }

    // Convert amount from dollars to cents for the Stripe API
    const amountInCents = Math.round(amount * 100);

    // Stripe has a minimum charge amount (e.g., $0.50 USD)
    if (amountInCents < 50) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Amount must be at least $0.50.' }),
      };
    }
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      receipt_email: customerEmail,
      description: description,
      metadata: {
        customerName: customerName,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Send the client secret back to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
    };
  } catch (error: any) {
    console.error('Stripe API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `An internal server error occurred: ${error.message}` }),
    };
  }
};
