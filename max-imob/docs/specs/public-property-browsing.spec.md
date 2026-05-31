# Specificatie Listare Publica Proprietati

## 1. Informatii Generale

- Nume functionalitate: Listare publica si detalii proprietati
- Tip functionalitate: Full-stack
- Versiune: 1.0.0
- Autor: Claudiu Stefan

## 2. Descrierea Problemei

Utilizatorii publici trebuie sa poata vedea proprietatile publicate de agenti fara autentificare. Platforma are deja zona de administrare pentru agenti, dar proprietatile trebuie expuse si in partea publica a aplicatiei pentru a simula fluxul principal al unui marketplace imobiliar.

Functionalitatea este necesara pentru ca vizitatorii sa poata cauta proprietati, sa filtreze rezultatele dupa criterii simple si sa vada pagina de detalii pentru o proprietate aleasa.

## 3. Obiective

Obiective principale:
- Crearea paginii publice `/properties`.
- Afisarea doar a proprietatilor active si publicate.
- Filtrarea proprietatilor dupa oras, tip si numar de camere.
- Redirectionarea utilizatorului catre pagina de detalii la dublu click pe proprietate.
- Crearea paginii publice `/properties/[id]`.
- Afisarea tuturor detaliilor si pozelor pentru proprietatea selectata.

Obiective secundare:
- Refolosirea endpoint-urilor existente pentru proprietati.
- Pastrarea UI-ului simplu si responsive cu Bootstrap.
- Pastrarea codului impartit in componente mici.
- Pregatirea structurii pentru filtre viitoare.

## 4. Cerinte Functionale

- Sistemul trebuie sa ofere pagina `/properties`.
- Pagina `/properties` trebuie sa fie publica si sa nu ceara login.
- Pagina trebuie sa afiseze doar proprietati cu `status = publicata` si `is_active = true`.
- Fiecare proprietate din lista trebuie sa afiseze cel putin:
  - poza principala;
  - titlu;
  - oras;
  - pret;
  - tip proprietate;
  - numar dormitoare;
  - numar bai;
  - suprafata.
- Utilizatorul trebuie sa poata filtra dupa oras.
- Utilizatorul trebuie sa poata filtra dupa tip proprietate.
- Utilizatorul trebuie sa poata filtra dupa numar de camere/dormitoare.
- Filtrele trebuie sa poata fi resetate.
- La dublu click pe o proprietate, utilizatorul trebuie redirectionat catre `/properties/[id]`.
- Pagina `/properties/[id]` trebuie sa fie publica.
- Pagina de detalii trebuie sa afiseze:
  - toate pozele proprietatii;
  - titlu;
  - descriere;
  - pret;
  - oras;
  - adresa;
  - tip proprietate;
  - status;
  - dormitoare;
  - bai;
  - suprafata.
- Daca proprietatea nu exista sau nu este publica, sistemul trebuie sa afiseze pagina 404 sau un mesaj clar.

Reguli de business:
- Utilizatorii publici nu au conturi si nu se autentifica.
- Publicul poate doar vizualiza proprietati.
- Publicul nu poate crea, edita, activa sau dezactiva proprietati.
- Proprietatile inactive nu apar in zona publica.
- Proprietatile cu status diferit de `publicata` nu apar in zona publica.
- Prima poza este poza principala in lista.

## 5. Cerinte Non-Functionale

Cerinte de performanta:
- Filtrarea trebuie facuta in backend prin query SQL, nu doar in browser.
- Query-urile trebuie sa foloseasca parametri SQL.
- Lista publica nu are nevoie de paginare in aceasta versiune.
- Structura trebuie sa permita adaugarea paginarii ulterior.

Cerinte de securitate:
- Endpoint-urile publice nu trebuie sa expuna proprietati inactive sau nepublicate.
- Query-urile SQL trebuie parametrizate.
- Erorile interne nu trebuie afisate utilizatorului.
- Datele private ale agentului nu trebuie expuse inutil.

