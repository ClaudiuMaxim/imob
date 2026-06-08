# Specificație funcțională - Înlocuire `properties.city` cu `properties.city_id`

## 1. Informații generale

- Nume funcționalitate: Înlocuire coloană oraș în proprietăți
- Tip funcționalitate: backend / database / full-stack
- Versiune: 1.0
- Autor: Claudiu Ștefan

## 2. Enunțul problemei

Tabela `properties` conține în prezent coloana `city` de tip text. Această abordare permite introducerea liberă a orașului, dar poate produce valori duplicate sau neuniforme. După introducerea tabelei `cities`, este mai corect ca proprietățile să folosească o referință către această tabelă.

Schimbarea propusă constă în înlocuirea coloanei text `city` cu o coloană `city_id`, care va referi tabela `cities`. Astfel, orașele devin date controlate, iar proprietățile sunt legate de o listă centralizată de orașe.

## 3. Obiective

Obiectivul principal este modificarea tabelei `properties` astfel încât proprietățile să folosească `city_id` în loc de `city`.

Obiective secundare:

- adăugarea unei relații explicite între `properties` și `cities`;
- păstrarea integrității datelor prin foreign key;
- pregătirea aplicației pentru selectarea orașului dintr-o listă;
- reducerea riscului de orașe scrise diferit în proprietăți.

## 4. Cerințe funcționale

Tabela `properties` trebuie să primească o coloană nouă `city_id`.

Coloana `city_id` trebuie să fie de tip `TEXT`.

Coloana `city_id` trebuie să fie obligatorie.

Coloana `city_id` trebuie să aibă foreign key către `cities(id)`.

Coloana veche `city` trebuie eliminată după introducerea relației.

Trebuie adăugat index pe `properties.city_id`, pentru filtrarea eficientă după oraș.

În codul aplicației, formularele și serviciile care folosesc `city` trebuie actualizate pentru `cityId`.

## 5. Cerințe non-funcționale

Performanță:

- filtrarea după oraș trebuie să folosească indexul pe `city_id`;
- interogările publice trebuie să poată obține numele orașului prin join cu tabela `cities`.

Securitate:

- serverul trebuie să valideze existența orașului înainte de salvarea proprietății;
- agentul nu trebuie să poată trimite un `city_id` inexistent.

Mentenabilitate:

- schimbarea trebuie realizată printr-o migrare SQL nouă, nu prin modificarea migrațiilor vechi;
- codul trebuie să folosească denumirea `cityId` în TypeScript.

## 6. User stories

Ca agent, vreau să aleg orașul dintr-o listă controlată, pentru a evita greșelile de scriere.

Ca utilizator public, vreau să văd orașul corect pentru fiecare proprietate.

Ca dezvoltator, vreau ca proprietățile să fie legate de tabela `cities`, pentru ca datele să fie mai coerente.

## 7. Design sistem

### Backend Design

Se va adăuga o migrare SQL nouă după migrarea de seed pentru orașe.

Serviciile pentru proprietăți vor fi actualizate pentru a salva și returna `cityId`.

Interogările care afișează proprietăți vor folosi join cu `cities`, dacă interfața are nevoie și de numele orașului.

Validarea proprietăților va verifica existența câmpului `cityId`.

### Frontend Design

Formularul de proprietate va trimite `cityId` în loc de `city`.

Componentele care afișează proprietăți pot afișa în continuare numele orașului, dar acesta va fi obținut din relația cu tabela `cities`.

Filtrele publice vor trebui adaptate ulterior pentru a folosi `cityId` sau lista orașelor.

## 8. Design bază de date

Tabela afectată: `properties`

Coloană nouă:

- `city_id` TEXT NOT NULL REFERENCES cities(id)

Coloană eliminată:

- `city` TEXT

Index nou:

- `properties_city_id_idx` pe `city_id`

Migrarea trebuie să ruleze după:

- `007_create_cities.sql`
- `008_seed_romanian_cities.sql`

## 9. Flux de date

Agentul selectează orașul din interfață.

Frontend-ul trimite `cityId` către API.

API-ul validează datele și apelează serviciul de proprietăți.

Serviciul salvează `city_id` în tabela `properties`.

La afișare, serviciul poate returna atât `cityId`, cât și numele orașului obținut din tabela `cities`.

## 10. Reguli de validare

`cityId` este obligatoriu.

`cityId` trebuie să existe în tabela `cities`.

Orașul trebuie să fie activ, dacă aplicația decide să folosească doar orașe active.

Nu se mai acceptă salvarea orașului ca text liber în `properties.city`.

## 11. Considerații de securitate

Validarea trebuie făcută pe server, nu doar în interfață.

Foreign key-ul împiedică salvarea unui oraș inexistent.

Rutele agentului trebuie să păstreze verificarea rolului și a apartenenței proprietății.

## 12. Cazuri limită

Dacă există proprietăți vechi cu valori în `city`, acestea trebuie migrate cu atenție către `city_id`.

Dacă valoarea text nu se potrivește cu niciun oraș din tabela `cities`, migrarea trebuie tratată explicit.

Dacă două orașe au același nume în județe diferite, identificarea corectă se face prin `city_id`, nu doar prin nume.

## 13. Criterii de acceptare

- Există o migrare SQL nouă pentru modificarea tabelei `properties`.
- Tabela `properties` conține `city_id`.
- `city_id` are foreign key către `cities(id)`.
- Coloana veche `city` este eliminată.
- Există index pe `properties.city_id`.
- Codul aplicației folosește `cityId` pentru proprietăți.
- Aplicația nu mai salvează orașul ca text liber în `properties`.

## 14. Îmbunătățiri viitoare

Se poate adăuga un endpoint pentru listarea orașelor active.

Se poate actualiza formularul agentului cu select pentru orașe.

Se pot adăuga județe într-o tabelă separată `counties`.

Se pot adapta filtrele publice pentru selectarea orașului din lista controlată.
