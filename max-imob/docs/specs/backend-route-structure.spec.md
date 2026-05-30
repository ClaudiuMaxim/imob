# Specificație Structură Rute Backend

## 1. Informații Generale

- Nume funcționalitate: Structură standard pentru rute backend
- Tip funcționalitate: Backend
- Versiune: 1.0.0
- Autor: Claudiu Ștefan

## 2. Descrierea Problemei

Rutele backend pot deveni greu de urmărit dacă logica handlerelor este scrisă direct în exporturile HTTP. Pentru o aplicație de licență, codul trebuie să fie ușor de citit, explicat și întreținut.

Este necesară o structură standard în care, în partea de sus a fiecărui fișier de rută backend, să fie vizibil ce metodă HTTP este expusă și ce funcție se ocupă de acea metodă.

## 3. Obiective

Obiective principale:
- Definirea unei convenții clare pentru fișierele `route.ts`.
- Afișarea în partea de sus a fișierului a metodelor HTTP disponibile.
- Separarea exporturilor Next.js de funcțiile handler reale.
- Păstrarea logicii de business în servicii, nu în rută.

Obiective secundare:
- Creșterea lizibilității codului backend.
- Păstrarea unei structuri simple, fără framework suplimentar.
- Aplicarea convenției pe ruta existentă `POST /api/auth/login`.

## 4. Cerințe Funcționale

- Fiecare fișier backend `route.ts` trebuie să declare sus funcțiile handler folosite de metodele HTTP.
- Exporturile Next.js (`GET`, `POST`, `PUT`, `DELETE`) trebuie să fie simple alias-uri către handler-ele definite.
- Handler-ele trebuie să aibă nume clare, de exemplu `handleLogin`.
- Rutele trebuie să păstreze răspunsul JSON standard al proiectului.
- Logica de business trebuie să rămână în servicii.
- Validarea inputului trebuie să rămână în funcții separate.
- Funcțiile helper pentru răspunsuri, precum `unauthorized`, pot rămâne în același fișier dacă sunt mici și specifice rutei.

Exemplu de structură dorită:

```ts
const routes = {
  POST: handleLogin,
};

export const POST = routes.POST;

async function handleLogin(request: Request) {
  // validare, apel service, răspuns JSON
}
```

Reguli de business:
- Convenția nu schimbă comportamentul rutelor.
- Convenția nu adaugă endpoint-uri noi.
- Convenția nu modifică autentificarea, autorizarea sau baza de date.

## 5. Cerințe Non-Funcționale

Cerințe de performanță:
- Structura nouă nu trebuie să introducă operații suplimentare la runtime.
- Alias-ul metodei HTTP trebuie să apeleze direct handlerul.

Cerințe de securitate:
- Rutele trebuie să păstreze validarea existentă.
- Rutele trebuie să păstreze mesajele generice pentru erori sensibile.
- Rutele nu trebuie să expună detalii interne despre servicii sau baza de date.

Cerințe de utilizabilitate pentru dezvoltatori:
- Un dezvoltator trebuie să poată vedea rapid metodele HTTP disponibile într-un fișier.
- Numele handlerelor trebuie să descrie acțiunea executată.
- Structura trebuie să fie consistentă între rute.

Considerente de mentenanță:
- Codul trebuie să rămână simplu.
- Nu se introduce router custom peste App Router.
- Nu se adaugă biblioteci noi.
- Funcțiile trebuie să rămână mici și ușor de testat.

## 6. Povești de Utilizator

- Ca dezvoltator, vreau să văd rapid ce metode HTTP sunt definite într-un fișier de rută.
- Ca dezvoltator, vreau ca fiecare metodă HTTP să aibă un handler cu nume clar.
- Ca evaluator al lucrării de licență, vreau ca structura backend să fie ușor de explicat.
- Ca administrator sau agent, nu vreau ca refactorizarea structurii să schimbe comportamentul login-ului.

## 7. Designul Sistemului

### Design Backend

Endpoint-uri afectate:
- `POST /api/auth/login`

