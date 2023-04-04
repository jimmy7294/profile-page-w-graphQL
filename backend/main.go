package main

import (
	"fmt"

	Internal "github.com/jimmy7294/profile-page-w-graphQL/backend/internal"
)

func main() {
	// Replace with your credentials
	credentials := Internal.LoginCredentials{
		Username: "minhtuann",
		Password: "Men0Grit!",
	}

	jwt, err := Internal.Signin(credentials)
	if err != nil {
		fmt.Println("Error logging in:", err)
		return
	}
	fmt.Println("JWT obtained:", jwt)

	// execute the graphql query using the jwt
	queryResult, err := Internal.ExecuteGraphQLQuery(jwt)
	if err != nil {
		fmt.Println("Error executing query:", err)
		return
	}
	fmt.Println("Query result:", queryResult)
}
