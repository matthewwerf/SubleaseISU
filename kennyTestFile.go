package main

import (
	"bufio"
	"fmt"
	"os"
	"unicode/utf8"
)

func main() {
	var baseSize int
	scanner := bufio.NewScanner(os.Stdin)

	//User input to determine building blocks of pyramid
	fmt.Print("Enter in string to build pyramid: ")
	scanner.Scan()
	symbol := scanner.Text()
	//fmt.Println(symbol)

	//User input to determine base size of pyramid
	fmt.Print("Enter size of pyramid base: ")
	_, err := fmt.Scanf("%d", &baseSize)

	if err != nil {
		fmt.Println(err)
	}
	//fmt.Println(baseSize)

	// scanner.Scan()
	// baseSize := scanner.Text()
	// fmt.Println(baseSize)

	drawPyramid(symbol, baseSize)

}

func drawPyramid(blocks string, base int) {
	spaceAmt := utf8.RuneCountInString(blocks)
	var spaces string = ""

	//Use to create string to represent the amount of spaces needed between each building block
	//to create a perfectly symmetrical pyramid
	for q := 0; q < spaceAmt; q++ {
		spaces = spaces + " "
	}
	//Create pyramid
	for i := 0; i < base; i++ {
		for j := 0; j < (base - i); j++ {
			fmt.Print(spaces)
		}
		for k := 0; k <= i; k++ {
			fmt.Print(blocks + spaces)
		}
		fmt.Println()
	}
}