Structură propusă pentru `app/api/auth/login/route.ts`:
- Importuri.
- Constante locale, de exemplu `cookieName`.
- Obiect `routes`, unde se asociază metoda HTTP cu handlerul.
- Export Next.js pentru metoda HTTP.
- Funcția handler principală.
- Funcții helper pentru răspunsuri.

Exemplu:

```ts
const routes = {
  POST: handleLogin,
};

export const POST = routes.POST;
```

Controllere:
- Nu se creează controller separat în această etapă.
- Handlerul din `route.ts` joacă rolul de controller al endpoint-ului.
- Handlerul nu trebuie să conțină logică de business.

Servicii:
- `authService` rămâne responsabil pentru autentificare.
- Serviciile existente nu trebuie să își schimbe comportamentul.

### Design Frontend

Nu sunt necesare modificări frontend.

Pagini afectate:
- Nicio pagină frontend.

Componente utilizate:
- Nicio componentă nouă.

State handling:
- Nicio schimbare de state.

## 8. Designul Bazei de Date

Nu sunt necesare modificări ale bazei de date.

Tabele:
- Nu se adaugă tabele.

Câmpuri:
- Nu se adaugă câmpuri.

Relații:
- Nu se adaugă relații.

Constrângeri:
- Nu se adaugă constrângeri.

## 9. Flux de Date

1. Frontend-ul trimite request către `POST /api/auth/login`.
2. Next.js apelează exportul `POST`.
3. Exportul `POST` indică către handlerul definit în obiectul `routes`.
4. Handlerul execută validarea inputului.
5. Handlerul apelează serviciul de autentificare.
6. Handlerul construiește răspunsul JSON standard.
7. Comportamentul extern rămâne identic cu implementarea actuală.

## 10. Reguli de Validare

Reguli de validare pentru input:
- Nu se modifică regulile de validare ale login-ului.
- Validarea manuală existentă rămâne în funcția dedicată.

Constrângeri de logică business:
- Refactorizarea structurii rutei nu trebuie să modifice autentificarea.
- Refactorizarea nu trebuie să schimbe formatul răspunsurilor API.
- Refactorizarea nu trebuie să adauge metode HTTP necerute.

## 11. Considerente de Securitate

Reguli de autentificare:
- Login-ul trebuie să păstreze verificarea parolei cu bcrypt.
- JWT-ul trebuie să fie generat doar după autentificare reușită.
- Cookie-ul HTTP-only trebuie păstrat.

Reguli de autorizare:
- Nu se modifică regulile de autorizare.

Protecția datelor:
- Nu se expun date suplimentare.
- Nu se modifică mesajele generice pentru credențiale invalide.

## 12. Cazuri Limită

- Handlerul nu este exportat corect prin metoda HTTP.
- Obiectul `routes` indică spre o funcție inexistentă.
- O metodă HTTP este adăugată în obiectul `routes`, dar nu este exportată.
- Refactorizarea schimbă accidental status code-ul răspunsului.
- Refactorizarea schimbă accidental numele cookie-ului.

Strategii de tratare:
- Verificare prin lint.
- Verificare prin build.
- Compararea răspunsurilor înainte și după refactorizare.

## 13. Criterii de Acceptare

- [ ] `app/api/auth/login/route.ts` are un obiect `routes` în partea de sus.
- [ ] Metoda `POST` este asociată cu funcția `handleLogin`.
- [ ] Exportul `POST` este un alias către `routes.POST`.
- [ ] Handlerul `handleLogin` păstrează comportamentul actual.
- [ ] Răspunsurile API păstrează formatul standard.
- [ ] Cookie-ul HTTP-only păstrează aceleași setări.
- [ ] Nu se adaugă endpoint-uri noi.
- [ ] Nu se modifică frontend-ul.
- [ ] `npm run lint` trece.
- [ ] `npm run build` trece.

## 14. Îmbunătățiri Viitoare

- Aplicarea aceleiași convenții pentru toate endpoint-urile viitoare.
- Mutarea helperelor comune de răspuns într-un fișier partajat.
- Adăugarea unui tip TypeScript comun pentru răspunsul API standard.
- Adăugarea testelor pentru handler-ele backend.
