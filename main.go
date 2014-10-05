package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"github.com/gorilla/mux"
	"strings"
)

func main() {
	fmt.Println("hello world")

	p1 := &Page{Subdomain: "TestPage", Html: []byte("This is a sample Page.")}
	p1.save()
	p2, _ := loadPage("TestPage")
	fmt.Println(string(p2.Html))

	r := mux.NewRouter()
	s := r.Host("{subdomain}.104.131.77.107").Subrouter()
	s.HandleFunc("/", HomeHandler)
	s.HandleFunc("/settings", SettingsHandler)
	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)

}

type Page struct {
	Subdomain string
	Html      []byte
}

func (p *Page) save() error {
	filename := p.Subdomain + ".html"
	return ioutil.WriteFile(filename, p.Html, 0600)
}

func loadPage(subdomain string) (*Page, error) {
	filename := subdomain + ".html"
	html, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return &Page{Subdomain: subdomain, Html: html}, nil
}

//HomeHandler

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("home")
	title := strings.Split(r.Host, ".watchsettings.com")
	fmt.Println("remote addr: " + r.RemoteAddr + " title: " + title)
	//fmt.Fprintf(w, loadPage(title).Html)

}

//SettingsHandler
func SettingsHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("setting")
}

//Watch for changes in "Apps"
