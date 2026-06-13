# Specificatie functionalitate: Indicator pret fata de piata

## 1. Informatii generale

- Nume functionalitate: Indicator pret fata de piata pe pagina de detalii proprietate
- Tip functionalitate: full-stack
- Versiune: 1.0
- Autor: Claudiu Ștefan

## 2. Descrierea problemei

Pagina publica de detalii a unei proprietati afiseaza pretul total al anuntului, dar utilizatorul nu poate intelege rapid daca pretul este avantajos sau ridicat fata de proprietati similare din acelasi oras. Deoarece sistemul are deja tabela `average_prices`, calculata automat in PostgreSQL, aceasta informatie poate fi folosita pentru un indicator simplu si usor de inteles.

Functionalitatea propusa adauga sub pretul proprietatii un indicator vizual care arata daca pretul pe metru patrat este sub, apropiat sau peste media pietei. La click pe indicator, utilizatorul vede o modala cu pretul pe metru patrat al proprietatii si pretul mediu pe metru patrat din tabela `average_prices`.

## 3. Obiective

Obiective principale:

- Afisarea unui indicator sub pretul proprietatii pe pagina `/properties/[id]`.
- Compararea pretului pe metru patrat al proprietatii cu valoarea din `average_prices`.
- Afisarea unei modale cu detalii despre comparatie.
- Pastrarea interfetei simple, folosind Bootstrap.

Obiective secundare:

- Reutilizarea tabelei `average_prices`.
- Evitarea calculelor complexe in frontend.
- Pastrarea raspunsurilor API in formatul standard al proiectului.

## 4. Cerinte functionale

- Sistemul trebuie sa citeasca pretul mediu din tabela `average_prices` pentru proprietatea curenta.
- Cautarea mediei trebuie sa foloseasca:
  - `property_type`;
  - `city_id`;
  - `offer_type`.
- Backend-ul trebuie sa includa in raspunsul proprietatii informatia despre media de piata, daca exista.
- Frontend-ul trebuie sa calculeze pretul proprietatii pe metru patrat folosind formula `property.price / property.area`.
- Sub pretul total al proprietatii trebuie afisat un indicator scurt.
- Indicatorul trebuie sa aiba o forma compacta, bazata pe icon si text scurt.
- Daca pretul proprietatii pe metru patrat este sub media pietei, indicatorul trebuie sa comunice acest lucru.
- Daca pretul proprietatii pe metru patrat este peste media pietei, indicatorul trebuie sa comunice acest lucru.
- Daca pretul este foarte apropiat de media pietei, indicatorul poate afisa mesajul „aproape de medie”.
- La click pe indicator, trebuie sa se deschida o modala Bootstrap.
- Modala trebuie sa afiseze:
  - pretul total al proprietatii;
  - suprafata proprietatii;
  - pretul proprietatii pe metru patrat;
  - pretul mediu pe metru patrat din `average_prices`;
  - diferenta aproximativa fata de medie.
- Daca nu exista o medie disponibila pentru combinatia respectiva, indicatorul trebuie sa afiseze discret ca media nu este disponibila sau sa nu fie afisat.
- Functionalitatea se aplica doar paginii publice de detalii `/properties/[id]`.

## 5. Cerinte non-functionale

Performanta:

- Citirea mediei trebuie sa fie facuta printr-un query simplu, folosind constrangerea unica si indexurile din `average_prices`.
- Functionalitatea nu trebuie sa incarce separat pagina cu request-uri inutile daca media poate fi inclusa in raspunsul proprietatii.

Securitate:

- Datele din `average_prices` sunt agregate si nu contin date personale.
- Endpoint-ul public trebuie sa returneze doar informatii necesare pentru afisarea indicatorului.

Usability:

- Indicatorul trebuie sa fie usor de inteles la prima vedere.
- Modala trebuie sa foloseasca texte scurte si valori numerice clare.
- Pe mobil, indicatorul si modala trebuie sa ramana lizibile.

Mentenabilitate:

- Logica de citire a mediei trebuie pastrata in service-ul de proprietati.
- Componenta pentru indicator trebuie separata de componenta principala de detalii daca fisierul devine greu de citit.
- Tipurile TypeScript trebuie actualizate fara folosirea lui `any`.

## 6. User stories

- Ca utilizator public, vreau sa vad rapid daca pretul unei proprietati este sub sau peste media pietei.
- Ca utilizator public, vreau sa pot deschide o modala pentru a vedea pretul pe metru patrat si media pietei.
- Ca agent, vreau ca proprietatile mele sa fie prezentate cu un context de piata clar.
- Ca administrator, vreau ca informatiile agregate din baza de date sa fie folosite intr-un mod simplu si util.

## 7. Proiectarea sistemului

### Backend Design

Endpoint afectat:

- `GET /api/properties/[id]`

Service afectat:

- `lib/properties/property-service.ts`

Modificari propuse:

