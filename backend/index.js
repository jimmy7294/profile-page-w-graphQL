async function getJWT(usernameOrEmail, password) {
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

  // remove the quotes from the token
  const token = jsonResponse.replace(/"/g, "");
  //console.log("printing token", token);

  return token;
}

async function ExecuteGraphQLQuery(jwt) {
  const url = "https://01.gritlab.ax/api/graphql-engine/v1/graphql";
  const query = `
    {
      user {
        id
        login
      }
    }
  `;
  console.log("jwt:", jwt);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const requestBody = {
    query: query,
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
    console.log("respData:", respData);
    return JSON.stringify(respData);
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
}

async function fetchTransactions(id = 1182, offset = 0, limit = 50) {
  // Show the spinner when the API call is being made
  const getTransactionsQuery = `
  {
    user {
      id
      login
    }
  }
  `;
  // Send the query to the GraphQL endpoint
  const url = "https://01.gritlab.ax/api/graphql-engine/v1/graphql";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ query: getTransactionsQuery }),
  });
  const { data } = await response.json();
  if (!data.user) {
    return [];
  } else {
    return data.user.transactions;
  }
}

// Execute another different query with the same JWT for different data

async function main() {
  const usernameOrEmail = "minhtuann";
  const password = "Men0Grit!";

  try {
    const jwt = await getJWT(usernameOrEmail, password);
    console.log("JWT:", jwt);

    // You can now use the JWT to call the executeGraphQLQuery function
    const responseData = await ExecuteGraphQLQuery(jwt);
    console.log("Response data:", responseData);
  } catch (error) {
    console.error("Error:", error);
  }

  try {
    const jwt = await getJWT(usernameOrEmail, password);
    console.log("getting transactions with jwt", jwt);
    const transactions = await fetchTransactions();
    console.log("transactions", transactions);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
