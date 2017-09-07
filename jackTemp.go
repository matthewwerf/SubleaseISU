package main

import (
	"fmt"
)

func JackTempFunction(useChar string) {
	//counter := 0
	stopvar := 1
	for i := 0; i < 10; i++ {
		for counter := 0; counter < stopvar; counter++ {
			fmt.Print(useChar)
		}
		fmt.Println("")
		stopvar++
	}
	counter1 := 0
	for j := 0; j < 11; j++ {
		for counter1 = 0; counter1 < stopvar; counter1++ {
			fmt.Print(useChar)
		}
		fmt.Println("")
		stopvar--
	}
}
