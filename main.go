//fireware redirection command: iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8080

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

	// p1 := &Page{Subdomain: "TestPage", Html: []byte("This is a sample Page.")}
	// p1.save()
	// p2, _ := loadPage("TestPage")
	// fmt.Println(string(p2.Html))

	fmt.Println("sup")

	r := mux.NewRouter()
	s := r.Host("{subdomain}.watchsettings.com").Subrouter()
	s.HandleFunc("/", HomeHandler)
	r.Handle("/", http.FileServer(http.Dir("www")))

	//pass all route requests to mux
	http.Handle("/", r)

	//serve server
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
	//fmt.Println("remote addr: " + r.RemoteAddr + " title: " + title[0])
	p, _ := loadPage(title[0])
	fmt.Fprintf(w, "%s", p.Html)

}
