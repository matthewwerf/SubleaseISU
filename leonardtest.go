package main

import (
	"bufio"
	"fmt"
	"os"
)

type account struct {
	bal int
}

func main() {

	a := new(account)
	a.bal = 5000

	fmt.Println("Press 'c' to check balance")
	fmt.Println("Press 'w' to withdraw money")
	fmt.Println("Press 'd' to deposit money")
	fmt.Println("Press 'q' to quit")

	for {
		manageInput(*a)
	}

}
func checkBalance(a *account) {
	fmt.Println(*a.bal)
}
func withdraw(x int, a account) {
	a.bal = a.bal - x
}

func deposit(x int, a *account) {
	*a.bal = *a.bal + x
}

func manageInput(a account) {

	reader := bufio.NewReader(os.Stdin)
	char, _, err := reader.ReadRune()
	err = err

	switch char {
	case 'c':
		checkBalance(*a)
	case 'w':
		fmt.Println("How much would you like to withdraw?")
		var i int
		fmt.Scan(&i)
		withdraw(i, a)
	case 'd':
		fmt.Println("How much would you like to deposit?")
		var i int
		fmt.Scan(&i)
		deposit(i, a)
	case 'q':
		break

	}
}
