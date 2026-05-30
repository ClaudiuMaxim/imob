# Specificație Pagină Principală Statică

## 1. Informații Generale

- Nume funcționalitate: Pagină principală statică
- Tip funcționalitate: Frontend
- Versiune: 1.0.0
- Autor: Claudiu Ștefan

## 2. Descrierea Problemei

În prezent, proiectul afișează pagina implicită generată de Next.js, care nu reprezintă platforma imobiliară și nu direcționează utilizatorii către fluxul principal de navigare publică.

Sistemul are nevoie de o pagină principală statică inițială care să comunice scopul platformei, să prezinte posibilitatea de explorare publică a proprietăților și să ofere navigare clară către listările imobiliare și zona de autentificare, fără integrare backend în această etapă.

## 3. Obiective

Obiective principale:
- Înlocuirea paginii implicite Next.js cu o pagină principală potrivită pentru o platformă imobiliară.
- Prezentarea platformei ca marketplace public pentru proprietăți.
- Oferirea unor puncte clare de acces pentru vizualizarea proprietăților și autentificare.
- Păstrarea paginii ca implementare statică pentru etapa curentă de dezvoltare.

Obiective secundare:
- Stabilirea unei direcții vizuale simple pentru paginile publice viitoare.
- Menținerea compatibilității cu Next.js App Router.
- Utilizarea claselor Bootstrap fără adăugarea unor biblioteci UI suplimentare.

## 4. Cerințe Funcționale

- Pagina principală trebuie să fie disponibilă la ruta `/`.
- Pagina trebuie să fie accesibilă fără autentificare.
- Pagina trebuie să fie implementată ca pagină frontend statică.
- Pagina trebuie să includă un antet cu numele platformei și linkuri de navigare.
- Pagina trebuie să includă o secțiune principală care descrie marketplace-ul imobiliar.
- Pagina trebuie să includă un buton principal către `/properties`.
- Pagina trebuie să includă un buton secundar către `/login`.
- Pagina trebuie să includă o selecție scurtă de beneficii statice.
- Pagina trebuie să includă o secțiune statică ce explică pe scurt rolurile: utilizator public, agent și administrator.
- Linkurile de navigare pot indica rute planificate, chiar dacă acestea nu sunt încă implementate.
- Pentru această versiune nu trebuie preluate date din API.
- Pentru această versiune nu trebuie adăugată logică de autentificare.

Reguli de business:
- Utilizatorilor publici nu trebuie să li se prezinte crearea unui cont sau autentificarea ca cerință.
- Autentificarea trebuie prezentată doar pentru administratori și agenți.
- Vizualizarea proprietăților trebuie să fie acțiunea publică principală.

## 5. Cerințe Non-Funcționale

Cerințe de performanță:
- Pagina trebuie să se redea rapid ca server component.
- Pagina nu trebuie să introducă JavaScript client-side dacă nu este necesar.
- Prima versiune statică nu trebuie să depindă de imagini sau resurse grele.

Cerințe de securitate:
- Nu trebuie afișate date sensibile.
- Nu trebuie adăugată gestionare pentru tokenuri de autentificare.
- Linkurile către zone protejate nu trebuie să expună date protejate.

Cerințe de utilizabilitate:
- Layout-ul trebuie să fie mobile-first.
- Acțiunile principale trebuie să fie ușor de identificat.
- Textul trebuie să fie concis și ușor de explicat în cadrul prezentării lucrării de licență.
- Pagina trebuie să diferențieze vizual navigarea publică de autentificarea personalului.

Considerente de mentenanță:
- Implementarea trebuie să rămână în structura existentă App Router.
- Pagina trebuie să folosească HTML semantic și clase Bootstrap.
- Componenta trebuie să rămână simplă și ușor de citit.
- Nu trebuie introdusă abstractizare inutilă.

## 6. Povești de Utilizator

- Ca utilizator public, vreau să înțeleg că pot vizualiza proprietăți fără să îmi creez cont.
- Ca utilizator public, vreau un buton clar care să mă ducă la lista de proprietăți.
- Ca agent, vreau să știu unde mă pot autentifica pentru a administra proprietăți și lead-uri.
- Ca administrator, vreau să știu unde mă pot autentifica pentru a administra agenți.
- Ca evaluator al lucrării de licență, vreau ca pagina principală să comunice clar scopul sistemului și rolurile existente.

## 7. Designul Sistemului

### Design Backend

Nu sunt necesare modificări backend pentru această versiune.

Endpoint-uri API:
- Nu se adaugă endpoint-uri noi.
- Nu se consumă endpoint-uri existente.

