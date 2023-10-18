export async function onRequest(context) {
  try {
    // Check if the request method is POST
    if (context.request.method !== 'GET')
      throw new Error('Method not allowed');

    

    // Verify the value of the "verify" field
    return new Response(JSON.stringify({'ipsk': '123456789'}), { status: 200 });
  } catch (err) {
    // Return an error response
    const errorResponse = JSON.stringify({ error: err.message });
    return new Response(errorResponse, { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
}