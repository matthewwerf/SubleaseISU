package test

import (
	"fmt"
	"bufio"
	"os"
)

type account struct{
	bal int
}

func main() {

	a =: new(account)
	scan := bufio.NewReader(os.Stdin)
	fmt.Println("How Much Money do you have?")
	a.bal, _ := scan.ReadInt()

	fmt.Println("Press 'c' to check balance")
	fmt.Println("Press 'w' to withdraw money")
	fmt.Println("Press 'd' to deposit money")
	fmt.Println("Press 'q' to quit")

	for {
		manageInput()
	}
	
}
func checkBalance(){

}
func withdraw(x int) {
	
}

func deposit(x int) {
	
}

func manageInput() {

	reader := bufio.NewReader(os.Stdin)
    input, _ := reader.ReadString('\n')

    var s := string([]byte(input)[0])

    switch s{
    case c:
    	checkBalance()
    case w:
    	withdraw()
    case d:
    	deposit()

    }


}