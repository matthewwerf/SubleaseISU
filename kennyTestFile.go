package main

import (
	"bufio"
	"fmt"
	"os"
	"unicode/utf8"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	fmt.Println(scanner.Text())

	//drawPyramid("ISU", 5)
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
