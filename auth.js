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
  
    // If the response is not successful, throw an error with the status text and let the user know
    if (!response.ok) {
      alert ("Failed to obtain JWT, please check your username/email and password");
      throw new Error("Failed to obtain JWT");
    }
  
    // Parse the response as JSON
    const jsonResponse = await response.json();
  
    return jsonResponse;
  }
  
// Use the JWT to fetch the user ID
export async function fetchUserId(jwt, usernameOrEmail) {
  const getUserIdByLoginOrEmailQuery = `
    query GetUserIdByLoginOrEmail($login: String!, $email: String!) {
      user(where: {_or: [{login: {_eq: $login}}, {email: {_eq: $email}}]}) {
        id
      }
    }
  `;

  const url = "https://01.gritlab.ax/api/graphql-engine/v1/graphql";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const requestBody = {
    query: getUserIdByLoginOrEmailQuery,
    variables: {
      login: usernameOrEmail,
      email: usernameOrEmail,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const respData = await response.json();
    if (respData.data && respData.data.user && respData.data.user.length > 0) {
      const userId = respData.data.user[0].id;
      return userId;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}