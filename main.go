package main

import (
	"fmt"
)

var boikeHang bool

func main() {

	fmt.Println("Kenny's test:")

	boikeHang = false
	canBoikeHang(boikeHang)

	testNewBranch()
}

func canBoikeHang(hang bool) {
	if hang {
		fmt.Println("Sweet Boike can hang")
	} else {
		fmt.Println("I knew it, Boike can't hang")
	}
}

func testNewBranch() {
	for i := 0; i < 10; i++ {
		fmt.Println(i)
	}
}
