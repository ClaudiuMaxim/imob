# Specificatie functionalitate: Tabela average_prices

## 1. Informatii generale

- Nume functionalitate: Calcularea pretului mediu pe metru patrat
- Tip functionalitate: backend / baza de date
- Versiune: 1.0
- Autor: Claudiu Ștefan

## 2. Descrierea problemei

Aplicatia Max Imob stocheaza proprietati cu pret, suprafata, oras, tip de proprietate si tip de oferta. In prezent, sistemul nu pastreaza o valoare agregata care sa indice pretul mediu pe metru patrat pentru proprietatile finalizate. Aceasta informatie poate fi utila pentru analiza pietei, pentru compararea proprietatilor si pentru dezvoltarea ulterioara a unor recomandari simple.

Functionalitatea propusa introduce tabela `average_prices`, care va pastra pretul mediu pe metru patrat pentru fiecare combinatie de tip de proprietate, oras si tip de oferta. Valoarea se va recalcula automat in PostgreSQL, printr-o functie si un trigger executat la crearea sau actualizarea unei proprietati.

## 3. Obiective

Obiective principale:

- Crearea tabelei `average_prices`.
- Calcularea pretului mediu pe metru patrat folosind formula `price / area`.
- Gruparea rezultatelor dupa tipul proprietatii, oras si tipul ofertei.
- Recalcularea valorilor dupa inserarea sau actualizarea unei proprietati, prin trigger PostgreSQL.

Obiective secundare:

- Pastrarea implementarii simple si usor de explicat.
- Evitarea duplicarii logicii SQL in mai multe locuri.
- Pregatirea datelor pentru eventuale afisari statistice viitoare.

## 4. Cerinte functionale

- Sistemul trebuie sa creeze tabela `average_prices`.
- Fiecare rand din `average_prices` trebuie sa reprezinte o combinatie unica:
  - `type`;
  - `city_id`;
  - `offer_type`.
- Coloana `price` din `average_prices` trebuie sa reprezinte pretul mediu pe metru patrat.
- Calculul trebuie sa foloseasca proprietatile finalizate:
  - pentru `offer_type = 'vanzare'`, proprietatile cu `status = 'vanduta'`;
  - pentru `offer_type = 'inchiriere'`, proprietatile cu `status = 'inchiriata'`.
- Proprietatile inactive nu trebuie incluse in calcul.
- La crearea unei proprietati, baza de date trebuie sa recalculeze valorile din `average_prices` prin trigger.
- La actualizarea unei proprietati, baza de date trebuie sa recalculeze valorile din `average_prices` prin trigger.
- Daca o combinatie nu mai are proprietati eligibile, randul corespunzator trebuie eliminat din `average_prices`.
- Calculul trebuie sa se execute in aceeasi tranzactie cu salvarea proprietatii, deoarece trigger-ul ruleaza in cadrul operatiei SQL care modifica tabela `properties`.
- Implementarea nu trebuie sa modifice fisiere TypeScript sau componente frontend.
- Nu se adauga interfata grafica in aceasta versiune.
- Nu se adauga endpoint public pentru statistici in aceasta versiune.

## 5. Cerinte non-functionale

Performanta:

- Recalcularea trebuie sa fie suficient de rapida pentru volumul mic sau mediu de date al aplicatiei de licenta.
- Se vor folosi indexuri pentru coloanele folosite la grupare si filtrare.

Securitate:

- Functionalitatea nu introduce date personale noi.
- Recalcularea se executa doar in backend, in cadrul operatiilor deja protejate pentru agenti.

Utilizabilitate:

- Agentul nu trebuie sa faca nicio actiune suplimentara pentru actualizarea mediei.
- Datele agregate trebuie sa fie pregatite pentru o afisare viitoare clara.

Mentenabilitate:

- Logica de recalculare trebuie izolata intr-o functie PostgreSQL.
- Codul trebuie sa ramana simplu, cu functii mici si denumiri clare.
- Implementarea trebuie sa foloseasca SQL migration files, conform regulilor proiectului.

## 6. User stories

