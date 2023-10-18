export async function onRequest(context) {
  try {
    // Check if the request method is GET
    if (context.request.method !== 'GET') {
      throw new Error('Method not allowed');
    }

    // Define the API credentials and endpoint details
    const api_key = '9ef04732c76f6e8a53f120aec7442d36398a299d';
    const network_id = 'N_705376291636925143';
    const ssid_number = '1';
    const url = `https://api.meraki.com/api/v1/networks/${network_id}/wireless/ssids/${ssid_number}/identityPsks`;

    // Make the API request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Cisco-Meraki-API-Key': api_key,
        'Content-Type': 'application/json'
      },
    });

    // Check for a successful response
    if (!response.ok)
      throw new Error('Error fetching data from Meraki API');

    // Parse the JSON response
    const identity_psks = await response.json();

    // Get current date formatted
    const date = new Date().toISOString().slice(0, 10);

    // Find the entry with a name matching the current date
    const matchingEntry = identity_psks.find(entry => entry.name === date);

    // Prepare the response
    const responseBody = matchingEntry ? { ipsk: matchingEntry.ipsk } : false;
    const jsonResponse = JSON.stringify(responseBody);

    return new Response(jsonResponse, { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (err) {
    // Return an error response
    const errorResponse = JSON.stringify({ error: err.message });
    return new Response(errorResponse, { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
}
