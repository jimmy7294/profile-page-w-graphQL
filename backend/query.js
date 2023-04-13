export async function fetchTransactionByXP(jwt, userID) {
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

export async function fetchTransactions(jwt, userId) {
  const getTransactionsQuery = `
      query GetTransactions($userId: Int!) {
        user: user_by_pk(id: $userId) {
          transactions(order_by: {createdAt: desc}) {
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
      }
    `;

  const url = "https://01.gritlab.ax/api/graphql-engine/v1/graphql";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const requestBody = {
    query: getTransactionsQuery,
    variables: {
      userId: userId,
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
          createdAt
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
          createdAt
          amount
          objectId
          object{
            name
          }
        }
      }
    }`
  
    const url = "https://01.gritlab.ax/api/graphql-engine/v1/graphql";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    };

    const requestBody = {
      query: getXPFromPiscineGoQuery,
      variables: {
        userID: userID,
      }
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
