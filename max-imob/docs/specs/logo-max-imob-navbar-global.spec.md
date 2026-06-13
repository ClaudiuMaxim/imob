# Specificatie functionalitate: Logo Max Imob in toate zonele aplicatiei

## 1. Informatii generale

- Nume functionalitate: Logo Max Imob in toate zonele aplicatiei
- Tip functionalitate: frontend
- Versiune: 1.0
- Autor: Claudiu Stefan

## 2. Problema

Aplicatia foloseste deja logo-ul Max Imob pe pagina publica principala, insa zonele dedicate autentificarii, agentului si administratorului folosesc in continuare text simplu in bara de navigare, de exemplu `Max Imob`, `Max Imob Agent` si `Max Imob Admin`.

Aceasta diferenta face interfata mai putin unitara si reduce consistenta vizuala a platformei. Pentru o aplicatie imobiliara prezentata intr-o lucrare de licenta, identitatea vizuala trebuie sa fie coerenta in toate zonele principale: public, login, agent si admin.

## 3. Obiective

Obiective principale:

- Folosirea aceluiasi logo Max Imob in zona publica, pagina de login, zona agentului si zona administratorului.
- Pastrarea navigarii catre pagina principala atunci cand utilizatorul apasa pe logo.
- Pastrarea diferentierii contextului prin text scurt, de exemplu `Agent` sau `Admin`, langa logo sau in zona de navigare.

Obiective secundare:

- Mentinerea unui aspect simplu si curat cu Bootstrap.
- Evitarea duplicarii inutile a markup-ului pentru logo.
- Pastrarea compatibilitatii cu layout-ul mobil.

## 4. Cerinte functionale

- Header-ul public continua sa afiseze logo-ul Max Imob.
- Navbar-ul din pagina `/login` afiseaza logo-ul Max Imob in locul textului simplu.
- Navbar-ul din pagina `/agent/properties` afiseaza logo-ul Max Imob in locul textului simplu.
- Navbar-ul din pagina `/agent/messages` afiseaza logo-ul Max Imob in locul textului simplu.
- Navbar-ul din pagina `/admin/agents` afiseaza logo-ul Max Imob in locul textului simplu.
- Logo-ul ramane link catre `/`.
- Zona agentului trebuie sa indice in continuare ca utilizatorul se afla in interfata de agent.
- Zona adminului trebuie sa indice in continuare ca utilizatorul se afla in interfata de admin.
- Pagina de login poate indica discret contextul printr-un badge `Login` sau `Autentificare`.
- Butoanele existente de navigare nu se elimina.
- Nu se modifica rutele aplicatiei.

## 5. Cerinte non-functionale

- Performanta:
  - Logo-ul trebuie incarcat din fisier local existent in `public`.
  - Nu se adauga dependinte noi.

- Securitate:
  - Functionalitatea nu modifica autentificarea sau autorizarea.
  - Link-urile existente catre zone protejate raman neschimbate.

- Uzabilitate:
  - Logo-ul trebuie sa fie lizibil in navbar.
  - Pe ecrane mici, logo-ul si butoanele de navigare nu trebuie sa se suprapuna.
  - Textul `Agent` sau `Admin` trebuie sa fie discret, dar vizibil.

- Mentenabilitate:
  - Daca este util, se poate introduce o componenta reutilizabila pentru logo.
  - Codul trebuie sa ramana simplu si usor de explicat.

## 6. User stories

- Ca utilizator public, vreau sa vad identitatea Max Imob in header, pentru a recunoaste platforma.
- Ca agent, vreau sa vad acelasi logo in dashboard, pentru a simti ca lucrez in aceeasi aplicatie.
- Ca admin, vreau sa vad logo-ul Max Imob in panoul de administrare, pentru consistenta vizuala.
- Ca utilizator autentificat, vreau sa pot reveni la pagina principala apasand pe logo.

## 7. Design sistem

### Backend Design

Nu sunt necesare modificari backend.

Endpoint-uri afectate:

- Niciun endpoint.

Controllers si services:

- Nu se modifica.

### Frontend Design

Pagini afectate:

- `/`
- `/login`
- `/agent/properties`
- `/agent/messages`
- `/admin/agents`

Componente/fisiere afectate:

- `app/components/Header.tsx`
- `app/login/page.tsx`
- `app/agent/properties/page.tsx`
- `app/agent/messages/page.tsx`
- `app/admin/agents/page.tsx`

Componenta posibila:

- `app/components/Logo.tsx`

Rol componenta:

- Afiseaza imaginea `/logo-max-imob.svg`.
- Primeste optional un text de context, de exemplu `Login`, `Agent` sau `Admin`.
- Pastreaza `alt="Max Imob"`.

State handling:

- Nu este necesar state React.

## 8. Design baza de date

Nu sunt necesare modificari in baza de date.

Tabele afectate:

- Niciun tabel.

Migrari:

- Nu se creeaza migrari SQL.

## 9. Flux de date

1. Utilizatorul acceseaza o pagina publica, de login, de agent sau de admin.
2. Next.js randareaza pagina corespunzatoare.
3. Navbar-ul include logo-ul local Max Imob.
4. Daca utilizatorul apasa pe logo, este navigat catre `/`.

## 10. Reguli de validare

- Fisierul logo trebuie sa existe in `public/logo-max-imob.svg`.
- Elementul imagine trebuie sa aiba atribut `alt`.
- Link-ul logo-ului trebuie sa indice catre `/`.
- Textul de context `Login`, `Agent` sau `Admin` nu trebuie sa inlocuiasca numele brandului.

## 11. Consideratii de securitate

- Nu se modifica middleware-ul de autentificare.
- Nu se modifica JWT-ul sau cookie-ul HTTP-only.
- Nu se expun date noi catre client.
- Functionalitatea este strict vizuala.

## 12. Cazuri limita

- Daca logo-ul nu se incarca, atributul `alt` permite identificarea brandului.
- Pe ecrane mici, butoanele de navigare pot trece pe randul urmator daca este necesar.
- Daca se refoloseste componenta de logo, aceasta trebuie sa functioneze atat in navbar public, cat si in navbar login/agent/admin.

## 13. Criterii de acceptanta

- [ ] Header-ul public afiseaza logo-ul Max Imob.
- [ ] Pagina `/login` afiseaza logo-ul Max Imob in navbar.
- [ ] Pagina `/agent/properties` afiseaza logo-ul Max Imob in navbar.
- [ ] Pagina `/agent/messages` afiseaza logo-ul Max Imob in navbar.
- [ ] Pagina `/admin/agents` afiseaza logo-ul Max Imob in navbar.
- [ ] Logo-ul este link catre `/`.
- [ ] Zonele agent si admin pastreaza un indicator vizual pentru rol.
- [ ] Nu se modifica backend-ul.
- [ ] Nu se creeaza migrari SQL.
- [ ] Nu se adauga dependinte noi.

## 14. Imbunatatiri viitoare

- Crearea unui layout comun pentru paginile agentului.
- Crearea unui layout comun pentru paginile adminului.
- Adaugarea unei variante compacte a logo-ului pentru ecrane foarte mici.
- Adaugarea unui meniu responsive complet pentru dashboard-uri.
