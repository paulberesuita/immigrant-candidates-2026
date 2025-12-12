/**
 * Cloudflare Pages Function to fetch candidates from D1 database
 */
export async function onRequest(context) {
  const { env, request } = context;

  // Log for debugging
  console.log('API called, env.DB:', typeof env.DB, 'Request URL:', request.url);

  try {
    // Check if DB binding exists
    if (!env.DB) {
      return new Response(
        JSON.stringify({ 
          error: 'Database binding not configured',
          details: 'The DB binding is not available. Please configure the D1 database binding in Cloudflare Pages settings.'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const candidates = await env.DB.prepare(
      'SELECT * FROM candidates ORDER BY name ASC'
    ).all();

    return new Response(JSON.stringify(candidates.results || []), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch candidates', 
        details: error.message,
        stack: error.stack
      }),
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

