# Specificație Gestionare Agenți

## 1. Informații Generale

- Nume funcționalitate: Gestionare agenți
- Tip funcționalitate: Full-stack
- Versiune: 1.0.0
- Autor: Claudiu Ștefan

## 2. Descrierea Problemei

Platforma are nevoie de o zonă administrativă în care administratorul poate crea și gestiona agenții imobiliari. Agenții sunt utilizatori interni ai sistemului și au acces ulterior la administrarea proprietăților și lead-urilor proprii.

Fără această funcționalitate, conturile de agent ar trebui adăugate manual în baza de date, ceea ce contrazice scopul aplicației și nu este potrivit pentru o demonstrație de licență.

## 3. Obiective

Obiective principale:
- Crearea unei pagini admin pentru listarea agenților.
- Permiterea creării unui agent de către administrator.
- Permiterea activării și dezactivării unui agent.
- Permiterea actualizării datelor de bază ale unui agent.
- Expunerea unor endpoint-uri REST pentru operațiile de administrare.

Obiective secundare:
- Păstrarea accesului doar pentru rolul `admin`.
- Folosirea validării manuale, fără Zod.
- Folosirea PostgreSQL direct prin biblioteca `pg`.
- Menținerea interfeței simple, responsive și construită cu Bootstrap.

## 4. Cerințe Funcționale

- Sistemul trebuie să ofere pagina `/admin/agents`.
- Pagina trebuie să afișeze lista agenților existenți.
- Administratorul trebuie să poată crea un agent nou.
- Formularul de creare agent trebuie să conțină `name`, `email`, `phone` și `password`.
- Sistemul trebuie să salveze parola agentului doar ca hash bcrypt.
- Administratorul trebuie să poată actualiza numele, telefonul și statusul unui agent.
- Administratorul trebuie să poată dezactiva un agent fără a șterge fizic contul.
- Administratorul trebuie să poată reactiva un agent dezactivat.
- Sistemul trebuie să returneze răspunsuri JSON în formatul standard al proiectului.
- Utilizatorii publici și agenții nu trebuie să poată gestiona agenți.

Reguli de business:
- Doar utilizatorii cu rol `admin` pot crea și gestiona agenți.
- Un agent creat trebuie să aibă rolul `agent`.
- Emailul agentului trebuie să fie unic.
- Adminul nu gestionează proprietăți prin această funcționalitate.
- Dezactivarea agentului împiedică autentificarea acestuia.
- Ștergerea fizică a agentului nu este inclusă în această versiune.

## 5. Cerințe Non-Funcționale

Cerințe de performanță:
- Listarea agenților trebuie să folosească interogări SQL simple.
- Operațiile de creare și actualizare trebuie să afecteze o singură înregistrare.
- Pagina admin trebuie să fie rapidă și să nu încarce date inutile.

Cerințe de securitate:
- Endpoint-urile pentru agenți trebuie protejate cu JWT.
- Doar rolul `admin` poate accesa aceste endpoint-uri.
- Parolele trebuie hash-uite cu bcrypt.
- Hash-ul parolei nu trebuie returnat către frontend.
- Inputul trebuie validat manual înainte de interogările SQL.
- Interogările SQL trebuie parametrizate pentru a evita SQL injection.

Cerințe de utilizabilitate:
- Interfața trebuie să fie clară și mobile-first.
- Lista agenților trebuie să arate statusul activ/inactiv.
- Acțiunile principale trebuie să fie vizibile: creare, editare, activare/dezactivare.
- Mesajele de eroare trebuie să fie ușor de înțeles.

Considerente de mentenanță:
- Logica SQL trebuie izolată în servicii.
- Handler-ele API trebuie să păstreze structura cu obiectul `routes` în partea de sus.
- Validarea trebuie să fie în funcții separate.
- Codul trebuie să rămână simplu și fără abstractizări inutile.

## 6. Povești de Utilizator

- Ca administrator, vreau să văd lista agenților pentru a gestiona personalul platformei.
- Ca administrator, vreau să creez un agent nou pentru ca acesta să poată administra proprietăți.
- Ca administrator, vreau să dezactivez un agent pentru a-i opri accesul în platformă.
- Ca administrator, vreau să reactivez un agent când acesta trebuie să aibă acces din nou.
- Ca agent, vreau ca accesul meu să fie controlat de administrator.
- Ca evaluator al lucrării de licență, vreau să văd o separare clară între rolul de admin și rolul de agent.

