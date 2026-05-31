# Specificație CRUD Proprietăți Agent

## 1. Informații Generale

- Nume funcționalitate: Administrare proprietăți de către agent
- Tip funcționalitate: Full-stack
- Versiune: 1.0.0
- Autor: Claudiu Ștefan

## 2. Descrierea Problemei

Agenții imobiliari trebuie să își poată administra propriile proprietăți în platformă. Fără această funcționalitate, platforma nu poate simula fluxul principal al unui marketplace imobiliar: agentul publică proprietăți, iar utilizatorii publici le pot vizualiza.

Sistemul trebuie să permită operații CRUD simple pentru proprietăți, cu reguli clare de ownership: fiecare proprietate aparține unui singur agent, iar un agent poate modifica doar propriile proprietăți.

## 3. Obiective

Obiective principale:
- Crearea unei zone `/agent/properties` pentru administrarea proprietăților.
- Permiterea creării unei proprietăți de către agent.
- Permiterea listării proprietăților proprii.
- Permiterea editării proprietăților proprii.
- Permiterea ștergerii/dezactivării proprietăților proprii.
- Permiterea actualizării statusului proprietății.
- Permiterea încărcării mai multor poze pentru o proprietate.

Obiective secundare:
- Pregătirea proprietăților pentru vizualizarea publică.
- Păstrarea logicii de business în servicii.
- Folosirea PostgreSQL direct prin `pg`.
- Folosirea validării manuale, fără Zod.
- Păstrarea UI-ului simplu, Bootstrap, cu componente mici.

## 4. Cerințe Funcționale

- Sistemul trebuie să ofere pagina `/agent/properties`.
- Pagina trebuie să afișeze doar proprietățile agentului autentificat.
- Agentul trebuie să poată crea o proprietate.
- Agentul trebuie să poată încărca una sau mai multe poze la crearea unei proprietăți.
- Agentul trebuie să poată edita o proprietate proprie.
- Agentul trebuie să poată actualiza pozele unei proprietăți proprii.
- Agentul trebuie să poată dezactiva sau șterge logic o proprietate proprie.
- Agentul trebuie să poată schimba statusul unei proprietăți.
- Agentul nu trebuie să poată accesa sau modifica proprietățile altui agent.
- Proprietățile active/publicate trebuie să fie pregătite pentru afișarea publică.
- API-ul trebuie să respecte formatul standard al proiectului.

Reguli de business:
- Fiecare proprietate aparține unui singur agent.
- Doar agentul proprietar poate modifica proprietatea.
- Adminul nu gestionează proprietăți.
- Utilizatorii publici nu pot crea, edita sau șterge proprietăți.
- Ștergerea în această versiune va fi logică, prin `is_active = false`.
- Statusurile disponibile sunt `ciorna`, `publicata`, `vanduta`, `inchiriata`.
- Doar proprietățile `publicata` și active vor fi vizibile public.
- O proprietate trebuie să aibă cel puțin o poză.
- Prima poză din listă este considerată poza principală.
- Pozele sunt încărcate ca fișiere și salvate local în aplicație.
- Nu există limită de număr de imagini per proprietate în această versiune.

## 5. Cerințe Non-Funcționale

Cerințe de performanță:
- Listarea proprietăților agentului trebuie să folosească interogări SQL filtrate după `agent_id`.
- Endpoint-urile trebuie să returneze doar câmpurile necesare.
- Pentru această versiune nu este necesară paginare, dar structura trebuie să permită adăugarea ei ulterior.

Cerințe de securitate:
- Endpoint-urile agent trebuie protejate prin JWT.
- Doar rolul `agent` poate folosi CRUD-ul de proprietăți.
- Interogările SQL trebuie parametrizate.
- Inputul trebuie validat manual înainte de operațiile SQL.
- Erorile interne nu trebuie expuse către frontend.

Cerințe de utilizabilitate:
- Formularul de proprietate trebuie să fie clar și responsive.
- Fiecare câmp de formular trebuie să aibă state separat.
- Fișierele UI mari trebuie împărțite în componente mici.
- Lista proprietăților trebuie să afișeze clar statusul.

Considerente de mentenanță:
- Handler-ele API trebuie să aibă obiect `routes` sus.
- Serviciile trebuie să conțină logica SQL și regulile de ownership.
- Validarea trebuie separată în funcții dedicate.
- Codul trebuie să respecte TypeScript strict și să evite `any`.

## 6. Povești de Utilizator

- Ca agent, vreau să creez proprietăți pentru a le publica în platformă.
- Ca agent, vreau să văd doar proprietățile mele.
- Ca agent, vreau să editez detaliile unei proprietăți proprii.
- Ca agent, vreau să schimb statusul unei proprietăți.
- Ca agent, vreau să dezactivez o proprietate care nu mai trebuie afișată.
- Ca utilizator public, vreau să văd doar proprietăți publicate și active.
- Ca administrator, nu vreau să gestionez proprietăți, deoarece acesta este rolul agentului.

## 7. Designul Sistemului

### Design Backend

