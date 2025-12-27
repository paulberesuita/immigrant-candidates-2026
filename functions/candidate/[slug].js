/**
 * Cloudflare Pages Function to serve candidate.html for /candidate/:slug routes
 */
export async function onRequest(context) {
  const { env, request } = context;

  // Fetch the candidate.html file and return it
  const url = new URL(request.url);
  url.pathname = '/candidate.html';

  // Create a new request for the static file
  const response = await env.ASSETS.fetch(new Request(url.toString(), request));

  // Return the HTML with proper content type
  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
