# Specificatie functionalitate: Gestionarea imaginilor proprietatii de catre agent

## 1. Informatii generale

- Nume functionalitate: Gestionarea imaginilor proprietatii de catre agent
- Tip functionalitate: full-stack
- Versiune: 1.0
- Autor: Claudiu Stefan

## 2. Problema

In versiunea curenta a aplicatiei, agentul poate adauga imagini la o proprietate, iar la editare imaginile noi sunt adaugate peste cele existente. Agentul nu poate sterge o imagine individuala si nu poate modifica ordinea de afisare a imaginilor.

Aceasta limitare afecteaza administrarea anunturilor, deoarece prima imagine este folosita ca imagine principala in listele publice si in panoul agentului. Agentul trebuie sa poata controla ce imagini raman atasate proprietatii si in ce ordine sunt prezentate vizitatorilor.

## 3. Obiective

Obiective principale:

- Agentul autentificat poate vedea imaginile existente ale unei proprietati in formularul de editare.
- Agentul poate elimina imagini existente dintr-o proprietate.
- Agentul poate schimba ordinea imaginilor existente folosind coloana existenta `property_images.sort_order`.
- Agentul poate adauga imagini noi in acelasi formular de editare.
- Sistemul salveaza ordinea finala in coloana existenta `property_images.sort_order`.

Obiective secundare:

- Prima imagine din ordine ramane imaginea principala a proprietatii.
- Interfata ramane simpla, folosind Bootstrap si controale usor de explicat.
- Implementarea nu introduce biblioteci suplimentare pentru drag-and-drop.

## 4. Cerinte functionale

- Formularul de proprietate afiseaza imaginile existente atunci cand agentul editeaza o proprietate.
- Fiecare imagine existenta este afisata ca miniatura.
- Fiecare miniatura are actiuni pentru:
  - mutare mai sus;
  - mutare mai jos;
  - stergere din lista.
- Butonul de mutare mai sus este dezactivat pentru prima imagine.
- Butonul de mutare mai jos este dezactivat pentru ultima imagine.
- Cand agentul sterge o imagine, aceasta dispare din lista de preview-uri, dar stergerea este aplicata definitiv doar la salvarea formularului.
- Agentul poate anula editarea, caz in care imaginile raman neschimbate in baza de date.
- Agentul poate adauga imagini noi prin inputul existent de tip fisier.
- Imaginile noi se adauga dupa imaginile existente ramase in lista.
- La salvare, backend-ul primeste lista finala de imagini pastrate si ordinea lor, apoi actualizeaza valorile existente din `property_images.sort_order`.
- Backend-ul sterge din baza de date imaginile care nu mai sunt incluse in lista trimisa de formular.
- Backend-ul actualizeaza coloana existenta `property_images.sort_order` pentru imaginile ramase.
- Backend-ul insereaza imaginile noi dupa imaginile ramase, in ordinea selectata de agent.
- Daca o proprietate ramane fara nicio imagine si agentul nu adauga imagini noi, salvarea este respinsa.
- Functionalitatea este disponibila doar pentru agentul care detine proprietatea.

## 5. Cerinte non-functionale

- Performanta:
  - Operatia de salvare trebuie sa foloseasca o tranzactie SQL pentru stergere, reordonare si adaugare.
  - Interfata trebuie sa manipuleze local lista de imagini fara request-uri separate pentru fiecare actiune.

- Securitate:
  - Doar utilizatorii cu rol `agent` pot modifica imaginile unei proprietati.
  - Agentul poate modifica doar imaginile proprietatilor proprii.
  - Backend-ul nu accepta `imageId` care nu apartine proprietatii editate.

- Uzabilitate:
  - Actiunile sunt vizibile langa fiecare miniatura.
  - Textul formularului explica faptul ca ordinea imaginilor controleaza imaginea principala.
  - Nu se foloseste drag-and-drop obligatoriu, pentru a pastra controlul simplu si accesibil.

- Mentenabilitate:
  - Logica de business ramane in service, nu in route/controller.
  - Componentele UI raman mici si reutilizabile.
  - Validarea inputurilor este manuala, conform regulilor proiectului.

## 6. User stories

