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

    // Helper function to make API requests
    const makeRequest = async (method, body) => {
      const options = {
        method,
        headers: {
          'X-Cisco-Meraki-API-Key': api_key,
          'Content-Type': 'application/json'
        }
      };
      if (body) options.body = JSON.stringify(body);
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Error interacting with Meraki API');
      return response.json();
    };

    // Get the list of IPSKs
    const identity_psks = await makeRequest('GET');

    // Get current date formatted
    const date = new Date().toISOString().slice(0, 10);

    // Find the entry with a name matching the current date
    const matchingEntry = identity_psks.find(entry => entry.name === date);

    let passphrase;
    if (matchingEntry) {
      // Entry found, use its passphrase
      passphrase = matchingEntry.passphrase;
    } else {
      // No entry found, generate a new passphrase
      passphrase = generatePassphrase();
      // Create a new IPSK entry
      const newEntry = { name: date, passphrase: passphrase, groupPolicyId: 100 };
      // Post the new entry to the Meraki API
      await makeRequest('POST', newEntry);
    }

    // Prepare the response
    const jsonResponse = JSON.stringify({ ipsk: passphrase });
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

// Helper function to generate a random passphrase
function generatePassphrase() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hour}${minute}${second}`;
}
