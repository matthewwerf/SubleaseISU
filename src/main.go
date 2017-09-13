package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
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

	hiKenny(1)
	JackTempFunction("*")

	// This is where we load the web-app
	port := flag.Int("port", 4200, "port to serve on")
	dir := flag.String("directory", "web/", "directory of web files")
	flag.Parse()

	fs := http.Dir(*dir)
	fileHandler := http.FileServer(fs)
	http.Handle("/", fileHandler)

	log.Printf("Running on port %d\n", *port)
	addr := fmt.Sprintf("127.0.0.1:%d", *port)
	// this is a blocking call, the program will run here forever
	err := http.ListenAndServe(addr, nil)
	fmt.Println(err.Error())

}

func hiKenny(temp int) {
	fmt.Println("Hi Derf")

}

func canBoikeHang(hang bool) {
	if hang {
		fmt.Println("Sweet Boike can hang")
	} else {
		fmt.Println("I knew it, Boike can't hang")
	}
}
