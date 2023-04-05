package Internal

import (
	"bytes"
	"encoding/base64"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

type LoginCredentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func encodeCredentials(credentials LoginCredentials) string {
	credStr := fmt.Sprintf("%s:%s", credentials.Username, credentials.Password)
	return base64.StdEncoding.EncodeToString([]byte(credStr))
}

func Signin(credentials LoginCredentials) (string, error) {
	client := &http.Client{}

	data := bytes.NewBuffer([]byte{})
	req, err := http.NewRequest("POST", "https://01.gritlab.ax/api/auth/signin", data)
	if err != nil {
		return "", err
	}

	encodedCredentials := encodeCredentials(credentials)
	req.Header.Set("Authorization", "Basic "+encodedCredentials)

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := ioutil.ReadAll(resp.Body)
		return "", errors.New(string(body))
	}

	tokenBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	// remove the quotes from the token
	token := strings.ReplaceAll(string(tokenBytes), "\"", "")

	return token, nil
}
