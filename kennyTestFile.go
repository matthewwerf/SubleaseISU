package main

import (
	"fmt"
)

func main() {
	drawPyramid("$", 5)
}

func drawPyramid(blocks string, base int) {
	for i := 0; i < base; i++ {
		for j := 0; j < (base - i); j++ {
			fmt.Print(" ")
		}
		for k := 0; k <= i; k++ {
			fmt.Print(blocks + " ")
		}
		fmt.Println()
	}
}