Cerinte de utilizabilitate:
- Pagina trebuie sa fie mobile-first.
- Filtrele trebuie sa fie usor de folosit.
- Lista trebuie sa fie scanabila si clara.
- Dublu click-ul trebuie sa deschida detaliile proprietatii.
- Cardurile de proprietate trebuie sa fie suficient de clare pentru comparare.

Considerente de mentenanta:
- Componentele UI trebuie sa fie mici si usor de citit.
- Logica de request trebuie separata de componentele vizuale.
- Validarea filtrelor trebuie facuta manual.
- Codul trebuie sa ramana simplu, potrivit pentru prezentare in licenta.

## 6. Povesti de Utilizator

- Ca utilizator public, vreau sa vad lista proprietatilor disponibile pentru a compara ofertele.
- Ca utilizator public, vreau sa filtrez dupa oras pentru a vedea doar proprietatile din zona dorita.
- Ca utilizator public, vreau sa filtrez dupa tip pentru a vedea doar apartamente, case, terenuri sau spatii comerciale.
- Ca utilizator public, vreau sa filtrez dupa numarul de camere pentru a gasi proprietati potrivite.
- Ca utilizator public, vreau sa deschid detaliile unei proprietati pentru a vedea informatii complete.
- Ca agent, vreau ca proprietatile mele publicate sa fie vizibile pentru public.
- Ca admin, vreau ca zona publica sa afiseze doar proprietati valide si active.

## 7. Designul Sistemului

### Design Backend

Endpoint-uri existente folosite:

- `GET /api/properties`
  - Returneaza lista publica atunci cand request-ul nu este autentificat ca agent.
  - Accepta filtre prin query params:
    - `city`
    - `propertyType`
    - `bedrooms`

- `GET /api/properties/[id]`
  - Returneaza detaliile unei proprietati publice.
  - Proprietatea trebuie sa fie `publicata` si activa.

Servicii:
- `listPublicProperties(filters)`
  - Listeaza proprietatile publice.
  - Aplica filtrele primite.
- `getPublicPropertyById(propertyId)`
  - Returneaza o proprietate publica dupa `id`.

Validare manuala:
- `validatePublicPropertyFilters`
  - Valideaza orasul.
  - Valideaza tipul proprietatii.
  - Valideaza numarul de camere.

Structura route handlers:
- Fisierele `route.ts` pastreaza obiectul `routes` in partea de sus.
- Logica SQL ramane in service, nu in route handler.

### Design Frontend

Pagini:
- `app/properties/page.tsx`
- `app/properties/[id]/page.tsx`

Componente pentru lista:
- `PropertiesPage`
- `PropertyFilters`
- `PropertyCard`
- `PropertyGrid`
- `PropertiesEmptyState`

Componente pentru detalii:
- `PropertyDetailsPage`
- `PropertyGallery`
- `PropertyDetailsInfo`

State handling:
- Fiecare filtru are state separat:
  - `city`
  - `propertyType`
  - `bedrooms`
- Lista de proprietati are state separat.
- Starile `isLoading`, `error` si `message` sunt separate.

Navigare:
- La dublu click pe card se foloseste router-ul Next.js pentru redirect catre `/properties/[id]`.

## 8. Designul Bazei de Date

Nu este necesara o tabela noua pentru aceasta functionalitate.

Tabele folosite:
- `properties`
- `property_images`

Campuri folosite pentru filtrare:
- `properties.city`
- `properties.property_type`
- `properties.bedrooms`
- `properties.status`
- `properties.is_active`

Relatii:
- O proprietate are mai multe poze prin `property_images.property_id`.
- Prima poza, dupa `sort_order`, este poza principala.

Constrangeri:
- Doar proprietatile cu `status = publicata` sunt afisate public.
- Doar proprietatile cu `is_active = true` sunt afisate public.

## 9. Flux de Date

Flux lista publica:
1. Utilizatorul acceseaza `/properties`.
2. Frontend-ul incarca lista prin `GET /api/properties`.
3. Backend-ul citeste query params pentru filtre.
4. Backend-ul valideaza filtrele manual.
5. Backend-ul selecteaza doar proprietatile publicate si active.
6. Backend-ul include pozele fiecarei proprietati.
7. Frontend-ul afiseaza proprietatile in carduri.
8. Utilizatorul schimba filtrele.
9. Frontend-ul reapeleaza endpoint-ul cu query params.
10. Lista se actualizeaza.

