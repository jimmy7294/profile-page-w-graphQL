import { GetJWT } from "./auth.js";
import { fetchTransactionByXP, fetchTransactions } from "./query.js";

let username = "";
async function fetchUserId(jwt, username) {
  const getUserIdByLoginQuery = `
    query GetUserIdByLogin($login: String!) {
      user(where: {login: {_eq: $login}}) {
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
    query: getUserIdByLoginQuery,
    variables: {
      login: username,
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
    const userId = respData.data.user[0].id;
    return userId;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function login() {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const usernameOrEmail = document.querySelector("#usernameOrEmail").value;
    const password = document.querySelector("#password").value;
    console.log("usernameOrEmail:", usernameOrEmail, "password:", password);
    const jwt = await GetJWT(usernameOrEmail, password);
    username = usernameOrEmail;
    console.log("JWT:", jwt);

    try {
      const userId = await fetchUserId(jwt, username);
      console.log("%cfetchUserId:", "color: red", userId);

      const transactions = await fetchTransactions(jwt, userId);
      console.log("%cfetchTransactions:", "color: yellow", transactions);
      
      const getLevel = await fetchTransactionByXP(jwt, userId);
      console.log("%cfetchTransactionByXP:", "color: blue", getLevel);
    } catch (error) {
      console.error("Error:", error);
    }
    form.style.display = "none";
  });
}

login();
// instead of hardcoding the userID in the query, you can use the userID that is returned in the JWT when the user signs in for the fetchTransactions functionand fetchExpByProject function