- Ca agent, vreau ca sistemul sa actualizeze automat statisticile de pret cand marchez o proprietate ca vanduta sau inchiriata.
- Ca administrator, vreau ca datele agregate sa fie coerente, fara sa trebuiasca sa le introduc manual.
- Ca dezvoltator al aplicatiei, vreau o tabela separata cu medii de pret pentru a putea construi ulterior rapoarte sau recomandari.
- Ca utilizator public, in viitor, as putea vedea daca pretul unei proprietati este apropiat de media din orasul respectiv.

## 7. Proiectarea sistemului

### Backend Design

Nu se adauga rute noi in aceasta versiune.

Servicii afectate:

- Nu se modifica servicii backend.
- Nu se modifica `lib/properties/property-service.ts`.

Logica propusa in PostgreSQL:

- functie SQL `recalculate_average_prices()`
  - sterge valorile agregate existente;
  - recalculeaza mediile din tabela `properties`;
  - insereaza randurile noi in `average_prices`.
- functie trigger `refresh_average_prices_after_property_change()`
  - apeleaza `recalculate_average_prices()`;
  - returneaza `NEW`.
- trigger `properties_average_prices_after_insert_update`
  - ruleaza dupa `INSERT` sau `UPDATE` pe tabela `properties`.

Integrare in fluxurile existente:

- La `INSERT INTO properties`, trigger-ul recalculeaza tabela `average_prices`.
- La `UPDATE properties`, trigger-ul recalculeaza tabela `average_prices`.
- Nu sunt necesare modificari in endpoint-uri, controllere sau servicii.

### Frontend Design

Nu se modifica frontend-ul in aceasta versiune.

Pagini neafectate:

- `/properties`
- `/properties/[id]`
- `/agent/properties`
- `/admin/*`

State handling:

- Nu se adauga stare noua in componentele React.

## 8. Proiectarea bazei de date

Tabela noua: `average_prices`

Campuri:

- `id TEXT PRIMARY KEY`
- `type property_type NOT NULL`
- `city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE`
- `offer_type property_offer NOT NULL`
- `price NUMERIC(12, 2) NOT NULL CHECK (price >= 0)`
- `created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`

Constrangeri:

- `UNIQUE (type, city_id, offer_type)`
- `city_id` trebuie sa existe in tabela `cities`.
- `price` trebuie sa fie pozitiv sau zero.

Indexuri:

- index pentru `city_id`;
- index compus pentru `type`, `city_id`, `offer_type`.

Observatie:

- Denumirea coloanei `type` respecta cererea functionalitatii. In codul TypeScript, valoarea va fi mapata clar pentru a evita confuzia cu tipurile limbajului.

## 9. Flux de date

Flux pentru creare proprietate:

1. Agentul trimite formularul de creare proprietate.
2. Backend-ul valideaza datele.
3. Backend-ul insereaza proprietatea in tabela `properties`.
4. PostgreSQL executa trigger-ul de dupa `INSERT`.
5. Functia SQL recalculeaza tabela `average_prices`.
6. Backend-ul salveaza imaginile proprietatii, daca exista.
7. Tranzactia se finalizeaza prin `COMMIT`.
8. Raspunsul API ramane in formatul standard al proiectului.

Flux pentru actualizare proprietate:

1. Agentul trimite modificarile pentru o proprietate existenta.
2. Backend-ul verifica faptul ca proprietatea apartine agentului.
3. Backend-ul actualizeaza proprietatea.
4. PostgreSQL executa trigger-ul de dupa `UPDATE`.
5. Functia SQL recalculeaza tabela `average_prices`.
6. Backend-ul aplica modificarile pentru imagini, daca exista.
7. Tranzactia se finalizeaza prin `COMMIT`.
8. Agentul primeste proprietatea actualizata.

Flux de calcul:

1. Se selecteaza proprietatile active.
2. Se pastreaza doar proprietatile cu status finalizat:
   - `vanduta` pentru vanzare;
   - `inchiriata` pentru inchiriere.
