export async function GetJWT(usernameOrEmail, password) {
    const signinEndpoint = "https://01.gritlab.ax/api/auth/signin";
  
    // Encode the username/email and password as base64
    const encodedCredentials = btoa(`${usernameOrEmail}:${password}`);
  
    // Make a POST request to the signin endpoint with the encoded credentials in the Authorization header
    const response = await fetch(signinEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredentials}`,
      },
    });
  
    // If the response is not successful, throw an error
    if (!response.ok) {
      throw new Error("Failed to obtain JWT");
    }
  
    // Parse the response as JSON
    const jsonResponse = await response.json();
  
    return jsonResponse;
  }
  