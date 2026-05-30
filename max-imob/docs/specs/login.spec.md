# Specificație Autentificare Admin și Agent

## 1. Informații Generale

- Nume funcționalitate: Autentificare admin și agent
- Tip funcționalitate: Full-stack
- Versiune: 1.0.0
- Autor: Claudiu Ștefan

## 2. Descrierea Problemei

Platforma are nevoie de un mecanism prin care doar administratorii și agenții să poată accesa zonele protejate ale aplicației.

Utilizatorii publici nu au conturi și nu trebuie să se autentifice. Autentificarea este necesară doar pentru personalul platformei: administratorii gestionează agenții, iar agenții gestionează proprietățile și lead-urile proprii.

## 3. Obiective

Obiective principale:
- Crearea paginii `/login`.
- Permiterea autentificării cu email și parolă pentru rolurile `admin` și `agent`.
- Verificarea parolei folosind bcrypt.
- Generarea unui JWT după autentificare reușită.
- Salvarea JWT-ului într-un cookie HTTP-only.
- Redirecționarea utilizatorului către zona potrivită rolului său.

Obiective secundare:
- Menținerea unui flux simplu, ușor de explicat la susținerea lucrării de licență.
- Separarea logicii de autentificare în controller și service.
- Validarea manuală a inputului, fără Zod.
- Pregătirea aplicației pentru protejarea viitoarelor rute `/admin/*` și `/agent/*`.

## 4. Cerințe Funcționale

- Sistemul trebuie să ofere ruta frontend `/login`.
- Pagina trebuie să afișeze un formular cu câmpurile `email` și `password`.
- Formularul trebuie să trimită datele către un endpoint REST de autentificare.
- Backend-ul trebuie să valideze manual datele primite.
- Backend-ul trebuie să caute utilizatorul după email.
- Backend-ul trebuie să verifice dacă utilizatorul este activ.
- Backend-ul trebuie să compare parola primită cu hash-ul stocat folosind bcrypt.
- Dacă autentificarea reușește, backend-ul trebuie să genereze un JWT.
- JWT-ul trebuie să conțină `userId` și `role`.
- JWT-ul trebuie salvat într-un cookie HTTP-only.
- Pentru rolul `admin`, răspunsul trebuie să indice redirecționarea către `/admin`.
- Pentru rolul `agent`, răspunsul trebuie să indice redirecționarea către `/agent`.
- Pentru date invalide, sistemul trebuie să afișeze un mesaj generic de eroare.
- Utilizatorii publici nu trebuie să aibă opțiune de creare cont.

Reguli de business:
- Doar administratorii și agenții se pot autentifica.
- Utilizatorii publici nu au conturi.
- Conturile inactive nu pot autentifica utilizatorul.
- Parolele nu se returnează niciodată în răspunsurile API.
- Erorile de autentificare nu trebuie să dezvăluie dacă emailul există.

## 5. Cerințe Non-Funcționale

Cerințe de performanță:
- Endpoint-ul de login trebuie să facă o singură căutare principală după email.
- Pagina de login trebuie să fie ușoară și rapidă.
- Formularul trebuie să prevină submit-uri repetate în timpul cererii.

Cerințe de securitate:
- Parolele trebuie stocate numai ca hash bcrypt.
- JWT-ul trebuie semnat cu un secret din variabile de mediu.
- Cookie-ul trebuie să fie HTTP-only.
- Cookie-ul trebuie să folosească `sameSite`.
- În producție, cookie-ul trebuie să fie `secure`.
- Validarea inputului trebuie făcută înainte de verificarea credențialelor.
- Mesajele de eroare pentru credențiale invalide trebuie să fie generice.

Cerințe de utilizabilitate:
- Formularul trebuie să fie clar și responsive.
- Interfața trebuie construită cu Bootstrap și HTML semantic.
- Butonul principal trebuie să indice acțiunea de autentificare.
- Erorile trebuie afișate vizibil lângă formular.

