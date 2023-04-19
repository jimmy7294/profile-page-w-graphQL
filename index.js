import { GetJWT, fetchUserId } from "./auth.js";
import {
  fetchAuditInfo,
  fetchXPFromProject,
  fetchXPFromPiscineJS,
  fetchXPFromPiscineGo,
  fetchLevelProgression,
  fetchMasteries,
  fetchUserInfo,
} from "./query.js";
import {
  drawLevelProgression,
  drawPieChart,
  drawXPFromPiscineGo,
  drawXPFromPiscineJS,
  drawMasteries,
  showBasicUserInfo,
} from "./draw.js";
import { logout } from "./helper.js";


async function login() {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const usernameOrEmail = document.querySelector("#usernameOrEmail").value;
    const password = document.querySelector("#password").value;
    // console.log("usernameOrEmail:", usernameOrEmail, "password:", password);
    const jwt = await GetJWT(usernameOrEmail, password);
    // if the response is successful, store the jwt and username in sessionStorage
    sessionStorage.setItem("jwt", jwt);
    sessionStorage.setItem("username", usernameOrEmail);
    // const username = usernameOrEmail;
    // console.log("JWT:", jwt);

    try {
      //1. Get user ID
      const userId = await fetchUserId(jwt, 
        usernameOrEmail);
      // console.log("%cGet user ID:", "color: red", userId);
      //2. Get XP from project
      const getXPFromProject = await fetchXPFromProject(jwt, userId);
      // console.log("%cGet XP from PROJECT:", "color: yellow", getXPFromProject);
      //3. Get XP from piscine JS
      const getXPFromPiscineJSQuery = await fetchXPFromPiscineJS(jwt, userId);
      // console.log(
      //   "%cGet XP from JS Piscine:",
      //   "color: yellow",
      //   getXPFromPiscineJSQuery
      // );
      //4. Get XP from piscine Go
      const getXPFromPiscineGoQuery = await fetchXPFromPiscineGo(jwt, userId);
      // console.log(
      //   "%cGet XP from Go Piscine:",
      //   "color: yellow",
      //   getXPFromPiscineGoQuery
      // );
      //5. Get level progression
      const getLevelProgressionQuery = await fetchLevelProgression(jwt, userId);
      // console.log(
      //   "%cGet Level From Projects:",
      //   "color: yellow",
      //   getLevelProgressionQuery
      // );
      //6. Get audit info
      const getAuditInfoQuery = await fetchAuditInfo(jwt, userId);
      // console.log("%cGet Audit Info:", "color: yellow", getAuditInfoQuery);

      //7. Get masteries
      const getMasteries = await fetchMasteries(jwt, userId);
      // console.log("%cGet Masteries:", "color: yellow", getMasteries);

      //8. Get user info
      const GetUserInfo = await fetchUserInfo(jwt, userId);
      // console.log("%cGet User Info:", "color: yellow", GetUserInfo);

      //9. Draw charts
      drawPieChart(getAuditInfoQuery); //draw the pie chart
      drawLevelProgression(getLevelProgressionQuery); //draw the level progression
      drawXPFromPiscineGo(getXPFromPiscineGoQuery); //draw the XP from piscine Go
      drawXPFromPiscineJS(getXPFromPiscineJSQuery); //draw the XP from piscine JS
      drawMasteries(getMasteries); //draw the masteries
      showBasicUserInfo(GetUserInfo); //show the basic user info
    } catch (error) {
      console.error("Error:", error);
    }
    form.style.display = "none";
    document.querySelector(".logout-container").style.display = "block";
  });
}
// event listener for a reload event that will remove the jwt and username from sessionStorage
window.addEventListener("beforeunload", () => {
  sessionStorage.removeItem("jwt");
  sessionStorage.removeItem("username");
});

login();
// when the user press the logout button, the page will be reloaded
document.querySelector("#logoutButton").addEventListener("click", () => {
  logout();
});
// hide the logout button before the user logs in
document.querySelector(".logout-container").style.display = "none";