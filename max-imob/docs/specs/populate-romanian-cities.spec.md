# Specificație funcțională - Populare tabelă `cities` cu orașele din România

## 1. Informații generale

- Nume funcționalitate: Populare tabelă `cities` cu orașele din România
- Tip funcționalitate: backend / database
- Versiune: 1.0
- Autor: Claudiu Ștefan

## 2. Enunțul problemei

Tabela `cities` a fost creată pentru a permite organizarea orașelor într-o structură separată. Pentru ca această tabelă să fie utilă în aplicație, este necesară popularea ei cu date inițiale.

În contextul aplicației Max Imob, orașele sunt folosite pentru localizarea proprietăților și pentru filtrarea anunțurilor. Dacă lista de orașe este controlată, riscul de valori duplicate sau scrise greșit scade.

## 3. Obiective

Obiectivul principal este adăugarea unui fișier SQL care inserează în tabela `cities` orașele din România.

Obiective secundare:

- folosirea unei liste coerente de localități urbane;
- evitarea duplicatelor prin constrângerea `UNIQUE` de pe câmpul `name`;
- păstrarea unei migrări simple și ușor de explicat;
- pregătirea aplicației pentru filtre și selecturi bazate pe orașe.

## 4. Cerințe funcționale

Sistemul trebuie să includă o migrare nouă pentru popularea tabelei `cities`.

Migrarea trebuie să insereze localitățile urbane din România, adică municipii și orașe.

Migrarea nu trebuie să includă comune, sate sau sectoarele Bucureștiului ca orașe separate.

Fiecare oraș trebuie inserat cu:

- un `id` textual stabil;
- denumirea în câmpul `name`;
- `is_active` setat implicit la true;
- timestamp-uri implicite gestionate de baza de date.

Migrarea trebuie să poată fi rulată după `007_create_cities.sql`.

## 5. Cerințe non-funcționale

Performanță:

- inserarea datelor trebuie să fie realizată printr-un singur bloc SQL sau prin instrucțiuni clare;
- tabela are deja indexuri pentru căutare după nume și status.

Mentenabilitate:

- fișierul trebuie numerotat în continuarea migrărilor existente;
- lista trebuie să fie ușor de citit și modificat;
- denumirile trebuie scrise cu diacritice românești acolo unde este cazul.

Corectitudine:

- lista trebuie verificată înainte de implementare dintr-o sursă actuală;
- dacă apar neclarități privind statutul unei localități, acestea trebuie tratate conservator.

## 6. User stories

Ca agent, vreau să pot selecta orașul dintr-o listă controlată, pentru a evita greșelile de scriere.

Ca utilizator public, vreau să pot filtra proprietățile după orașe reale, pentru a găsi mai repede anunțurile relevante.

Ca administrator, vreau ca aplicația să aibă o bază de date inițială coerentă, pentru ca proiectul să fie mai ușor de demonstrat.

## 7. Design sistem

### Backend Design

Se va adăuga o migrare SQL nouă în `db/migrations`.

Nu se vor adăuga endpoint-uri noi în această etapă.

Nu se va modifica logica de proprietăți în această etapă.

### Frontend Design

Nu se modifică interfața în această etapă.

În viitor, lista din `cities` poate fi folosită în filtrele publice sau în formularul de creare a proprietăților.

## 8. Design bază de date

Tabela afectată: `cities`

Operație:

- inserare date inițiale în tabela `cities`.

Format propus:

- `id`: text generat în stil stabil și lizibil, de exemplu `city-brasov`;
- `name`: denumirea orașului, de exemplu `Brașov`.

Nu se modifică structura tabelei.

Nu se modifică tabela `properties`.

## 9. Flux de date

Migrarea `007_create_cities.sql` creează tabela `cities`.

Noua migrare inserează lista orașelor.

Aplicația existentă continuă să folosească actualul câmp text pentru oraș.

În viitor, aplicația poate citi orașele din tabela `cities` pentru afișarea listelor și filtrelor.

## 10. Reguli de validare

Denumirea orașului trebuie să fie completată.

Denumirea orașului trebuie să fie unică.

Lista trebuie să conțină localități urbane, nu toate localitățile administrative din România.

Orașele cu diacritice trebuie scrise corect.

## 11. Considerații de securitate

Migrarea nu conține date personale sau date sensibile.

Inserările trebuie să respecte constrângerea `UNIQUE`, pentru a evita duplicatele.

Orice administrare viitoare a orașelor prin interfață trebuie protejată prin rol de administrator.

## 12. Cazuri limită

Dacă o localitate apare de două ori, baza de date va refuza inserarea prin constrângerea `UNIQUE`.

Dacă o localitate își schimbă statutul administrativ în viitor, lista poate fi actualizată printr-o migrare nouă.

Dacă aplicația este rulată într-un mediu în care tabela este deja populată, migrarea trebuie să evite inserările duplicate.

## 13. Criterii de acceptare

- Există o migrare SQL nouă pentru popularea tabelei `cities`.
- Migrarea rulează după `007_create_cities.sql`.
- Lista include municipii și orașe din România.
- Denumirile sunt scrise cu diacritice acolo unde este cazul.
- Migrarea nu modifică tabela `properties`.
- Migrarea evită duplicatele printr-o strategie SQL potrivită.

## 14. Îmbunătățiri viitoare

Se poate adăuga o legătură `city_id` în tabela `properties`.

Se poate adăuga o pagină de administrare a orașelor în panoul administratorului.

Se pot grupa orașele pe județe, printr-o tabelă suplimentară `counties`.

Se pot folosi orașele pentru selecturi și filtre publice.
