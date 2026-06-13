# Specificatie functionalitate: Ecran preturi medii pentru agent

## 1. Informatii generale

- Nume functionalitate: Afisare preturi medii in zona agent
- Tip functionalitate: full-stack
- Versiune: 1.0
- Autor: Claudiu Ștefan

## 2. Descrierea problemei

Agentii imobiliari pot administra proprietatile proprii, dar nu au un ecran in care sa vada preturile medii pe metru patrat calculate de platforma. Aceste valori sunt utile pentru compararea preturilor proprii cu nivelul general al pietei din aplicatie.

Functionalitatea propusa extinde ecranul de preturi medii astfel incat sa fie disponibil si pentru agenti. Agentul va putea vedea aceeasi lista agregata din tabela `average_prices`, fara posibilitatea de a modifica datele.

## 3. Obiective

Obiective principale:

- Crearea paginii `/agent/average-prices`.
- Permiterea accesului pentru utilizatori autentificati cu rol `agent`.
- Refolosirea listei existente de preturi medii.
- Afisarea orasului, tipului proprietatii, tipului ofertei si pretului mediu pe metru patrat.

Obiective secundare:

- Pastrarea aceleiasi structuri vizuale ca zona agent.
- Evitarea duplicarii excesive de logica.
- Pastrarea datelor read-only pentru agent.

## 4. Cerinte functionale

- Sistemul trebuie sa ofere pagina `/agent/average-prices`.
- Pagina trebuie sa fie accesibila doar pentru agenti autentificati.
- Agentul trebuie sa vada lista randurilor din tabela `average_prices`.
- Fiecare rand trebuie sa afiseze:
  - oras;
  - tip proprietate;
  - tip oferta;
  - pret mediu pe metru patrat.
- Endpoint-ul pentru preturi medii trebuie sa permita accesul pentru `admin` si `agent`.
- Utilizatorii publici nu trebuie sa poata accesa endpoint-ul.
- Agentul nu poate crea, modifica sau sterge randuri din `average_prices`.
- In navbar-ul zonei agent trebuie sa existe un link catre ecranul de preturi medii.
- Daca lista este goala, pagina trebuie sa afiseze un mesaj clar.

## 5. Cerinte non-functionale

Performanta:

- Lista se citeste direct din tabela `average_prices`, cu join pe `cities`.
- Nu se adauga request-uri suplimentare inutile.

Securitate:

- Endpoint-ul trebuie sa verifice existenta unei sesiuni autentificate.
- Rolurile acceptate sunt `admin` si `agent`.
- Accesul public ramane interzis.

Usability:

- Pagina trebuie sa fie simpla si responsive.
- Valorile trebuie afisate in format `EUR/mp`.
- Navigarea din zona agent trebuie sa ramana clara.

Mentenabilitate:

- Se refolosesc componentele existente pentru tabelul de preturi medii, daca este posibil.
- Nu se foloseste `any`.
- Nu se adauga librarii noi.

## 6. User stories

- Ca agent, vreau sa vad preturile medii pe metru patrat pentru a-mi compara proprietatile cu piata.
- Ca agent, vreau sa vad datele grupate dupa oras, tip de proprietate si tip de oferta.
- Ca administrator, vreau ca agentii sa poata consulta mediile fara sa le modifice.
- Ca utilizator public, nu trebuie sa am acces la acest ecran intern.

## 7. Proiectarea sistemului

### Backend Design

Endpoint afectat:

- `GET /api/average-prices`

Modificare propusa:

- endpoint-ul nu va mai folosi strict `requireAdmin`;
- endpoint-ul va accepta sesiuni autentificate cu rol `admin` sau `agent`;
- daca nu exista sesiune, raspunsul va fi `401`;
- daca rolul nu este acceptat, raspunsul va fi `403`.

Service afectat:

- `lib/average-prices/average-price-service.ts`

Nu sunt necesare modificari in query-ul de listare.

### Frontend Design

Pagina noua:

- `app/agent/average-prices/page.tsx`

Componente:

- se poate refolosi componenta client existenta pentru lista de preturi medii;
- pagina agent va avea navbar cu:
  - link catre `/agent/properties`;
  - link catre `/agent/messages`;
  - link catre `/`;
  - optional link activ/implicit catre preturi medii.

State handling:

- aceeasi stare locala folosita la lista existenta:
  - lista;
  - incarcare;
  - eroare.

## 8. Proiectarea bazei de date

Nu se modifica baza de date.

Tabela folosita:

- `average_prices`

Relatie folosita:

- `average_prices.city_id -> cities.id`

## 9. Flux de date

1. Agentul acceseaza `/agent/average-prices`.
2. Frontend-ul cere `GET /api/average-prices`.
3. Backend-ul verifica sesiunea si rolul.
4. Backend-ul citeste datele din `average_prices`.
5. Backend-ul returneaza lista in format JSON standard.
6. Frontend-ul afiseaza tabelul de preturi medii.

## 10. Reguli de validare

- Endpoint-ul nu primeste input.
- Rolul trebuie sa fie `admin` sau `agent`.
- Pretul trebuie tratat ca numar.
- Tipul proprietatii si tipul ofertei trebuie sa respecte enumurile existente.

## 11. Consideratii de securitate

- Accesul public este interzis.
- Agentii pot doar vizualiza date agregate.
- Nu se expun date personale.
- Nu se expun proprietatile individuale folosite in calcul.

## 12. Cazuri limita

- Agent neautentificat: endpoint-ul returneaza `401`.
- Rol neacceptat: endpoint-ul returneaza `403`.
- Lista goala: pagina afiseaza mesaj informativ.
- Eroare API: pagina afiseaza mesaj de eroare.
- Date multe: tabelul ramane responsive.

## 13. Criterii de acceptanta

- [ ] Exista pagina `/agent/average-prices`.
- [ ] Agentul poate accesa pagina dupa autentificare.
- [ ] Agentul vede orasul, tipul proprietatii, tipul ofertei si pretul mediu.
- [ ] Endpoint-ul `GET /api/average-prices` accepta rolurile `admin` si `agent`.
- [ ] Utilizatorii neautentificati nu pot accesa endpoint-ul.
- [ ] Agentul nu poate modifica valorile din `average_prices`.
- [ ] Zona agent are link catre ecranul de preturi medii.
- [ ] Nu se foloseste `any`.
- [ ] `npm run build` ruleaza cu succes dupa implementare.

## 14. Imbunatatiri viitoare

- Filtrare dupa oras, tip proprietate si oferta.
- Afisarea diferentei dintre proprietatile agentului si media pietei.
- Afisarea numarului de tranzactii folosite pentru fiecare medie.
- Export al datelor pentru analiza agentului.