- Ca agent, vreau sa vad imaginile existente ale proprietatii atunci cand o editez, pentru a intelege ce poze sunt deja publicate.
- Ca agent, vreau sa sterg o imagine gresita sau neactuala, pentru ca anuntul sa ramana relevant.
- Ca agent, vreau sa schimb prima imagine a proprietatii, pentru ca aceasta este folosita ca imagine principala in lista de anunturi.
- Ca agent, vreau sa adaug imagini noi fara sa pierd imaginile existente, pentru a imbunatati anuntul treptat.
- Ca utilizator public, vreau sa vad imaginile proprietatii in ordinea aleasa de agent, pentru a intelege mai bine oferta.
- Ca admin, nu vreau sa administrez imaginile proprietatilor, deoarece proprietatile apartin agentilor.

## 7. Design sistem

### Backend

Endpoint afectat:

- `PUT /api/properties/:id`

Payload propus prin `FormData`:

- campurile existente ale proprietatii:
  - `title`
  - `description`
  - `price`
  - `cityId`
  - `address`
  - `propertyType`
  - `offerType`
  - `status`
  - `bedrooms`
  - `bathrooms`
  - `area`
- fisiere noi:
  - `images`
- campuri noi doar in request-ul `FormData`, nu in baza de date:
  - `keptImageIds`: sir JSON cu id-urile imaginilor existente care trebuie pastrate;
  - `imageOrder`: sir JSON temporar cu id-urile imaginilor existente in ordinea dorita.

Exemplu conceptual:

```json
{
  "keptImageIds": ["img-1", "img-3"],
  "imageOrder": ["img-3", "img-1"]
}
```

Route/controller:

- Citeste `FormData`.
- Extrage fisierele noi cu helperul existent `getImageFiles`.
- Extrage `keptImageIds` si `imageOrder`.
- Valideaza manual structura celor doua liste.
- Apeleaza service-ul `updateProperty`.
- Returneaza raspuns JSON standard.

Service:

- Verifica existenta proprietatii si apartenenta la agent.
- Ruleaza operatia intr-o tranzactie.
- Actualizeaza datele text/numerice ale proprietatii.
- Sterge randurile din `property_images` care apartin proprietatii, dar nu se afla in `keptImageIds`.
- Actualizeaza coloana existenta `property_images.sort_order` pentru imaginile pastrate conform listei temporare `imageOrder`.
- Insereaza imaginile noi dupa ultimul index folosit.
- Returneaza proprietatea actualizata.

### Frontend

Pagini afectate:

- `/agent/properties`

Componente afectate:

- `app/agent/properties/properties.tsx`
- `app/agent/properties/components/property-form.tsx`
- `app/agent/properties/components/property-images-input.tsx`

Componenta noua propusa:

- `app/agent/properties/components/property-existing-images.tsx`

Responsabilitati componenta noua:

- Afiseaza miniaturile imaginilor existente.
- Expune actiunile:
  - Sus;
  - Jos;
  - Sterge.
- Primeste lista imaginilor din state-ul formularului.
- Trimite modificarile catre container prin callback-uri.

State handling:

- Pentru formular se pastreaza modelul existent cu state separat pentru campuri.
- Se adauga un state separat pentru imaginile existente, de exemplu:
  - `existingImages`
- Se adauga un state separat pentru fisierele noi:
  - `selectedImages`
- La selectarea unei proprietati pentru editare, `existingImages` se initializeaza cu `property.images`.
- La salvare, `FormData` include:
  - campurile existente;
  - fisierele noi;
  - `keptImageIds`;
  - `imageOrder`.

## 8. Design baza de date

Tabel existent:

- `property_images`

Campuri relevante existente:

- `id`
- `property_id`
- `image_url`
- `file_name`
- `sort_order`

Observatie importanta:

- Nu se adauga coloane noi in baza de date pentru aceasta functionalitate.
- Nu este necesara o migrare SQL noua.
- `imageOrder` este doar un camp trimis temporar din frontend catre backend pentru a calcula noile valori ale coloanei existente `property_images.sort_order`.

Relatii:

- O proprietate are mai multe imagini.
- O imagine apartine unei singure proprietati.

Constrangeri:

- `property_id` trebuie sa indice o proprietate existenta.
- `sort_order` este folosit pentru ordonarea imaginilor la afisare.
- Nu este necesara o migrare noua deoarece tabela contine deja `sort_order`.

Observatie:

- Stergerea fizica a fisierelor din `public/uploads/properties` poate fi tratata ca imbunatatire viitoare. In aceasta versiune, stergerea obligatorie este stergerea randului din baza de date, pentru a evita afisarea imaginii eliminate.

## 9. Flux de date

