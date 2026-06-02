# Specificație Tehnică: Sistem de Mesaje Contact Agent

## 1. Informații Generale
- **Nume Feature**: Contact Agent - Sistem de Mesaje
- **Tip Feature**: Full-stack (Frontend + Backend + Database)
- **Versiune**: 1.0
- **Autor**: Claudiu Ștefan

---

## 2. Declarația Problemei
În prezent, vizitatorii publicului pe platforma MAX IMOB pot vizualiza proprietăți, dar nu au modalitate directă de a contacta agentul responsabil. Aceasta creează o barieră în comunicarea potențialilor clienți cu agenții, ducând la pierderea unor oportunități de afaceri. Este necesar un sistem de contact direct, accessible și ușor de utilizat, care să permită oricui să trimită un mesaj agentului cu detaliisale de contact.

---

## 3. Obiective

### Obiective Principale
- Permite vizitatorilor să contacteze direct agentul responsabil de o proprietate
- Salvează mesajele în baza de date pentru acces posterior de către agent
- Oferă o interfață ușor de utilizat prin intermediul unui pop-up modal

### Obiective Secundare
- Validare completă a datelor de intrare
- Mesaje de feedback clar pentru utilizator
- Securitate și prevenirea spam-ului (validări de bază)

---

## 4. Cerințe Funcționale

### CF1: Buton de Contact
- Pe pagina de detalii a unei proprietăți trebuie să existe un buton "Contactează Agent"
- Butonul trebuie să fie vizibil și accesibil pe pagina

### CF2: Pop-up Modal de Contact
- Clicking pe buton deschide un modal cu un formular de contact
- Modalul trebuie să conțină:
  - Câmpul "Nume" (text, obligatoriu)
  - Câmpul "Email" (email, obligatoriu)
  - Câmpul "Telefon" (text, obligatoriu)
  - Câmpul "Mesaj" (textarea, obligatoriu)
  - Buton "Trimite Mesaj" (submit)
  - Buton "Anulează" (close modal)

### CF3: Salvare Mesaj în Bază de Date
- Mesajele trimise trebuie salvate în tabelul `messages`
- Fiecare mesaj salvat trebuie să conțină:
  - ID unic
  - ID proprietate
  - ID agent (preluat din proprietate)
  - Nume Contact
  - Email Contact
  - Telefon Contact
  - Conținut Mesaj
  - Timestamp creării
  - Status (noi - default: unread)

### CF4: Feedback Utilizator
- După trimiterea cu succes, utilizatorul primește un mesaj de confirmare
- În caz de eroare, utilizatorul primește un mesaj de eroare clar
- Formularul se golește sau modalul se închide automat după succes

### CF5: Validare Client-Side
- Verificare câmpuri obligatorii
- Validare format email
- Validare format telefon (doar cifre și caractere permise)
- Lungime maximă pentru mesaj (5000 caractere)
- Lungime minimă pentru mesaj (10 caractere)

---

## 5. Cerințe Non-Funcționale

### NF1: Performanță
- Salvarea unui mesaj nu trebuie să dureze mai mult de 2 secunde
- Interfața trebuie să răspundă instantaneu la interacțiuni

### NF2: Securitate
- Validare server-side a tuturor datelor
- Escape-uri SQL pentru prevenirea injection
- Rate limiting básic (max 5 mesaje/IP/oră - implementare viitoare)
- Validare CORS dacă e necesară

### NF3: Usabilitate
- Interfață simplă și intuitiva, conform standardelor Bootstrap
- Mobile-friendly design
- Accesibilitate básică (labels, semantica HTML)

### NF4: Fiabilitate
- Mesajele trebuie să fie durable și persistente
- Nu trebuie pierdute date în caz de eroare

---

## 6. User Stories

### US1: Vizitator Interesat
> Ca vizitator interesat de o proprietate, vreau să contactez direct agentul pentru a afla mai multe informații, fără a trebui să mă înregistrez.

**Criterii de Acceptare:**
- Pot vedea butonul "Contactează Agent" pe pagina proprietății
- Pot deschide formularul fără fricțiuni
- Mesajul meu este salvat și confirmat

### US2: Agent
> Ca agent, vreau să primesc mesajele de la potențiali clienți într-un loc central, să pot vedea contactele lor și conținutul mesajelor.

**Criterii de Acceptare:**
- Pot accesa o secțiune cu mesajele primite
- Pot vedea toate detaliile contactului și mesajul
- Pot marca mesaje ca citite

### US3: Admin
> Ca admin, vreau să am vizibilitate asupra tuturor mesajelor din sistem pentru monitorizare.

**Criterii de Acceptare:**
- Pot vedea statistici generale despre mesaje
- Pot audita mesajele dacă e nevoie

---

## 7. Designul Sistemului

### 7.1 Designul Backend

#### Endpoint: POST /api/properties/[id]/messages
- **Metoda**: POST
- **Autentificare**: Nu (public)
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "message": "string"
  }
  ```

- **Response (Success - 201)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "msg-uuid",
      "propertyId": "prop-uuid",
      "name": "string",
      "email": "string",
      "phone": "string",
      "message": "string",
      "status": "unread",
      "createdAt": "2026-06-02T12:00:00Z"
    },
    "error": null
  }
  ```

- **Response (Error - 400/500)**:
  ```json
  {
    "success": false,
    "data": null,
    "error": "Descriere eroare"
  }
  ```

