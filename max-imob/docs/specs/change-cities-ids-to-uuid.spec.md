# Specificație funcțională - Schimbare `cities.id` la UUID

## 1. Informații generale

- Nume funcționalitate: Schimbare identificatori orașe la UUID
- Tip funcționalitate: backend / database
- Versiune: 1.0
- Autor: Claudiu Ștefan

## 2. Enunțul problemei

Tabela `cities` folosește în prezent identificatori text descriptivi, de forma `city-brasov-bv`. Acești identificatori sunt lizibili, dar nu sunt consecvenți cu restul proiectului, unde entitățile principale folosesc valori UUID salvate ca text.

Pentru coerență la nivelul bazei de date, este necesar ca valorile din `cities.id` să fie UUID-uri. Tabela poate rămâne cu tipul `TEXT`, conform stilului existent, dar valorile inserate trebuie să fie UUID-uri valide.

## 3. Obiective

Obiectivul principal este înlocuirea id-urilor descriptive din seed-ul orașelor cu UUID-uri.

Obiective secundare:

- păstrarea relației `properties.city_id -> cities.id`;
- păstrarea denumirilor orașelor și a codurilor de județ;
- menținerea migrărilor simple și ușor de explicat;
- evitarea modificării inutile a interfeței.

## 4. Cerințe funcționale

Seed-ul pentru tabela `cities` trebuie să insereze UUID-uri în coloana `id`.

Tabela `cities` poate păstra coloana `id` de tip `TEXT`, pentru compatibilitate cu restul tabelelor existente.

Valorile `id` trebuie să fie stabile în migrare, nu generate aleator la fiecare rulare.

Migrarea `009_change_properties_city_to_city_id.sql` trebuie să continue să funcționeze folosind `cities.id`.

Nu se modifică numele orașelor, codurile de județ sau regulile de unicitate.

## 5. Cerințe non-funcționale

Mentenabilitate:

- UUID-urile trebuie să fie scrise explicit în seed;
- nu se folosește generare dinamică în seed, pentru ca datele să fie reproductibile.

Compatibilitate:

- `properties.city_id` rămâne `TEXT`;
- foreign key-ul către `cities(id)` rămâne valid.

Claritate:

- schimbarea trebuie să fie limitată la migrațiile pentru orașe și la orice referință directă la id-uri de oraș.

## 6. User stories

Ca dezvoltator, vreau ca orașele să aibă id-uri UUID, pentru ca modelul bazei de date să fie consecvent.

Ca agent, vreau ca selectarea orașului să rămână funcțională, fără diferențe vizibile în interfață.

Ca utilizator public, vreau ca proprietățile să afișeze în continuare numele orașului corect.

## 7. Design sistem

### Backend Design

Nu sunt necesare endpoint-uri noi.

Serviciile existente pot continua să folosească `cityId`, deoarece tipul rămâne string.

### Frontend Design

Nu sunt necesare modificări vizuale.

În viitor, dacă se adaugă select pentru orașe, acesta va trimite UUID-ul orașului.

## 8. Design bază de date

Tabela afectată: `cities`

Coloană:

- `id` TEXT PRIMARY KEY

Schimbare:

- valorile seed-uite în `id` vor deveni UUID-uri.

Tabele dependente:

- `properties.city_id` va referi aceleași valori UUID din `cities.id`.

## 9. Flux de date

Migrarea `007_create_cities.sql` creează tabela `cities`.

Migrarea `008_seed_romanian_cities.sql` inserează orașele cu id-uri UUID.

Migrarea `009_change_properties_city_to_city_id.sql` mapează proprietățile existente către `cities.id`.

Aplicația folosește `cityId` ca string și afișează numele orașului prin join cu `cities`.

## 10. Reguli de validare

Fiecare id din seed trebuie să fie UUID valid.

Fiecare oraș trebuie să aibă `name` și `county_code`.

Perechea `(name, county_code)` rămâne unică.

Nu trebuie să existe două orașe cu același UUID.

## 11. Considerații de securitate

Schimbarea nu introduce date sensibile.

UUID-urile sunt mai potrivite decât id-urile descriptive atunci când id-urile sunt expuse prin API.

Validarea existenței orașului în serviciul de proprietăți rămâne necesară.

## 12. Cazuri limită

Dacă o proprietate veche are un oraș care nu există în `cities`, migrarea către `city_id` trebuie să eșueze explicit.

Dacă seed-ul este rulat de mai multe ori, `ON CONFLICT (name, county_code) DO NOTHING` trebuie să evite duplicatele.

Dacă în viitor se schimbă lista orașelor, UUID-urile existente nu trebuie modificate.

## 13. Criterii de acceptare

- Seed-ul orașelor folosește UUID-uri în coloana `id`.
- Tabela `cities` păstrează cheia primară pe `id`.
- `properties.city_id` rămâne compatibil cu `cities.id`.
- Nu se modifică numele orașelor sau codurile de județ.
- Aplicația poate continua să folosească `cityId` ca string.

## 14. Îmbunătățiri viitoare

Coloanele `id` din tabele pot fi convertite din `TEXT` în tip PostgreSQL `UUID`.

Se poate folosi extensia `pgcrypto` și `gen_random_uuid()` pentru inserări viitoare.

Se poate adăuga o interfață de administrare pentru orașe.