## 7. Designul Sistemului

### Design Backend

Endpoint-uri API:
- `GET /api/agents`
  - Returnează lista agenților.
  - Acceptă opțional query `status=active` sau `status=inactive`.
  - Acces permis doar pentru admin.

- `POST /api/agents`
  - Creează un agent nou.
  - Primește `name`, `email`, `phone`, `password`.
  - Hash-uiește parola cu bcrypt.
  - Salvează agentul în tabelul `users` cu rolul `agent`.
  - Acces permis doar pentru admin.

- `GET /api/agents/[id]`
  - Returnează detaliile unui agent.
  - Acces permis doar pentru admin.

- `PUT /api/agents/[id]`
  - Actualizează datele de bază ale agentului.
  - Permite modificarea câmpurilor `name`, `phone` și `is_active`.
  - Nu modifică parola în această versiune.
  - Acces permis doar pentru admin.

- `DELETE /api/agents/[id]`
  - Dezactivează agentul prin setarea `is_active = false`.
  - Nu șterge fizic rândul din baza de date.
  - Acces permis doar pentru admin.

Structură route handlers:
- Fiecare `route.ts` va avea obiect `routes` în partea de sus.
- Exporturile HTTP vor fi alias-uri către handler-ele definite.

Exemplu:
```ts
const routes = {
  GET: handleGetAgents,
  POST: handleCreateAgent,
};

export const GET = routes.GET;
export const POST = routes.POST;
```

Controllere:
- Handler-ele din `route.ts` au rol de controller.
- Controllerul validează request-ul și apelează serviciul.
- Controllerul nu conține logică de business.

Servicii:
- `agentService`
  - Listează agenți.
  - Creează agent.
  - Găsește agent după `id`.
  - Actualizează agent.
  - Dezactivează agent.

Validare manuală:
- `validateCreateAgentInput`
- `validateUpdateAgentInput`
- `validateAgentStatusFilter`

Autentificare și autorizare:
- Se va adăuga helper pentru citirea JWT-ului din cookie.
- Se va adăuga helper pentru verificarea rolului `admin`.
- Endpoint-urile refuză request-urile fără JWT valid sau fără rol `admin`.

### Design Frontend

Pagini afectate:
- `app/admin/agents/page.tsx`

Componente utilizate:
- Tabel/listă agenți cu Bootstrap.
- Formular de creare agent.
- Formular simplu pentru editarea datelor de bază.
- Butoane pentru activare/dezactivare.

State handling:
- Componentă client pentru listă și formulare.
- State pentru `agents`, `isLoading`, `error`, `successMessage`.
- State pentru formularul de creare.
- State pentru editarea agentului selectat.

Flux UI:
- Administratorul accesează `/admin/agents`.
- Pagina cere lista agenților din `GET /api/agents`.
- Administratorul completează formularul de creare.
- Frontend-ul trimite `POST /api/agents`.
- După succes, lista se reîncarcă.
- Administratorul poate modifica statusul unui agent.
- Frontend-ul trimite `PUT /api/agents/[id]` sau `DELETE /api/agents/[id]`.

## 8. Designul Bazei de Date

Tabel afectat: `users`

Câmpuri existente:
- `id`
- `email`
- `password_hash`
- `role`
- `is_active`
- `created_at`
- `updated_at`

Câmpuri noi necesare:
- `name`: numele agentului.
- `phone`: telefonul agentului.

Migrație SQL:
- Se va adăuga un fișier nou în `db/migrations/`.
- Migrația va adăuga coloanele `name` și `phone` în tabelul `users`.

Relații:
- În viitor, agenții vor avea relații cu `properties` și `leads`.
- În această versiune nu se creează tabelele `properties` sau `leads`.

Constrângeri:
- `email` rămâne unic.
- `role` trebuie să fie `agent` pentru agenții creați prin această funcționalitate.
- `name` este obligatoriu pentru agenții noi.
- `phone` este opțional sau poate fi gol.

## 9. Flux de Date

