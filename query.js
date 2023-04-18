export async function fetchXPFromProject(jwt, userID) {
  const getTransctionByLevelQuery = `
    query GetTransctionByLevel($userID: Int!){
        user: user_by_pk(id: $userID){
            transactions(order_by: {createdAt: desc}, where:
                {_and:
                    [{type: {_eq: "xp"}},
                    {object: {type: {_eq: "project"}}}] 
                }){
                createdAt
                type
                amount
                objectId
                userId
                path
                object {
                    name
                    type            
                }
            }
        }
    }`;
  const url = "https://01.gritlab.ax/api/graphql-engine/v1/graphql";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };
  const requestBody = {
    query: getTransctionByLevelQuery,
    variables: {
      userID: userID,
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
    console.log("respData:", respData);
    return JSON.stringify(respData);
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
}

// function that gets xp gained from JS-piscine based on type = "xp", object type = "exercise" and path = "/gritlab/school-curriculum/piscine-js"
// the full query is like this: {
/*   user: user_by_pk(id: 1182) {
    transactions(
      order_by: {createdAt: desc}
      where: {
        _and: [
          {type: {_eq: "xp"}},
          {object: {type: {_eq: "exercise"}}},
          {path: {_like: "/gritlab/school-curriculum/piscine-js/%"}}
        ]
      }
    ) {
      createdAt
      amount
      objectId
      object{
        name
      }
    }
  }
} */

export async function fetchXPFromPiscineJS(jwt, userID) {
  const getXPFromPiscineJSQuery = `
    query GetXPFromPiscineJS($userID: Int!) {
      user: user_by_pk(id: $userID) {
        transactions(
          order_by: {createdAt: asc}
          where: {
            _and: [
              {type: {_eq: "xp"}},
              {object: {type: {_eq: "exercise"}}},
              {path: {_like: "/gritlab/school-curriculum/piscine-js/%"}}
            ]
          }
        ) {
          amount
          objectId
          object{
            name
          }
        }
      }
    }`;

  const url = "https://01.gritlab.ax/api/graphql-engine/v1/graphql";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const requestBody = {
    query: getXPFromPiscineJSQuery,
    variables: {
      userID: userID,
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
    // console.log("%crespDataforXPFromPiscineJS:", "color: blue", respData);
    return JSON.stringify(respData);
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
}

// now apply the same logic to get the xp gained from the piscine go, the path is "/gritlab/piscine-go/%"
export async function fetchXPFromPiscineGo(jwt, userID) {
  const getXPFromPiscineGoQuery = `
    query GetXPFromPiscineGo($userID: Int!) {
      user: user_by_pk(id: $userID) {
        transactions(
          order_by: {createdAt: asc}
          where: {
            _and: [
              {type: {_eq: "xp"}},
              {object: {type: {_eq: "exercise"}}},
              {path: {_like: "/gritlab/piscine-go/%"}}
            ]
          }
        ) {
          amount
          objectId
          object{
            name
          }
        }
      }
    }`;

  const url = "https://01.gritlab.ax/api/graphql-engine/v1/graphql";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const requestBody = {
    query: getXPFromPiscineGoQuery,
    variables: {
      userID: userID,
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
    // console.log("%crespDataforXPFromPiscineGo:", "color: blue", respData);
    return JSON.stringify(respData);
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
}

// query that gets the info of the transaction with type "level" to get the level progression of the user over time
/* query getLevel($userID: Int!) {
  user: user_by_pk(id: $userID) {
    transactions(order_by: {amount: desc}, where:
      {_and: [
        {type: {_eq: "level"}},
        {object: {type: {_eq: "project"}}}
      ]}) {
      type
      amount
      userId
      path
      object {
        name
        type
      }
    }
  }
} */

export async function fetchLevelProgression(jwt, userID) {
  const getLevelProgressionQuery = `
    query GetLevelProgression($userID: Int!) {
      user: user_by_pk(id: $userID) {
        transactions(order_by: {amount: asc}, where:
        {_and: [
          {type: {_eq: "level"}},
          {object: {type: {_eq: "project"}}}
        ]}) {
          amount
          path
          object {
            name
          }
        }
      }
    }`;

  const url = "https://01.gritlab.ax/api/graphql-engine/v1/graphql";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const requestBody = {
    query: getLevelProgressionQuery,
    variables: {
      userID: userID,
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
    // console.log("%crespDataforLevelProgression:", "color: blue", respData);
    return JSON.stringify(respData);
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
}

// get the auditRatio and totalUp and totalDown for creating the auditRatio chart
/* query getAuditInfo($userID: Int!) {
  user_by_pk(id: $userID){
   auditRatio
    totalUp
    totalDown
  }
} */

export async function fetchAuditInfo(jwt, userID) {
  const getAuditInfoQuery = `
    query GetAuditInfo($userID: Int!) {
      user: user_by_pk(id: $userID) {
        auditRatio
        totalUp
        totalDown
      }
    }`;

  const url = "https://01.gritlab.ax/api/graphql-engine/v1/graphql";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const requestBody = {
    query: getAuditInfoQuery,
    variables: {
      userID: userID,
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
    // console.log("%crespDataforAuditInfo:", "color: blue", respData);
    return JSON.stringify(respData);
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
}

// get all the available masteries of the user by this particular query, change it into $userID: Int! instead of 1182
/* {
  user_by_pk(id: 1182) {
    lastName
    firstName
    transactions(
      distinct_on: [type]
      where: {type: {_like: "skill_%"}}
    ) {
      type
      amount
    }
  }
} */

export async function fetchMasteries(jwt, userID) {
  // not in use
  const getMasteriesQuery = `
  query GetMasteries($userID: Int!) {
    user: user_by_pk(id: $userID) {
      transactions(
        order_by: {type: asc, createdAt: desc}
        distinct_on: type
        where: {
          type: {
            _in: [
              "skill_go",
              "skill_prog",
              "skill_back-end",
              "skill_front-end",
              "skill_html",
              "skill_js"
            ]
          }
        }
      ) {
        type
        amount
      }
    }
  }
  `;

  const url = "https://01.gritlab.ax/api/graphql-engine/v1/graphql";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const requestBody = {
    query: getMasteriesQuery,
    variables: {
      userID: userID,
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
    // console.log("%crespDataforMasteries:", "color: blue", respData);
    return JSON.stringify(respData);
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
}

// query that return basic user info
export async function fetchUserInfo(jwt, userID) {
  const getUserInfoQuery = `
  query GetUserInfo($userID: Int!) {
    user: user_by_pk(id: $userID) {
      firstName
      lastName
      createdAt
      email
      login
    }
  }`;

  const url = "https://01.gritlab.ax/api/graphql-engine/v1/graphql";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const requestBody = {
    query: getUserInfoQuery,
    variables: {
      userID: userID,
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
    // console.log("%crespDataforUserInfo:", "color: blue", respData);
    return JSON.stringify(respData);
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
}
