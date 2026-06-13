# Specificatie functionalitate: Ecran administrare preturi medii

## 1. Informatii generale

- Nume functionalitate: Afisare preturi medii in zona admin
- Tip functionalitate: full-stack
- Versiune: 1.0
- Autor: Claudiu Ștefan

## 2. Descrierea problemei

Aplicatia Max Imob calculeaza automat preturile medii pe metru patrat in tabela `average_prices`, dar aceste date nu pot fi vizualizate intr-o interfata administrativa. Administratorul nu are in prezent un ecran din care sa vada valorile agregate pe oras, tip de proprietate si tip de oferta.

Functionalitatea propusa adauga un ecran nou in zona admin, unde administratorul poate vedea continutul tabelei `average_prices` intr-un tabel simplu. Acest ecran ajuta la verificarea datelor calculate automat si la intelegerea nivelului mediu de pret din platforma.

## 3. Obiective

Obiective principale:

- Crearea paginii `/admin/average-prices`.
- Afisarea randurilor din tabela `average_prices`.
- Afisarea orasului, tipului de proprietate, tipului de oferta si pretului mediu pe metru patrat.
- Protejarea accesului astfel incat doar administratorii autentificati sa poata vedea datele.

Obiective secundare:

- Pastrarea interfetei simple si coerente cu pagina `/admin/agents`.
- Folosirea Bootstrap pentru layout si tabel.
- Pastrarea codului backend simplu, cu service separat pentru citirea datelor.

## 4. Cerinte functionale

- Sistemul trebuie sa ofere pagina `/admin/average-prices`.
- Pagina trebuie sa fie disponibila doar pentru utilizatori cu rol `admin`.
- Sistemul trebuie sa ofere un endpoint REST pentru listarea preturilor medii.
- Endpoint-ul trebuie sa returneze doar date JSON in formatul standard al proiectului.
- Lista trebuie sa includa toate randurile din tabela `average_prices`.
- Fiecare rand afisat trebuie sa contina:
  - oras;
  - tip proprietate;
  - tip oferta: `vanzare` sau `inchiriere`;
  - pret mediu pe metru patrat.
- Datele trebuie ordonate intr-un mod usor de parcurs, recomandat dupa oras, tip proprietate si tip oferta.
- Daca nu exista preturi medii, pagina trebuie sa afiseze un mesaj clar.
- Pagina trebuie sa aiba un link de intoarcere catre zona principala admin sau catre site.
- Nu se adauga functionalitati de creare, editare sau stergere pentru `average_prices`.
- Administratorul doar vizualizeaza datele calculate automat.

## 5. Cerinte non-functionale

Performanta:

- Query-ul trebuie sa citeasca direct tabela `average_prices` si sa faca join cu `cities` pentru numele orasului.
- Pentru volumul estimat al aplicatiei, listarea completa este suficienta.

Securitate:

- Endpoint-ul trebuie protejat cu `requireAdmin`.
- Utilizatorii publici si agentii nu trebuie sa poata accesa lista.
- Datele sunt agregate si nu contin informatii personale.

Usability:

- Tabelul trebuie sa fie responsive.
- Valorile numerice trebuie formatate clar, de exemplu `1.450 EUR/mp`.
- Etichetele trebuie sa fie in limba romana.

Mentenabilitate:

- Logica SQL trebuie pastrata intr-un service dedicat sau intr-o functie simpla din zona potrivita.
- Tipurile TypeScript trebuie definite explicit.
- Nu se foloseste `any`.
- Nu se adauga librarii noi.

## 6. User stories

- Ca administrator, vreau sa vad toate preturile medii calculate pentru a verifica datele agregate ale platformei.
- Ca administrator, vreau sa vad orasul, tipul proprietatii si tipul ofertei pentru fiecare medie.
- Ca administrator, vreau sa vad pretul mediu pe metru patrat intr-un format usor de citit.
- Ca agent, nu vreau sa pot modifica aceste valori, deoarece ele sunt calculate automat.

## 7. Proiectarea sistemului

### Backend Design

Endpoint nou:

- `GET /api/average-prices`

Reguli endpoint:

- foloseste `requireAdmin(request)`;
- returneaza lista preturilor medii;
- raspuns standard:

```json
{
  "success": true,
  "data": {
    "averagePrices": []
  },
  "error": null
}
```