Endpoint-uri agent:
- `GET /api/properties`
  - Dacă request-ul este autentificat ca agent, returnează proprietățile agentului curent.
  - Dacă request-ul este public, returnează proprietățile publicate și active.
  - Acceptă filtre publice viitoare precum `city`, `type`, `minPrice`, `maxPrice`.

- `POST /api/properties`
  - Creează o proprietate nouă pentru agentul autentificat.
  - Acces permis doar pentru `agent`.

- `GET /api/properties/[id]`
  - Pentru agent: returnează proprietatea dacă aparține agentului.
  - Pentru public: returnează proprietatea doar dacă este `publicata` și activă.

- `PUT /api/properties/[id]`
  - Actualizează proprietatea agentului autentificat.
  - Acces permis doar pentru agentul proprietar.

- `DELETE /api/properties/[id]`
  - Dezactivează logic proprietatea agentului autentificat.
  - Acces permis doar pentru agentul proprietar.

Structură route handlers:
- Fiecare `route.ts` va avea obiect `routes` în partea de sus.
- Exporturile HTTP vor fi alias-uri către handler-ele definite.

Exemplu:
```ts
const routes = {
  GET: handleGetProperties,
  POST: handleCreateProperty,
};

export const GET = routes.GET;
export const POST = routes.POST;
```

Servicii:
- `propertyService`
  - Listează proprietăți publice.
  - Listează proprietățile unui agent.
  - Creează proprietate.
  - Găsește proprietate după `id`.
  - Actualizează proprietate cu verificare ownership.
  - Dezactivează proprietate cu verificare ownership.

Validare manuală:
- `validateCreatePropertyInput`
- `validateUpdatePropertyInput`
- `validatePropertyStatus`
- `validatePropertyFilters`

Autentificare și autorizare:
- Helper-ul JWT existent va fi extins cu verificare pentru rolul `agent`.
- Endpoint-urile de modificare cer rol `agent`.
- Endpoint-urile publice nu cer autentificare.

### Design Frontend

Pagini afectate:
- `app/agent/properties/page.tsx`
- `app/properties/page.tsx` în viitor pentru listarea publică.
- `app/properties/[id]/page.tsx` în viitor pentru detalii publice.

Componente pentru agent:
- Container principal pentru orchestration.
- Formular creare proprietate.
- Formular editare proprietate.
- Tabel/listă proprietăți.
- Badge pentru status.
- Componentă reutilizabilă pentru inputuri.

State handling:
- Fiecare câmp al formularului are state separat.
- State pentru `properties`, `isLoading`, `isSaving`, `message`, `error`.
- State separat pentru proprietatea selectată la editare.

Câmpuri formular:
- `title`
- `description`
- `price`
- `city`
- `address`
- `propertyType`
- `status`
- `bedrooms`
- `bathrooms`
- `area`
- `images`

## 8. Designul Bazei de Date

Tabel nou: `properties`

Câmpuri:
- `id`: identificator unic.
- `agent_id`: referință către `users.id`.
- `title`: titlul proprietății.
- `description`: descrierea proprietății.
- `price`: prețul proprietății.
- `city`: orașul.
- `address`: adresa.
- `property_type`: tipul proprietății.
- `status`: statusul proprietății.
- `bedrooms`: număr de dormitoare.
- `bathrooms`: număr de băi.
- `area`: suprafața.
- `is_active`: indică dacă proprietatea este activă.
- `created_at`: data creării.
- `updated_at`: data ultimei actualizări.

Tabel nou: `property_images`

Câmpuri:
- `id`: identificator unic.
- `property_id`: referință către `properties.id`.
- `image_url`: calea publică a pozei salvate.
- `file_name`: numele fișierului salvat.
- `sort_order`: ordinea pozei în galerie.
- `created_at`: data creării.

Tipuri/valori:
- `property_type`: `apartament`, `casa`, `teren`, `comercial`.
- `status`: `ciorna`, `publicata`, `vanduta`, `inchiriata`.

Relații:
- `properties.agent_id` referă `users.id`.
- Un agent poate avea mai multe proprietăți.
- O proprietate aparține unui singur agent.
- `property_images.property_id` referă `properties.id`.
- O proprietate poate avea mai multe poze.
- Nu există limită de număr de poze asociate unei proprietăți.

Constrângeri:
- `agent_id` este obligatoriu.
- `title` este obligatoriu.
- `price` trebuie să fie mai mare sau egal cu 0.
- `status` are valoare implicită `ciorna`.
- `is_active` are valoare implicită `true`.
- `property_images.image_url` este obligatoriu.
- `property_images.file_name` este obligatoriu.
- `property_images.sort_order` este obligatoriu.

Migrație SQL:
- Se va adăuga `db/migrations/003_create_properties.sql`.
- Migrația va crea tipurile enum, tabela `properties` și tabela `property_images`.

## 9. Flux de Date

