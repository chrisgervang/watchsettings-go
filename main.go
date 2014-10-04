package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"github.com/gorilla/mux"
)

func main() {
	fmt.Println("hello world")

	p1 := &Page{Subdomain: "TestPage", Html: []byte("This is a sample Page.")}
	p1.save()
	p2, _ := loadPage("TestPage")
	fmt.Println(string(p2.Html))

	r := mux.NewRouter()
	s := r.Host("{subdomain}.watchsettings.com").Subrouter()
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
	title := r
	fmt.Println(r)
	fmt.Fprintf(w, "<h1>%s</h1><div>%s</div>", r.URL.Path, title)

}

//SettingsHandler
func SettingsHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("setting")
}