1. Administratorul se autentifică.
2. Browserul primește cookie-ul HTTP-only cu JWT.
3. Administratorul accesează `/admin/agents`.
4. Frontend-ul cere lista agenților prin `GET /api/agents`.
5. Backend-ul verifică JWT-ul și rolul `admin`.
6. Backend-ul citește agenții din PostgreSQL.
7. Frontend-ul afișează lista.
8. Administratorul completează formularul de creare.
9. Frontend-ul trimite `POST /api/agents`.
10. Backend-ul validează inputul manual.
11. Backend-ul hash-uiește parola.
12. Backend-ul inserează agentul în `users`.
13. Frontend-ul reîncarcă lista și afișează mesaj de succes.

## 10. Reguli de Validare

Reguli pentru creare agent:
- `name` este obligatoriu.
- `name` trebuie să fie string.
- `name` trebuie să aibă între 2 și 100 de caractere.
- `email` este obligatoriu.
- `email` trebuie să aibă format valid.
- `email` se normalizează prin `trim` și litere mici.
- `phone` este opțional.
- `phone` trebuie să aibă maximum 30 de caractere.
- `password` este obligatoriu.
- `password` trebuie să aibă minimum 8 caractere.

Reguli pentru actualizare agent:
- `name` este opțional, dar dacă există trebuie să respecte limita de caractere.
- `phone` este opțional, dar dacă există trebuie să respecte limita de caractere.
- `is_active` este opțional, dar dacă există trebuie să fie boolean.
- Nu se poate modifica rolul agentului prin acest endpoint.
- Nu se poate modifica parola prin acest endpoint.

Constrângeri de logică business:
- Doar adminul poate gestiona agenți.
- Agentul creat primește mereu rolul `agent`.
- Un admin nu poate fi creat prin endpoint-ul de agenți.
- Un agent dezactivat nu se poate autentifica.

## 11. Considerente de Securitate

Reguli de autentificare:
- Endpoint-urile cer JWT valid în cookie HTTP-only.
- JWT-ul trebuie să conțină `userId` și `role`.

Reguli de autorizare:
- Acces permis doar pentru `role = admin`.
- Agenții autentificați nu pot accesa managementul agenților.
- Utilizatorii publici nu pot accesa endpoint-urile admin.

Protecția datelor:
- `password_hash` nu se returnează în API.
- Parola simplă nu se loghează.
- Query-urile SQL folosesc parametri.
- Erorile interne nu sunt expuse către frontend.

## 12. Cazuri Limită

- Administratorul nu este autentificat.
- JWT-ul este invalid sau expirat.
- Utilizatorul autentificat este agent, nu admin.
- Emailul agentului există deja.
- Parola este prea scurtă.
- Numele agentului lipsește.
- Baza de date nu este disponibilă.
- Agentul cerut după `id` nu există.
- Agentul este deja inactiv când se încearcă dezactivarea.
- Request-ul conține câmpuri cu tipuri invalide.

Strategii de tratare:
- Pentru acces neautorizat se returnează 401.
- Pentru acces fără rol admin se returnează 403.
- Pentru input invalid se returnează 400.
- Pentru email duplicat se returnează 409.
- Pentru agent inexistent se returnează 404.
- Pentru erori de server se returnează 500 cu mesaj generic.

## 13. Criterii de Acceptare

- [ ] Există pagina `/admin/agents`.
- [ ] Pagina afișează lista agenților.
- [ ] Adminul poate crea agent cu nume, email, telefon și parolă.
- [ ] Parola agentului este salvată ca hash bcrypt.
- [ ] Adminul poate actualiza numele și telefonul agentului.
- [ ] Adminul poate dezactiva un agent.
- [ ] Adminul poate reactiva un agent.
- [ ] Endpoint-urile sunt protejate pentru rolul `admin`.
- [ ] Agenții nu pot accesa endpoint-urile de management agenți.
- [ ] Utilizatorii publici nu pot accesa endpoint-urile de management agenți.
- [ ] API-ul nu returnează `password_hash`.
- [ ] Răspunsurile API respectă formatul standard.
- [ ] Validarea este manuală, fără Zod.
- [ ] SQL-ul folosește query-uri parametrizate.
- [ ] Migrația SQL pentru câmpurile noi există în `db/migrations`.
- [ ] Interfața folosește Bootstrap.

## 14. Îmbunătățiri Viitoare

- Resetarea parolei agentului din admin panel.
- Căutare și paginare pentru lista de agenți.
- Audit log pentru activare/dezactivare.
- Confirmare modală înainte de dezactivare.
- Asocierea agenților cu proprietăți după implementarea modulului de proprietăți.