1. Agentul se autentifică.
2. Browserul primește cookie-ul HTTP-only cu JWT.
3. Agentul accesează `/agent/properties`.
4. Frontend-ul cere `GET /api/properties`.
5. Backend-ul identifică agentul din JWT.
6. Backend-ul citește proprietățile unde `agent_id = userId`.
7. Frontend-ul afișează lista proprietăților.
8. Agentul completează formularul de creare.
9. Frontend-ul trimite `POST /api/properties`.
10. Backend-ul validează inputul manual.
11. Backend-ul inserează proprietatea cu `agent_id` din sesiune.
12. Backend-ul inserează pozele în `property_images`.
13. Frontend-ul reîncarcă lista.
14. Agentul poate edita, actualiza pozele sau dezactiva proprietatea.

## 10. Reguli de Validare

Reguli pentru creare:
- `title` este obligatoriu și are între 3 și 150 de caractere.
- `description` este obligatoriu și are maximum 2000 de caractere.
- `price` este obligatoriu și trebuie să fie număr >= 0.
- `city` este obligatoriu și are între 2 și 100 de caractere.
- `address` este obligatoriu și are între 5 și 200 de caractere.
- `propertyType` trebuie să fie una dintre valorile permise.
- `status` trebuie să fie una dintre valorile permise.
- `bedrooms` trebuie să fie număr întreg >= 0.
- `bathrooms` trebuie să fie număr întreg >= 0.
- `area` trebuie să fie număr > 0.
- Cel puțin o poză este obligatorie la creare.
- Fiecare fișier încărcat trebuie să fie imagine.
- Tipurile acceptate sunt `image/jpeg`, `image/png` și `image/webp`.
- Nu există limită de număr de imagini.

Reguli pentru actualizare:
- Toate câmpurile sunt opționale.
- Dacă un câmp este prezent, trebuie să respecte aceleași reguli ca la creare.
- Dacă se trimit poze noi la actualizare, acestea se adaugă la galeria proprietății.
- Nu se poate modifica `agent_id`.
- Nu se poate modifica `created_at`.

Constrângeri de logică business:
- Agentul poate modifica doar proprietăți proprii.
- Adminul nu poate crea proprietăți.
- Publicul nu poate modifica proprietăți.
- Proprietățile inactive nu apar în lista publică.

## 11. Considerente de Securitate

Reguli de autentificare:
- Operațiile de creare, editare și dezactivare cer JWT valid.
- JWT-ul trebuie să conțină `userId` și `role`.

Reguli de autorizare:
- Doar rolul `agent` poate crea proprietăți.
- Doar agentul proprietar poate edita/dezactiva proprietatea.
- Adminul nu are acces la CRUD proprietăți.

Protecția datelor:
- Query-urile SQL sunt parametrizate.
- Erorile SQL nu sunt expuse către frontend.
- Datele publice afișează doar proprietăți active și publicate.
- Fișierele încărcate sunt validate înainte de salvare.
- Numele fișierelor salvate trebuie generate de server pentru a evita conflicte.
- Pozele sunt salvate în `public/uploads/properties`.

## 12. Cazuri Limită

- Agentul nu este autentificat.
- JWT-ul este invalid sau expirat.
- Utilizatorul autentificat este admin, nu agent.
- Agentul încearcă să editeze proprietatea altui agent.
- Proprietatea nu există.
- Proprietatea este inactivă.
- Inputul conține valori invalide.
- Prețul este negativ.
- Statusul este invalid.
- Nu este încărcată nicio poză la creare.
- Un fișier încărcat nu este imagine.
- Salvarea fișierului eșuează.
- Baza de date nu este disponibilă.

Strategii de tratare:
- Pentru neautentificat se returnează 401.
- Pentru rol greșit se returnează 403.
- Pentru input invalid se returnează 400.
- Pentru proprietate inexistentă se returnează 404.
- Pentru erori de server se returnează 500 cu mesaj generic.

## 13. Criterii de Acceptare

- [ ] Există migrația `003_create_properties.sql`.
- [ ] Există pagina `/agent/properties`.
- [ ] Agentul vede doar proprietățile proprii.
- [ ] Agentul poate crea proprietate.
- [ ] Agentul trebuie să adauge cel puțin o poză la creare.
- [ ] Agentul poate încărca mai multe poze fără limită de număr.
- [ ] Agentul poate edita proprietate proprie.
- [ ] Agentul poate actualiza pozele proprietății.
- [ ] Agentul poate dezactiva proprietate proprie.
- [ ] Agentul poate actualiza statusul proprietății.
- [ ] Adminul nu poate crea proprietăți.
- [ ] Publicul nu poate modifica proprietăți.
- [ ] API-ul folosește rute REST.
- [ ] Handler-ele API folosesc structura cu obiect `routes` sus.
- [ ] Validarea este manuală, fără Zod.
- [ ] SQL-ul folosește query-uri parametrizate.
- [ ] UI-ul folosește Bootstrap.
- [ ] Formularele folosesc state separat pentru fiecare câmp.
- [ ] Fișierele UI mari sunt împărțite în componente mici.

## 14. Îmbunătățiri Viitoare

- Ștergerea individuală a unei poze.
- Reordonarea pozelor în galerie.
- Căutare și filtrare publică avansată.
- Paginare pentru lista de proprietăți.
- Galerie foto pentru pagina de detalii.
- Confirmare modală înainte de dezactivare.
- Istoric al modificărilor de status.
- Integrarea lead-urilor create din formularul public de contact.