- Se adauga un tip pentru media de piata, de exemplu `AveragePrice`.
- Se adauga o functie simpla pentru citirea mediei:
  - `getAveragePriceForProperty(property)`
  - sau query integrat in citirea proprietatii.
- Raspunsul pentru proprietate va include un camp optional, de exemplu:
  - `averagePrice`

Structura propusa:

```json
{
  "averagePrice": {
    "price": 1450
  }
}
```

Campul `price` reprezinta pretul mediu pe metru patrat din tabela `average_prices`.

### Frontend Design

Pagini afectate:

- `app/properties/[id]/components/property-details-info.tsx`

Componente propuse:

- `PropertyMarketPriceIndicator`

Responsabilitati componenta:

- primeste proprietatea curenta;
- verifica daca exista `averagePrice`;
- calculeaza `property.price / property.area`;
- stabileste daca pretul este sub, apropiat sau peste media pietei;
- afiseaza indicatorul sub pret;
- deschide modala la click.

Stil:

- Bootstrap CSS;
- buton mic sau link-button;
- iconuri Bootstrap Icons, daca sunt deja disponibile in proiect;
- fara librarii noi.

State handling:

- Componenta indicator foloseste un state boolean simplu pentru afisarea modalei, de exemplu `isOpen`.
- Nu se introduce state global.

## 8. Proiectarea bazei de date

Nu se adauga tabele noi in aceasta functionalitate.

Tabela folosita:

- `average_prices`

Campuri relevante:

- `type`
- `city_id`
- `offer_type`
- `price`

Relatie logica:

- `properties.property_type = average_prices.type`
- `properties.city_id = average_prices.city_id`
- `properties.offer_type = average_prices.offer_type`

## 9. Flux de date

1. Utilizatorul deschide pagina `/properties/[id]`.
2. Frontend-ul cere datele prin `GET /api/properties/[id]?publicata=1`.
3. Backend-ul citeste proprietatea publica.
4. Backend-ul cauta pretul mediu in `average_prices` pentru tipul, orasul si tipul ofertei proprietatii.
5. Backend-ul returneaza proprietatea impreuna cu `averagePrice`, daca exista.
6. Frontend-ul calculeaza pretul proprietatii pe metru patrat.
7. Frontend-ul compara pretul proprietatii cu media.
8. Indicatorul este afisat sub pretul total.
9. La click pe indicator, se deschide modala cu detaliile comparatiei.

## 10. Reguli de validare

- `property.area` trebuie sa fie mai mare decat 0.
- `averagePrice.price` trebuie tratat ca valoare numerica pozitiva.
- Daca `averagePrice` este `null`, nu se calculeaza diferenta fata de piata.
- Comparatia trebuie sa foloseasca valori rotunjite doar pentru afisare; calculul poate folosi valorile numerice reale.
- Prag recomandat pentru „aproape de medie”: diferenta absoluta de maximum 5% fata de media pietei.

## 11. Consideratii de securitate

- Informatiile afisate sunt agregate si publice.
- Nu se afiseaza proprietatile folosite pentru calculul mediei.
- Nu se expune informatia despre agenti sau alte date interne.
- Endpoint-ul ramane public doar pentru proprietatile cu `status = publicata` si `is_active = true`.

## 12. Cazuri limita

- Nu exista rand in `average_prices`: indicatorul nu se afiseaza sau afiseaza „medie indisponibila”.
- Media este 0: indicatorul nu calculeaza procentul pentru a evita impartiri inutile sau rezultate neclare.
- Suprafata proprietatii lipseste sau este invalida: indicatorul nu se afiseaza.
- Pretul proprietatii este egal cu media: indicatorul afiseaza „aproape de medie”.
- Pretul este cu putin peste sau sub medie: se foloseste pragul de 5%.
- Utilizatorul inchide modala: pagina ramane pe aceeasi proprietate.
- Pe ecrane mici, modala trebuie sa se incadreze corect.

## 13. Criterii de acceptanta

- [ ] Pagina `/properties/[id]` afiseaza un indicator sub pretul total cand exista media de piata.
- [ ] Indicatorul arata daca pretul pe metru patrat este sub, aproape de sau peste media pietei.
- [ ] La click pe indicator se deschide o modala.
- [ ] Modala afiseaza pretul proprietatii pe metru patrat.
- [ ] Modala afiseaza pretul mediu pe metru patrat din `average_prices`.
- [ ] Backend-ul returneaza media pentru proprietatea curenta.
- [ ] Nu se folosesc librarii noi.
- [ ] Nu se foloseste `any`.
- [ ] `npm run build` ruleaza cu succes dupa implementare.

## 14. Imbunatatiri viitoare

- Afisarea unui grafic simplu cu evolutia preturilor medii.
- Afisarea mediei pe judet daca nu exista medie pentru oras.
- Afisarea numarului de proprietati folosite pentru calculul mediei.
- Adaugarea indicatorului si in cardurile din lista publica de proprietati.
- Afisarea unei recomandari pentru agent in panoul de administrare a proprietatilor.