Flux detalii:
1. Utilizatorul da dublu click pe o proprietate.
2. Frontend-ul redirectioneaza catre `/properties/[id]`.
3. Pagina cere `GET /api/properties/[id]`.
4. Backend-ul verifica daca proprietatea este publica.
5. Backend-ul returneaza detaliile si pozele.
6. Frontend-ul afiseaza pagina de detalii.

## 10. Reguli de Validare

Reguli pentru filtre:
- `city` este optional.
- Daca `city` este prezent, trebuie sa aiba maximum 100 de caractere.
- `propertyType` este optional.
- Daca `propertyType` este prezent, trebuie sa fie una dintre:
  - `apartament`
  - `casa`
  - `teren`
  - `comercial`
- `bedrooms` este optional.
- Daca `bedrooms` este prezent, trebuie sa fie numar intreg >= 0.

Reguli pentru detalii:
- `id` trebuie sa existe.
- Proprietatea trebuie sa fie activa.
- Proprietatea trebuie sa fie publicata.

## 11. Considerente de Securitate

- Lista publica nu necesita autentificare.
- Endpoint-ul public nu returneaza proprietati inactive.
- Endpoint-ul public nu returneaza proprietati in ciorna, vandute sau inchiriate.
- SQL-ul trebuie sa fie parametrizat.
- Erorile interne se logheaza in server si se returneaza mesaj generic.
- Nu se expun informatii private despre agent, parola sau sesiuni.

## 12. Cazuri Limita

- Nu exista proprietati publicate.
- Filtrele nu returneaza niciun rezultat.
- Orasul cautat nu exista.
- Tipul proprietatii este invalid.
- Numarul de camere este invalid.
- Proprietatea a fost dezactivata intre listare si deschiderea detaliilor.
- Proprietatea este stearsa logic.
- Proprietatea nu are poze din cauza unor date vechi.
- Serverul nu poate citi baza de date.

Strategii de tratare:
- Lista goala afiseaza mesaj clar.
- Filtrele invalide returneaza eroare 400.
- Proprietatea inexistenta sau nepublica returneaza 404.
- Erorile de server returneaza 500 cu mesaj generic.

## 13. Criterii de Acceptare

- [ ] Exista pagina `/properties`.
- [ ] Pagina `/properties` este publica.
- [ ] Lista afiseaza doar proprietati active si publicate.
- [ ] Lista afiseaza poza principala pentru fiecare proprietate.
- [ ] Utilizatorul poate filtra dupa oras.
- [ ] Utilizatorul poate filtra dupa tip proprietate.
- [ ] Utilizatorul poate filtra dupa numar de camere.
- [ ] Utilizatorul poate reseta filtrele.
- [ ] La dublu click pe proprietate, utilizatorul ajunge la `/properties/[id]`.
- [ ] Exista pagina `/properties/[id]`.
- [ ] Pagina de detalii afiseaza toate pozele proprietatii.
- [ ] Pagina de detalii afiseaza toate informatiile importante.
- [ ] Proprietatile inactive nu sunt vizibile public.
- [ ] Proprietatile nepublicate nu sunt vizibile public.
- [ ] API-ul foloseste query-uri SQL parametrizate.
- [ ] Validarea filtrelor este manuala, fara Zod.
- [ ] UI-ul foloseste Bootstrap.
- [ ] Componentele mari sunt impartite in componente mici.

## 14. Imbunatatiri Viitoare

- Paginare pentru lista publica.
- Filtrare dupa pret minim si pret maxim.
- Filtrare dupa suprafata.
- Sortare dupa pret sau data publicarii.
- Harta cu proprietati.
- Formular public de contact pe pagina de detalii.
- Afisarea datelor agentului pe pagina de detalii.
- Favorite pentru proprietati.
