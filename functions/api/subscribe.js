/**
 * Cloudflare Pages Function to handle newsletter subscriptions
 */
export async function onRequest(context) {
  const { env, request } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  try {
    // Check if DB binding exists
    if (!env.DB) {
      return new Response(
        JSON.stringify({ error: 'Database not configured' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    // Validate email
    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Insert email into database
    await env.DB.prepare(
      'INSERT INTO subscribers (email) VALUES (?)'
    ).bind(email).run();

    // Send welcome email via Resend
    if (env.RESEND_API_KEY) {
      await sendWelcomeEmail(email, env.RESEND_API_KEY);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully subscribed!' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Subscribe error:', error);

    // Check for duplicate email
    if (error.message?.includes('UNIQUE constraint failed')) {
      return new Response(
        JSON.stringify({ success: true, message: 'You are already subscribed!' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Failed to subscribe. Please try again.' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function sendWelcomeEmail(toEmail, apiKey) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Latino Leaders 2026 <hello@discoverlatinoleaders.com>',
        to: [toEmail],
        subject: 'Welcome to Latino Leaders 2026!',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #3F3F46; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 30px 0;">
    <h1 style="color: #4338CA; margin: 0; font-size: 28px;">★ Latino Leaders 2026</h1>
  </div>

  <div style="background: linear-gradient(135deg, #4338CA 0%, #6366F1 100%); color: white; padding: 40px 30px; border-radius: 12px; text-align: center;">
    <h2 style="margin: 0 0 15px 0; font-size: 24px;">Welcome!</h2>
    <p style="margin: 0; font-size: 16px; opacity: 0.9;">Thanks for subscribing to Latino Leaders 2026</p>
  </div>

  <div style="padding: 30px 0;">
    <p>You're now part of a community dedicated to spotlighting the next generation of Latino leaders running for office in 2026.</p>

    <p>Here's what you can expect:</p>
    <ul style="padding-left: 20px;">
      <li>Updates on new candidates we feature</li>
      <li>Election news and important dates</li>
      <li>Ways to get involved and support candidates</li>
    </ul>

    <div style="text-align: center; padding: 20px 0;">
      <a href="https://discoverlatinoleaders.com" style="display: inline-block; background-color: #F97066; color: white; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 600;">Explore Candidates</a>
    </div>
  </div>

  <div style="border-top: 1px solid #E4E4E7; padding-top: 20px; text-align: center; color: #71717A; font-size: 14px;">
    <p style="margin: 0;">Latino Leaders 2026</p>
    <p style="margin: 5px 0 0 0; font-size: 12px;">A nonpartisan platform spotlighting young Latino candidates.</p>
  </div>
</body>
</html>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend error:', error);
    }
  } catch (error) {
    // Log but don't fail the subscription if email fails
    console.error('Failed to send welcome email:', error);
  }
}
