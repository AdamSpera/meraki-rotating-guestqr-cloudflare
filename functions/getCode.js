export async function onRequest(context) {
  try {
    // Check if the request method is POST
    if (context.request.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Parse the form data from the request
    const formData = await context.request.formData();
    const verifyValue = formData.get('verify');

    // Verify the value of the "verify" field
    if (verifyValue === 'a1b2c3') {
      return new Response('valid', { status: 200 });
    } else {
      return new Response('invalid', { status: 400 });
    }
  } catch (err) {
    // Return an error response
    const errorResponse = JSON.stringify({ error: err.message });
    return new Response(errorResponse, { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
}
