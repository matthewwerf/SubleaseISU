package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
)

func main() {
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