Considerente de mentenanță:
- Controllerul trebuie să gestioneze request-ul și response-ul, nu logica de business.
- Service-ul trebuie să conțină logica de autentificare.
- Validarea manuală trebuie să fie simplă, explicită și ușor de testat.
- Codul trebuie să respecte TypeScript strict și să evite `any`.

## 6. Povești de Utilizator

- Ca agent, vreau să mă autentific pentru a-mi administra proprietățile și lead-urile.
- Ca agent, vreau să fiu trimis către zona `/agent` după autentificare.
- Ca administrator, vreau să mă autentific pentru a administra agenții.
- Ca administrator, vreau să fiu trimis către zona `/admin` după autentificare.
- Ca utilizator public, vreau să pot naviga pe site fără cont.
- Ca evaluator al lucrării de licență, vreau să văd o separare clară între accesul public și accesul protejat.

## 7. Designul Sistemului

### Design Backend

Endpoint-uri API:
- `POST /api/auth/login`
  - Primește `email` și `password`.
  - Validează manual inputul.
  - Verifică utilizatorul în baza de date.
  - Compară parola cu bcrypt.
  - Generează JWT.
  - Setează cookie HTTP-only.
  - Returnează răspuns JSON standard.

Răspuns de succes:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "agent@example.com",
      "role": "agent"
    },
    "redirectTo": "/agent"
  },
  "error": null
}
```

Răspuns de eroare:
```json
{
  "success": false,
  "data": null,
  "error": "Email sau parolă invalidă."
}
```

Controllere:
- `authController`
  - Primește request-ul pentru login.
  - Apelează funcția de validare manuală.
  - Apelează `authService`.
  - Setează cookie-ul HTTP-only.
  - Returnează răspunsul JSON standard.

Servicii:
- `authService`
  - Caută utilizatorul după email folosind PostgreSQL direct prin biblioteca `pg`.
  - Verifică dacă utilizatorul este activ.
  - Compară parola cu hash-ul bcrypt.
  - Generează payload-ul JWT.
  - Determină ruta de redirecționare pe baza rolului.

Validare manuală:
- O funcție simplă, de exemplu `validateLoginInput`, va verifica tipurile și formatul minim al datelor.
- Funcția va returna fie date validate, fie o eroare controlată.

### Design Frontend

Pagini afectate:
- `app/login/page.tsx`

Componente utilizate:
- Formular de login cu HTML semantic și clase Bootstrap.
- Componentă client pentru starea formularului și trimiterea request-ului.

State handling:
- `email`
- `password`
- `isLoading`
- `error`

Flux frontend:
- Utilizatorul completează emailul și parola.
- Utilizatorul apasă butonul de autentificare.
- Butonul se dezactivează pe durata request-ului.
- Frontend-ul trimite `POST /api/auth/login`.
- La succes, frontend-ul navighează către `redirectTo`.
- La eroare, frontend-ul afișează mesajul primit sau un mesaj generic.

## 8. Designul Bazei de Date

Tabel: `users`

Câmpuri:
- `id`: identificator unic.
- `email`: adresă de email unică.
- `password_hash`: parola stocată ca hash bcrypt.
- `role`: rolul utilizatorului, cu valori `admin` sau `agent`.
- `is_active`: indică dacă utilizatorul poate autentifica.
- `created_at`: data creării.
- `updated_at`: data ultimei actualizări.

Relații:
- Un agent poate avea mai multe proprietăți.
- Un agent poate primi mai multe lead-uri prin proprietățile sale.

Constrângeri:
- `email` trebuie să fie unic.
- `password_hash` este obligatoriu.
- `role` trebuie să accepte doar `admin` și `agent`.
- `is_active` trebuie să aibă valoare implicită `true`.

## 9. Flux de Date

1. Agentul sau administratorul accesează `/login`.
2. Frontend-ul afișează formularul.
3. Utilizatorul introduce emailul și parola.
4. Frontend-ul trimite datele către `POST /api/auth/login`.
5. Backend-ul validează manual datele primite.
6. Backend-ul caută utilizatorul după email.
7. Backend-ul verifică dacă utilizatorul este activ.
8. Backend-ul compară parola cu hash-ul bcrypt.
9. Backend-ul generează JWT cu `userId` și `role`.
10. Backend-ul setează JWT-ul în cookie HTTP-only.
11. Backend-ul returnează ruta de redirecționare.
12. Frontend-ul redirecționează utilizatorul către `/admin` sau `/agent`.

## 10. Reguli de Validare

Reguli de validare pentru input:
- `email` este obligatoriu.
- `email` trebuie să fie string.
- `email` trebuie să aibă format de email.
- `email` va fi normalizat prin `trim` și transformare în litere mici.
- `password` este obligatoriu.
- `password` trebuie să fie string.
- `password` trebuie să aibă minimum 8 caractere.

Constrângeri de logică business:
- Doar rolurile `admin` și `agent` sunt acceptate.
- Conturile inactive sunt respinse.
- Utilizatorii publici nu sunt incluși în autentificare.
- Mesajul pentru credențiale invalide trebuie să fie generic.

## 11. Considerente de Securitate

Reguli de autentificare:
- Autentificarea se face doar cu email și parolă.
- Parola se verifică prin bcrypt.
- JWT-ul se generează doar după verificarea completă a credențialelor.

Reguli de autorizare:
- Adminul va accesa rutele `/admin/*`.
- Agentul va accesa rutele `/agent/*`.
- Utilizatorii neautentificați vor fi redirecționați către `/login` când încearcă să acceseze rute protejate.

Protecția datelor:
- Hash-ul parolei nu se trimite către frontend.
- JWT-ul nu se salvează în `localStorage` sau `sessionStorage`.
- JWT-ul se salvează doar în cookie HTTP-only.
- Secretul JWT se citește din variabile de mediu.

## 12. Cazuri Limită

- Emailul nu există.
- Parola este greșită.
- Contul este inactiv.
- Rolul utilizatorului este invalid.
- Secretul JWT lipsește.
- Baza de date nu este disponibilă.
- Request-ul conține câmpuri lipsă.
- Request-ul conține tipuri invalide.
- Utilizatorul apasă de mai multe ori pe submit.

Strategii de tratare:
- Pentru email sau parolă greșită se afișează același mesaj generic.
- Pentru erori de server se afișează un mesaj generic de indisponibilitate.
- Butonul de submit este dezactivat în timpul request-ului.
- Backend-ul returnează răspunsuri în formatul standard al proiectului.

## 13. Criterii de Acceptare

- [ ] Ruta `/login` afișează formularul de autentificare.
- [ ] Formularul conține câmpurile email și parolă.
- [ ] Formularul este responsive și folosește Bootstrap.
- [ ] Endpoint-ul `POST /api/auth/login` există.
- [ ] Backend-ul validează manual inputul, fără Zod.
- [ ] Backend-ul verifică parola cu bcrypt.
- [ ] Backend-ul generează JWT cu `userId` și `role`.
- [ ] JWT-ul este salvat într-un cookie HTTP-only.
- [ ] Adminul primește redirecționare către `/admin`.
- [ ] Agentul primește redirecționare către `/agent`.
- [ ] Credențialele invalide afișează mesaj generic.
- [ ] Utilizatorii publici nu primesc opțiune de creare cont.
- [ ] Răspunsurile API respectă formatul standard al proiectului.
- [ ] Hash-ul parolei nu este expus în răspunsurile API.

## 14. Îmbunătățiri Viitoare

- Adăugarea funcționalității de logout.
- Protejarea completă a rutelor `/admin/*` și `/agent/*`.
- Limitarea numărului de încercări de autentificare.
- Recuperarea parolei pentru administratori și agenți.
- Afișarea unei pagini dedicate pentru acces neautorizat.
