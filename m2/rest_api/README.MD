# Milestone 2

## Backend
    Pentru acest milestone am implementat în backend hashuirea parolei și verificarea ei,
    întrucât o parolă plain text în baza de date nu este sigură deloc.

## API
    API-ul fiind partea care ne dă un răspund din backend pentru utilizator spre frontend, aici
    am implementat erorile user friendly, care pot fi afișate mai apoi în frontend

### Users
    Pentru ruta de useri am implemntat rutele pentru
    1. adăugare de utilizator
    2. autentificare
        - dacă logarea utilizatorului e ok, returnam un json cu AccessToken-ul
    3. stergere utilizator
        - stergerea fiind făcută doar dacă ai token-ul utilizatorului

### Urls
    Pentru ruta de url-uri am implementat rutele pentru
    1. adăugare de url
    2. primire informații url
    3. primire url-urile unui anumit utilizator
    4. stergere url

### Files
    Pentru ruta de fisiere am implemntat rutele pentru
    1. Adaugare de fisier
    2. Primire informatiile unui fisier
    3. Primire toate fisierele unui utilizator
    4. Stergere fisier

## Feedback
    La început a fost destul de complicată începerea acestei părți, întrucât era nevoie de documentarea despre
    serializeToJson() și cum hash-uiești corect o parolă pentru a o introduce corect în baza de date.
    După ce s-au creat primele rute, restul au fost implementate ușor, întrucât am înțeles cum funcționează un API.