3. Se calculeaza `price / area` pentru fiecare proprietate eligibila.
4. Se grupeaza rezultatele dupa `property_type`, `city_id` si `offer_type`.
5. Se salveaza media in `average_prices.price`.

## 10. Reguli de validare

- `properties.price` trebuie sa fie mai mare sau egal cu 0.
- `properties.area` trebuie sa fie mai mare decat 0.
- `average_prices.price` trebuie sa fie mai mare sau egal cu 0.
- `average_prices.city_id` trebuie sa indice un oras existent.
- `average_prices.type` trebuie sa fie una dintre valorile enumului `property_type`.
- `average_prices.offer_type` trebuie sa fie una dintre valorile enumului `property_offer`.
- Nu se calculeaza media pentru proprietati cu status `ciorna` sau `publicata`.
- Nu se calculeaza media pentru proprietati inactive.

## 11. Consideratii de securitate

- Functionalitatea nu permite introducerea directa a datelor in `average_prices` din frontend.
- Agentul nu poate modifica manual media de pret.
- Recalcularea foloseste doar date existente in baza de date.
- Operatiile de creare si actualizare proprietate raman protejate prin autentificare si autorizare de agent.
- Nu se expune endpoint public nou, deci nu apare o suprafata API suplimentara.

## 12. Cazuri limita

- Nu exista nicio proprietate eligibila pentru o combinatie: randul din `average_prices` nu trebuie sa existe.
- O proprietate trece din `publicata` in `vanduta`: media pentru vanzare trebuie actualizata.
- O proprietate trece din `vanduta` inapoi in `publicata`: media trebuie recalculata fara acea proprietate.
- Se modifica orasul unei proprietati vandute: media orasului vechi si a orasului nou trebuie reflectata corect.
- Se modifica suprafata unei proprietati vandute: pretul pe metru patrat trebuie recalculat.
- Se modifica pretul unei proprietati vandute: media trebuie recalculata.
- Se dezactiveaza o proprietate vanduta sau inchiriata: proprietatea nu mai trebuie inclusa in calcul.
- Daca o tranzactie esueaza, nici proprietatea si nici media nu trebuie salvate partial.

## 13. Criterii de acceptanta

- [ ] Exista un fisier SQL nou de migrare pentru tabela `average_prices`.
- [ ] Tabela `average_prices` contine campurile `id`, `type`, `city_id`, `offer_type` si `price`.
- [ ] Tabela are relatie explicita cu `cities`.
- [ ] Tabela are constrangere unica pentru `type`, `city_id`, `offer_type`.
- [ ] Exista o functie PostgreSQL pentru recalcularea tabelei `average_prices`.
- [ ] Exista un trigger PostgreSQL pe `properties` pentru `INSERT` si `UPDATE`.
- [ ] La creare proprietate, mediile se recalculeaza prin trigger.
- [ ] La actualizare proprietate, mediile se recalculeaza prin trigger.
- [ ] Implementarea nu modifica fisiere TypeScript sau componente frontend.
- [ ] Proprietatile cu `status = 'vanduta'` si `offer_type = 'vanzare'` sunt incluse in media de vanzare.
- [ ] Proprietatile cu `status = 'inchiriata'` si `offer_type = 'inchiriere'` sunt incluse in media de inchiriere.
- [ ] Proprietatile inactive nu sunt incluse in calcul.
- [ ] Proprietatile cu status `ciorna` sau `publicata` nu sunt incluse in calcul.
- [ ] Daca nu mai exista proprietati eligibile pentru o combinatie, randul agregat este eliminat.
- [ ] `npm run build` ruleaza cu succes dupa implementare.

## 14. Imbunatatiri viitoare

- Adaugarea unui endpoint pentru citirea mediilor de pret.
- Afisarea pretului mediu pe pagina de detalii a unei proprietati.
- Afisarea unei comparatii intre pretul proprietatii si media orasului.
- Calcularea mediilor pe judet, nu doar pe oras.
- Pastrarea unui istoric lunar al preturilor medii.
- Adaugarea unui panou de statistici pentru administrator.
