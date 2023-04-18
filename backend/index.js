import { GetJWT } from "./auth.js";
import {
  fetchAuditInfo,
  fetchXPFromProject,
  fetchXPFromPiscineJS,
  fetchXPFromPiscineGo,
  fetchLevelProgression,
} from "./query.js";
import {
  drawLevelProgression,
  drawPieChart,
  drawXPFromPiscineGo,
  drawXPFromPiscineJS,
} from "./draw.js";

let username = "";
async function fetchUserId(jwt, usernameOrEmail) {
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
      //1. Get user ID
      const userId = await fetchUserId(jwt, username);
      console.log("%cGet user ID:", "color: red", userId);
      //2. Get XP from project
      const getXPFromProject = await fetchXPFromProject(jwt, userId);
      console.log("%cGet XP from PROJECT:", "color: yellow", getXPFromProject);
      //3. Get XP from piscine JS
      const getXPFromPiscineJSQuery = await fetchXPFromPiscineJS(jwt, userId);
      console.log(
        "%cGet XP from JS Piscine:",
        "color: yellow",
        getXPFromPiscineJSQuery
      );
      //4. Get XP from piscine Go
      const getXPFromPiscineGoQuery = await fetchXPFromPiscineGo(jwt, userId);
      console.log(
        "%cGet XP from Go Piscine:",
        "color: yellow",
        getXPFromPiscineGoQuery
      );
      //5. Get level progression
      const getLevelProgressionQuery = await fetchLevelProgression(jwt, userId);
      console.log(
        "%cGet Level From Projects:",
        "color: yellow",
        getLevelProgressionQuery
      );
      //6. Get audit info
      const getAuditInfoQuery = await fetchAuditInfo(jwt, userId);
      console.log("%cGet Audit Info:", "color: yellow", getAuditInfoQuery);
      drawPieChart(getAuditInfoQuery); //draw the pie chart
      drawLevelProgression(getLevelProgressionQuery); //draw the level progression
      drawXPFromPiscineGo(getXPFromPiscineGoQuery); //draw the XP from piscine Go
      drawXPFromPiscineJS(getXPFromPiscineJSQuery); //draw the XP from piscine JS
    } catch (error) {
      console.error("Error:", error);
    }
    form.style.display = "none";
  });
}

login();
