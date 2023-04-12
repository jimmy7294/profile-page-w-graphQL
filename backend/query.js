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
    }
    catch (error) {
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

