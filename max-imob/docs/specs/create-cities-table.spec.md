# Specificație funcțională - Tabelă `cities`

## 1. Informații generale

- Nume funcționalitate: Creare tabelă `cities`
- Tip funcționalitate: backend / database
- Versiune: 1.0
- Autor: Claudiu Ștefan

## 2. Enunțul problemei

Aplicația Max Imob folosește orașul ca informație importantă pentru proprietăți și filtrare. În forma actuală, orașul este tratat ca text introdus direct în proprietate. Această abordare este simplă, dar poate duce la valori duplicate sau scrise diferit, de exemplu `Brașov`, `Brasov` sau `brasov`.

Pentru o organizare mai bună a datelor, este necesară introducerea unei tabele separate pentru orașe. Aceasta va permite administrarea centralizată a orașelor și va pregăti aplicația pentru filtre mai curate.

## 3. Obiective

Obiectivul principal este adăugarea unei tabele `cities` în baza de date PostgreSQL.

Obiective secundare:

- păstrarea unei structuri simple și ușor de explicat;
- evitarea duplicării necontrolate a denumirilor de orașe;
- pregătirea aplicației pentru o posibilă legătură viitoare între proprietăți și orașe;
- păstrarea compatibilității cu implementarea actuală, fără modificarea fluxurilor existente.

## 4. Cerințe funcționale

Sistemul trebuie să includă o nouă tabelă numită `cities`.

Tabela trebuie să permită stocarea denumirii orașului.

Denumirea orașului trebuie să fie unică.

Tabela trebuie să permită dezactivarea logică a unui oraș printr-un câmp boolean.

Tabela trebuie să păstreze data creării și data ultimei modificări.

În această etapă, tabela `properties` nu va fi modificată. Proprietățile vor continua să folosească actualul câmp text pentru oraș.

## 5. Cerințe non-funcționale

Performanță:

- tabela trebuie să includă index pentru căutarea după numele orașului;
- structura trebuie să fie simplă, fără relații suplimentare în această etapă.

Securitate:

- datele trebuie introduse doar prin mecanisme controlate de aplicație sau migrații;
- nu se vor salva informații sensibile în această tabelă.

Mentenabilitate:

- modificarea trebuie realizată printr-un fișier SQL de migrare;
- numele câmpurilor trebuie să respecte stilul existent din baza de date.

## 6. User stories

Ca administrator, vreau ca orașele să poată fi organizate într-o tabelă separată, pentru ca datele aplicației să fie mai coerente.

Ca agent, vreau ca în viitor să pot selecta orașul dintr-o listă controlată, pentru a evita greșelile de scriere.

Ca utilizator public, vreau filtre după oraș mai clare, pentru a găsi mai ușor proprietățile relevante.

## 7. Design sistem

### Backend Design

În această etapă nu se adaugă endpoint-uri noi. Schimbarea este limitată la baza de date.

Migrarea nouă va fi adăugată în directorul `db/migrations`.

### Frontend Design

Nu se modifică interfața în această etapă.

Într-o etapă viitoare, orașele pot fi folosite pentru selecturi în formularele agentului și pentru filtre publice.

## 8. Design bază de date

Tabela nouă: `cities`

Câmpuri propuse:

- `id` TEXT PRIMARY KEY
- `name` TEXT NOT NULL UNIQUE
- `is_active` BOOLEAN NOT NULL DEFAULT true
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

Indexuri propuse:

- index pe `name`
- index pe `is_active`

Relații:

- în această etapă nu se adaugă relație cu `properties`;
- relația poate fi adăugată ulterior printr-o migrare separată.

## 9. Flux de date

Migrarea este aplicată în baza de date.

PostgreSQL creează tabela `cities`.

Aplicația existentă continuă să funcționeze fără modificări, deoarece tabela `properties` nu este schimbată.

În viitor, orașele pot fi citite din această tabelă pentru afișare în filtre sau formulare.

## 10. Reguli de validare

Denumirea orașului nu trebuie să fie goală.

Denumirea orașului trebuie să fie unică.

Câmpul `is_active` trebuie să fie boolean.

Timestamp-urile sunt completate automat de baza de date.

## 11. Considerații de securitate

Tabela nu conține date sensibile.

Unicitatea numelui reduce riscul de date duplicate.

În viitor, orice endpoint care va modifica orașe trebuie protejat prin rol de administrator.

## 12. Cazuri limită

Dacă se încearcă inserarea aceluiași oraș de două ori, baza de date trebuie să refuze operația prin constrângerea `UNIQUE`.

Dacă un oraș nu mai trebuie folosit, acesta poate fi marcat inactiv fără ștergere fizică.

Dacă aplicația folosește în continuare câmpul text din `properties`, nu apar modificări de compatibilitate.

## 13. Criterii de acceptare

- Există un fișier de migrare SQL nou pentru tabela `cities`.
- Tabela `cities` include câmpurile `id`, `name`, `is_active`, `created_at` și `updated_at`.
- Câmpul `name` este obligatoriu și unic.
- Tabela include indexuri pentru `name` și `is_active`.
- Nu sunt modificate tabelele existente în această etapă.
- Aplicația existentă rămâne compatibilă cu structura actuală.

## 14. Îmbunătățiri viitoare

Orașele pot fi populate automat cu valori inițiale.

Tabela `properties` poate primi un câmp `city_id` legat de `cities`.

Panoul administratorului poate primi o secțiune pentru administrarea orașelor.

Filtrele publice pot folosi lista de orașe active din baza de date.
