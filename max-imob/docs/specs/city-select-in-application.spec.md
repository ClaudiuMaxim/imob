# Specificație funcțională - Select pentru orașe în aplicație

## 1. Informații generale

- Nume funcționalitate: Select pentru orașe
- Tip funcționalitate: full-stack
- Versiune: 1.0
- Autor: Claudiu Ștefan

## 2. Enunțul problemei

În versiunea inițială a aplicației, proprietățile foloseau câmpul `city` ca text liber. După introducerea tabelei `cities` și schimbarea tabelei `properties` pentru a folosi `city_id`, interfața trebuie actualizată pentru noua structură.

Formularele și filtrele care folosesc orașul nu trebuie să mai lucreze cu text liber, ci cu un oraș selectat din lista controlată din baza de date. Această schimbare reduce erorile de scriere și asigură legătura corectă dintre proprietăți și orașe.

## 3. Obiective

Obiectivul principal este înlocuirea inputurilor text pentru oraș cu selecturi bazate pe tabela `cities`.

Obiective secundare:

- adăugarea unui endpoint pentru listarea orașelor active;
- folosirea câmpului `cityId` în formularele de proprietăți;
- păstrarea afișării numelui orașului în carduri, tabele și detalii;
- adaptarea filtrelor publice pentru selectarea orașului din listă.

## 4. Cerințe funcționale

Aplicația trebuie să expună o rută API pentru listarea orașelor active.

Răspunsul API trebuie să includă pentru fiecare oraș:

- `id`
- `name`
- `countyCode`

Formularul agentului pentru creare/editare proprietate trebuie să afișeze un select pentru orașe.

La salvarea unei proprietăți, frontend-ul trebuie să trimită `cityId`, nu `city` text.

La editarea unei proprietăți, selectul trebuie să fie precompletat cu `property.cityId`.

Filtrul public după oraș trebuie să fie select, nu input text.

Filtrul public trebuie să transmită `cityId` către API.

API-ul de proprietăți trebuie să filtreze după `properties.city_id` atunci când primește `cityId`.

Cardurile, tabelele și pagina de detalii trebuie să afișeze în continuare `property.city`, adică numele orașului obținut prin join cu tabela `cities`.

## 5. Cerințe non-funcționale

Performanță:

- lista orașelor trebuie ordonată alfabetic;
- filtrarea după oraș trebuie să folosească indexul `properties_city_id_idx`.

Securitate:

- salvarea proprietăților trebuie să valideze că `cityId` există și este activ;
- endpoint-ul pentru listarea orașelor poate fi public, deoarece orașele nu sunt date sensibile.

Usability:

- selectul trebuie să aibă o opțiune inițială clară;
- în filtre, utilizatorul trebuie să poată alege „Toate orașele”.

Mentenabilitate:

- logica pentru orașe trebuie separată într-un modul simplu, de exemplu `lib/cities`;
- componentele existente trebuie modificate minim.

## 6. User stories

Ca agent, vreau să selectez orașul dintr-o listă, pentru a evita introducerea greșită a denumirii.

Ca utilizator public, vreau să filtrez proprietățile după oraș dintr-o listă clară, pentru a găsi mai repede anunțurile relevante.

Ca dezvoltator, vreau ca proprietățile să folosească `cityId`, pentru ca baza de date să rămână coerentă.

## 7. Design sistem

### Backend Design

Se va adăuga modulul `lib/cities`, care va conține serviciul pentru citirea orașelor.

Se va adăuga ruta API:

- `GET /api/cities`

Rutele existente pentru proprietăți vor fi actualizate pentru:

- citirea `cityId` din FormData;
- filtrarea după `cityId`;
- păstrarea compatibilității stricte cu noua structură.

### Frontend Design

În panoul agentului:

- câmpul „Oraș” devine select;
- starea locală devine `cityId`;
- la editare se setează `cityId` din proprietatea selectată.

În zona publică:

- filtrul orașului devine select;
- lista orașelor se încarcă din `/api/cities`;
- URL-ul de filtrare folosește `cityId`.

## 8. Design bază de date

Nu sunt necesare modificări noi de schemă.

Tabele folosite:

- `cities`
- `properties`

Relație folosită:

- `properties.city_id -> cities.id`

## 9. Flux de date

Frontend-ul cere lista orașelor prin `/api/cities`.

API-ul citește orașele active din tabela `cities`.

Agentul selectează un oraș în formular.

Frontend-ul trimite `cityId` către API-ul de proprietăți.

Serverul validează `cityId` și salvează valoarea în `properties.city_id`.

La afișare, serviciul de proprietăți face join cu `cities` și returnează numele orașului în câmpul `city`.

## 10. Reguli de validare

`cityId` este obligatoriu la crearea unei proprietăți.

`cityId` trebuie să existe în tabela `cities`.

Orașul trebuie să fie activ.

Filtrul public acceptă `cityId` gol pentru toate orașele.

## 11. Considerații de securitate

Endpoint-ul `/api/cities` nu returnează date sensibile.

Validarea orașului se face pe server.

Agentul nu poate salva proprietăți cu `cityId` inventat.

## 12. Cazuri limită

Dacă lista orașelor nu se poate încărca, formularul trebuie să afișeze eroare.

Dacă un oraș este dezactivat, nu trebuie folosit pentru proprietăți noi.

Dacă o proprietate existentă are `cityId`, selectul trebuie să fie precompletat corect.

Dacă filtrul primește un `cityId` invalid, API-ul trebuie să returneze o listă goală sau o eroare de validare.

## 13. Criterii de acceptare

- Există ruta `GET /api/cities`.
- Formularul agentului folosește select pentru oraș.
- Formularul trimite `cityId`, nu `city`.
- Filtrul public folosește select pentru oraș.
- API-ul de proprietăți poate filtra după `cityId`.
- Afișarea proprietăților păstrează numele orașului.
- Codul nu mai depinde de introducerea orașului ca text liber.

## 14. Îmbunătățiri viitoare

Se poate adăuga gruparea orașelor după județ.

Se poate adăuga căutare în select pentru liste lungi.

Se poate adăuga pagină de administrare a orașelor pentru administrator.
