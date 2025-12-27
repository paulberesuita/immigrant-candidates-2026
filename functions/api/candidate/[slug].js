/**
 * Cloudflare Pages Function to fetch a single candidate by slug
 * URL pattern: /api/candidate/:slug
 */
export async function onRequest(context) {
  const { env, params } = context;
  const slug = params.slug;

  try {
    if (!env.DB) {
      return new Response(
        JSON.stringify({
          error: 'Database binding not configured',
          details: 'The DB binding is not available.'
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

    // Fetch all candidates and find by slug
    // (D1 doesn't have a slug column, so we generate slugs in JS)
    const result = await env.DB.prepare(
      'SELECT * FROM candidates'
    ).all();

    const candidates = result.results || [];

    // Generate slug for each candidate and find match
    const candidate = candidates.find(c => {
      const generatedSlug = generateSlug(c);
      return generatedSlug === slug;
    });

    if (!candidate) {
      return new Response(
        JSON.stringify({ error: 'Candidate not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    return new Response(JSON.stringify(candidate), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch candidate',
        details: error.message
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

/**
 * Generate a URL-friendly slug from candidate name and state
 * e.g., "Fabian Doñate" + "NV" -> "fabian-donate-nv"
 */
function generateSlug(candidate) {
  if (!candidate || !candidate.name) return null;

  const namePart = candidate.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens

  const statePart = (candidate.state || '').toLowerCase();

  return statePart ? `${namePart}-${statePart}` : namePart;
}