Service propus:

- `lib/average-prices/average-price-service.ts`

Tip propus:

- `AveragePriceRow`
  - `id`;
  - `cityId`;
  - `city`;
  - `propertyType`;
  - `offerType`;
  - `price`.

Query propus:

- `SELECT average_prices.id, average_prices.city_id, cities.name AS city, average_prices."type", average_prices.offer_type, average_prices.price`
- `FROM average_prices`
- `JOIN cities ON cities.id = average_prices.city_id`
- `ORDER BY cities.name ASC, average_prices."type" ASC, average_prices.offer_type ASC`

### Frontend Design

Pagina noua:

- `app/admin/average-prices/page.tsx`

Componente propuse:

- `AveragePricesAdmin`
- `AveragePricesTable`

Structura UI:

- navbar simplu similar cu `/admin/agents`;
- titlu: `Preturi medii`;
- descriere scurta;
- tabel responsive cu coloanele:
  - Oras;
  - Tip proprietate;
  - Oferta;
  - Pret mediu.

State handling:

- componenta client foloseste state local pentru:
  - lista;
  - incarcare;
  - eroare.
- nu se foloseste state global.

## 8. Proiectarea bazei de date

Nu se adauga tabele noi.

Tabela folosita:

- `average_prices`

Relatie folosita:

- `average_prices.city_id -> cities.id`

Campuri afisate:

- `average_prices.type`;
- `average_prices.city_id`;
- `cities.name`;
- `average_prices.offer_type`;
- `average_prices.price`.

## 9. Flux de date

1. Administratorul acceseaza `/admin/average-prices`.
2. Frontend-ul trimite request catre `GET /api/average-prices`.
3. Backend-ul verifica autentificarea si rolul prin `requireAdmin`.
4. Backend-ul citeste datele din `average_prices` si numele orasului din `cities`.
5. Backend-ul returneaza lista in format JSON standard.
6. Frontend-ul afiseaza datele intr-un tabel.
7. Daca lista este goala, frontend-ul afiseaza un mesaj informativ.

## 10. Reguli de validare

- Endpoint-ul nu primeste input in aceasta versiune.
- `price` trebuie tratat ca numar.
- Daca baza de date returneaza valori lipsa, randul trebuie mapat defensiv sau tratat ca eroare de backend.
- Tipurile `propertyType` si `offerType` trebuie sa respecte enumurile existente.

## 11. Consideratii de securitate

- Accesul la endpoint este permis doar pentru `admin`.
- Cookie-ul JWT existent este folosit pentru autentificare.
- Agentii primesc `403` daca incearca sa acceseze endpoint-ul.
- Utilizatorii neautentificati primesc `401`.
- Nu se expun date personale sau parole.

## 12. Cazuri limita

- Tabela `average_prices` este goala: pagina afiseaza mesaj de lista goala.
- Orasul asociat nu exista: constrangerea bazei de date ar trebui sa previna acest caz.
- Cererea API esueaza: pagina afiseaza mesaj de eroare.
- Administratorul nu este autentificat: API-ul returneaza eroare de autentificare.
- Lista are multe randuri: tabelul trebuie sa ramana responsive.

## 13. Criterii de acceptanta

- [ ] Exista pagina `/admin/average-prices`.
- [ ] Exista endpoint `GET /api/average-prices`.
- [ ] Endpoint-ul este protejat cu `requireAdmin`.
- [ ] Pagina afiseaza orasul pentru fiecare rand.
- [ ] Pagina afiseaza tipul proprietatii.
- [ ] Pagina afiseaza tipul ofertei.
- [ ] Pagina afiseaza pretul mediu pe metru patrat.
- [ ] Tabelul are stare de incarcare.
- [ ] Tabelul are stare de lista goala.
- [ ] Tabelul are stare de eroare.
- [ ] Nu se adauga editare/stergere pentru preturile medii.
- [ ] Nu se foloseste `any`.
- [ ] `npm run build` ruleaza cu succes dupa implementare.

## 14. Imbunatatiri viitoare

- Adaugarea filtrelor dupa oras, tip proprietate si tip oferta.
- Adaugarea sortarii pe coloane.
- Afisarea numarului de proprietati folosite pentru fiecare medie.
- Export CSV pentru rapoarte administrative.
- Afisarea unui grafic cu distributia preturilor medii.

