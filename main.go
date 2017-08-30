package main 

import (
	"fmt"
)

var boikeHang bool

func main() {

	fmt.Println("Kenny test again, and matt test")
	fmt.Println("Matt made a new Println")
	fmt.Println("Kenny test again, and matt test, hi matt")
	fmt.Println("This is Jack's test")
	fmt.Println("Boike commit a test buddy guy pal")
	fmt.Println("Hello ")
	fmt.Println("Hey Boike")
	fmt.Println("Boike is smart and cool")
	boikeHang = false
	canBoikeHang(boikeHang)
}

func canBoikeHang(hang bool){
	if hang{
		fmt.Println("Sweet Boike can hang")
	}
	else{
		fmt.Println("I knew it, Boike can't hang")
	}
}