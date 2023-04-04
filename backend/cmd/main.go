package main

import "fmt"

func main() {
	// Replace with your credentials
	credentials := LoginCredentials{
		Username: "minhtuann",
		Password: "Men0Grit!",
	}

	jwt, err := Signin(credentials)
	if err != nil {
		fmt.Println("Error logging in:", err)
		return
	}
	fmt.Println("JWT obtained:", jwt)
}
