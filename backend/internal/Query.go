package Internal

import (
	"context"
	"fmt"

	"github.com/machinebox/graphql"
)

func ExecuteGraphQLQuery(jwt string) (string, error) {
	client := graphql.NewClient("https://01.gritlab.ax/api/graphql")

	// create a simple request for user data including id and login
	query := `
	{
		user {
			id
			login
		}
	}
	`
	req := graphql.NewRequest(query)

	// Set the JWT as a Beare token in the Authorization header
	req.Header.Set("Authorization", "Bearer "+jwt)

	// Execute the request
	var respData map[string]interface{}
	if err := client.Run(context.Background(), req, &respData); err != nil {
		return "", err
	}

	// return the response as a string
	fmt.Println("respData:", respData)
	return fmt.Sprintf("%v", respData), nil
}