#### Controller: PropertyMessagesController
- `createMessage(propertyId, body)` - Crează și salvează mesajul

#### Service: PropertyMessagesService
- `saveMessage(propertyId, messageData)` - Logica de salvare
- `validateMessageData(data)` - Validare

---

### 7.2 Designul Frontend

#### Componente:
1. **ContactAgentButton** - Buton care deschide modalul
2. **ContactAgentModal** - Modal wrapper cu formular
3. **ContactAgentForm** - Formular cu validari

#### State Management:
- `isModalOpen` - boolean, control modal
- `formData` - separate state vars: `name`, `email`, `phone`, `message`
- `loading` - boolean, pentru submit
- `errorMessage` - string, pentru erori
- `successMessage` - string, pentru succes

#### Flow:
1. User vede buton pe pagina proprietății
2. User clică buton → modal se deschide
3. User completează formular
4. User clică "Trimite" → validare client-side
5. Dacă valid → POST la API
6. Server salvează și returneaza răspuns
7. Frontend afișează succes/eroare
8. Modalul se închide după succes

---

## 8. Designul Bazei de Date

### Tabel: messages
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES properties(id),
  agent_id TEXT NOT NULL REFERENCES users(id),
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  message_content TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX messages_property_id_idx ON messages(property_id);
CREATE INDEX messages_agent_id_idx ON messages(agent_id);
CREATE INDEX messages_status_idx ON messages(status);
```

---

## 9. Data Flow

1. **Frontend → Backend**
   - Utilizatorul completează formular pe pagina /properties/[id]
   - Clică "Trimite Mesaj"
   - Validare client-side
   - POST request la `/api/properties/[id]/messages`

2. **Backend Processing**
   - Express controller primește request
   - Validare server-side completa
   - Extrage `agent_id` din proprietate
   - Genereaza ID unic pentru mesaj
   - Service salvează în database
   - Returnează răspuns JSON

3. **Database**
   - Mesajul se inserează în tabelul `messages`
   - Timestamps se setează automat

4. **Response → Frontend**
   - Frontend primește răspuns
   - Dacă succes: afișează mesaj, golește form, închide modal
   - Dacă eroare: afișează mesaj de eroare

---

## 10. Reguli de Validare

### Validare Client-Side
- **Nume**: Obligatoriu, 2-100 caractere
- **Email**: Obligatoriu, format email valid (regex simplu)
- **Telefon**: Obligatoriu, 10-20 caractere, doar cifre și caractere: +, -, spațiu
- **Mesaj**: Obligatoriu, 10-5000 caractere

### Validare Server-Side
- Aceleași reguli ca client-side
- Verificare că proprietatea există
- Verificare că proprietatea este publică (status = 'publicata')
- Escape-uri SQL

---

## 11. Considerații de Securitate

- **SQL Injection**: Validare și prepared statements în queries
- **XSS**: Escape HTML output, sanitizare input
- **Rate Limiting**: (viitor) Max 5 mesaje per IP pe oră
- **Validare Input**: Strict pe server-side
- **CORS**: Dacă e necesară, configurare pentru domenii sigure
- **Logging**: Opțional - log mesajelor trimise pentru audit

---

## 12. Cazuri Extreme

### CE1: Proprietate Inactivă
- Dacă proprietatea nu este publicată (status != 'publicata'), mesajul NU se acceptă
- Response: 400 Bad Request cu mesaj "Proprietatea nu este disponibilă"

### CE2: Agent Inactiv
- Dacă agentul nu este activ, mesajul se acceptă și salvează oricum
- (Viitor: notificare către agent)

### CE3: Email Nevalid
- Validare server-side riguroasă
- Response: 400 Bad Request cu mesaj specific

### CE4: Mesaj Prea Lung
- Truncare sau respingere - alegem respingere
- Response: 400 Bad Request

### CE5: Spam / Rate Limiting
- (Viitor) IP-based rate limiting

---

## 13. Criterii de Acceptare

- [x] Tabelul `messages` este creat în database
- [ ] API endpoint POST /api/properties/[id]/messages este funcțional
- [ ] Validare server-side completă implementată
- [ ] Frontend are buton "Contactează Agent" pe detalii proprietate
- [ ] Modal se deschide/închide corect
- [ ] Formular are toate câmpurile necesare
- [ ] Validare client-side funcționează
- [ ] Mesajele sunt salvate în database
- [ ] Feedback succes/eroare este afișat corect
- [ ] Interfața este responsivă (mobile-friendly)
- [ ] Testare manuală completa

---

## 14. Îmbunătățiri Viitoare

- **Email Notifications**: Notificare email către agent când primește mesaj
- **Rate Limiting**: Limitare mesaje pe IP
- **Message Management UI**: Dashboard pentru agenti unde pot vizualiza mesaje
- **Admin Panel**: Vizibilitate pentru admin asupra tuturor mesajelor
- **Attachment Support**: Posibilitate de a atașa fișiere (viitor)
- **Auto-reply**: Mesaj automat de confirmare
- **Categorization**: Categorii de mesaje (întrebare, ofertă, etc.)
- **Analytics**: Statistici despre mesaje pe proprietate/agent

---

## Status: ⏳ ÎN AȘTEPTAREA APROBĂRII

Aștept aprobarea acestei specificații înainte de a trece la implementare.