1. Agentul deschide pagina `/agent/properties`.
2. Frontend-ul incarca proprietatile agentului prin API.
3. Agentul apasa `Editeaza` pentru o proprietate.
4. Formularul se populeaza cu datele proprietatii si cu lista `property.images`.
5. Agentul muta imaginile sus/jos sau sterge imagini din lista.
6. Agentul poate selecta imagini noi din inputul de fisiere.
7. La submit, frontend-ul construieste `FormData`.
8. Frontend-ul trimite request `PUT /api/properties/:id`.
9. Backend-ul valideaza agentul si datele primite.
10. Service-ul actualizeaza proprietatea, imaginile pastrate, ordinea si imaginile noi intr-o tranzactie.
11. Backend-ul returneaza proprietatea actualizata.
12. Frontend-ul actualizeaza lista proprietatilor si reseteaza formularul.

## 10. Reguli de validare

- `keptImageIds` trebuie sa fie un sir JSON valid.
- `imageOrder` trebuie sa fie un sir JSON valid.
- Toate valorile din `keptImageIds` si `imageOrder` trebuie sa fie string-uri.
- `imageOrder` trebuie sa contina doar id-uri din `keptImageIds`.
- Nu sunt acceptate duplicate in `keptImageIds`.
- Nu sunt acceptate duplicate in `imageOrder`.
- Toate imaginile mentionate trebuie sa apartina proprietatii editate.
- Proprietatea trebuie sa ramana cu cel putin o imagine dupa salvare:
  - fie imagine existenta pastrata;
  - fie imagine noua adaugata.
- Validarea fisierelor ramane cea existenta:
  - tipuri acceptate: JPEG, PNG, WEBP;
  - limita de numar/dimensiune conform helperului existent.

## 11. Consideratii de securitate

- Endpoint-ul `PUT /api/properties/:id` ramane protejat cu `requireAgent`.
- Backend-ul foloseste `session.userId` pentru a verifica proprietarul proprietatii.
- Clientul nu poate decide `agentId`.
- Backend-ul ignora sau respinge imaginile care nu apartin proprietatii editate.
- Operatia foloseste tranzactie pentru a evita stari partiale.
- Datele primite prin `FormData` sunt validate manual inainte de modificarea bazei de date.
- Raspunsurile respecta formatul JSON standard al proiectului.

## 12. Cazuri limita

- Agentul sterge toate imaginile si nu adauga altele:
  - backend-ul returneaza eroare 400.
- Agentul trimite un `imageId` care nu apartine proprietatii:
  - backend-ul returneaza eroare 400 sau 404.
- Agentul modifica ordinea imaginilor si in acelasi timp adauga imagini noi:
  - imaginile existente sunt ordonate conform `imageOrder`, iar imaginile noi se adauga la final.
- Agentul apasa `Anuleaza`:
  - modificarile locale asupra imaginilor nu se salveaza.
- Upload-ul unei imagini noi esueaza:
  - proprietatea si imaginile existente nu trebuie modificate partial.
- Doua request-uri de editare sunt trimise aproape simultan:
  - ultima salvare aplicata decide ordinea finala, iar tranzactia previne update-uri partiale.
- Proprietatea nu exista sau nu apartine agentului:
  - backend-ul returneaza mesajul existent `Proprietatea nu a fost gasita.`

## 13. Criterii de acceptanta

- [ ] Agentul vede imaginile existente in formularul de editare.
- [ ] Agentul poate sterge o imagine existenta din lista de editare.
- [ ] Agentul poate muta o imagine mai sus.
- [ ] Agentul poate muta o imagine mai jos.
- [ ] Prima imagine din lista devine prima imagine returnata de API.
- [ ] Imaginile noi se pot adauga in continuare.
- [ ] Imaginile noi sunt salvate dupa imaginile existente ramase.
- [ ] Salvarea fara nicio imagine este respinsa.
- [ ] Agentul nu poate modifica imaginile unei proprietati care nu ii apartine.
- [ ] Raspunsurile API respecta formatul standard `{ success, data, error }`.
- [ ] Nu este adaugata nicio biblioteca noua pentru drag-and-drop.
- [ ] Functionalitatea foloseste Bootstrap pentru UI.

## 14. Imbunatatiri viitoare

- Implementarea drag-and-drop pentru reordonare, daca proiectul va permite o biblioteca dedicata sau o implementare simpla.
- Stergerea fisierelor fizice nefolosite din `public/uploads/properties`.
- Afisarea unei etichete `Imagine principala` pe prima imagine.
- Confirmare vizuala suplimentara inainte de stergerea unei imagini.
- Reordonarea imaginilor noi inainte de salvare.