Controllere:
- Nu se adaugă și nu se modifică controllere.

Servicii:
- Nu se adaugă și nu se modifică servicii.

### Design Frontend

Pagini afectate:
- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`

Componente utilizate:
- Pentru prima versiune statică nu sunt necesare componente partajate noi.
- Pagina principală poate fi implementată direct în `app/page.tsx`.
- Bootstrap CSS va fi importat global din `app/layout.tsx`.

Gestionarea stării:
- Nu este necesară stare React.
- Nu este necesară o componentă client.
- Pagina trebuie să rămână server component implicit.

Secțiuni planificate:
- Antet cu brand și navigare.
- Secțiune principală cu titlu, text de susținere și acțiuni principale.
- Secțiune statică de beneficii pentru navigare publică, administrare de proprietăți și control administrativ.
- Secțiune de prezentare a rolurilor: utilizator public, agent și administrator.
- Footer cu identitatea proiectului/platformei.

## 8. Designul Bazei de Date

Nu sunt necesare modificări ale bazei de date pentru această versiune.

Tabele:
- Nu se adaugă tabele noi.

Câmpuri:
- Nu se adaugă câmpuri noi.

Relații:
- Nu se adaugă relații noi.

Constrângeri:
- Nu se adaugă constrângeri noi.

## 9. Flux de Date

1. Un vizitator public accesează ruta `/`.
2. Next.js randează pagina principală statică din `app/page.tsx`.
3. Vizitatorul citește introducerea platformei și informațiile despre roluri.
4. Vizitatorul poate apăsa „Vezi proprietăți” pentru a naviga către `/properties`.
5. Un administrator sau agent poate apăsa „Autentificare” pentru a naviga către `/login`.
6. Nu se realizează cereri API sau interogări către baza de date în timpul randării paginii principale.

## 10. Reguli de Validare

Reguli de validare pentru input:
- Pagina principală nu colectează input de la utilizator.

Constrângeri de logică business:
- Navigarea publică trebuie prezentată ca disponibilă fără autentificare.
- Autentificarea trebuie prezentată doar pentru administratori și agenți.
- Pagina principală nu trebuie să sugereze că utilizatorii publici au conturi.

## 11. Considerente de Securitate

Reguli de autentificare:
- Pagina principală nu necesită autentificare.
- Nu este necesară validarea JWT pentru această rută.

Reguli de autorizare:
- Pe pagina principală nu sunt disponibile acțiuni protejate.
- Linkurile către funcționalități de administrator sau agent trebuie să treacă prin fluxul de autentificare atunci când acele pagini vor fi implementate.

Protecția datelor:
- Nu se afișează date private despre utilizatori, agenți, lead-uri sau proprietăți.
- Conținutul static demonstrativ nu trebuie să includă date personale reale.

## 12. Cazuri Limită

- Dacă `/properties` nu este încă implementată, linkul de pe pagina principală poate duce către o rută viitoare sau către o pagină 404 până la implementarea funcționalității.
- Dacă `/login` nu este încă implementată, linkul de autentificare poate duce către o rută viitoare sau către o pagină 404 până la implementarea autentificării.
- Pe ecrane mici, navigarea și butoanele de acțiune trebuie să se așeze corect fără suprapuneri de text.
- Pagina trebuie să rămână utilizabilă cu zoom-ul implicit al browserului.

## 13. Criterii de Acceptare

- [ ] Conținutul implicit Next.js este eliminat de pe ruta `/`.
- [ ] Pagina principală prezintă clar scopul platformei imobiliare.
- [ ] Pagina principală menționează că utilizatorii publici pot vizualiza proprietăți fără autentificare.
- [ ] Pagina principală include un link principal către `/properties`.
- [ ] Pagina principală include un link de autentificare pentru administratori și agenți.
- [ ] Pagina principală include beneficii statice.
- [ ] Pagina principală include o prezentare simplă a rolurilor: utilizator public, agent și administrator.
- [ ] Pagina este responsive folosind Bootstrap.
- [ ] Pagina rămâne server component, fără stare client-side inutilă.
- [ ] Nu sunt introduse modificări backend, de bază de date sau de autentificare.

## 14. Îmbunătățiri Viitoare

- Afișarea proprietăților recomandate reale din backend.
- Adăugarea controalelor de căutare și filtrare după existența API-ului pentru proprietăți.
- Adăugarea navigării adaptate la rute după implementarea paginilor publice, de administrator și de agent.
- Adăugarea imaginilor optimizate pentru proprietăți prin `next/image`.
- Extinderea conținutului în funcție de cerințele finale ale prezentării lucrării de licență.
