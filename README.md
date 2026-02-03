# Gramador Loyalty Application

Această aplicație este o platformă de înregistrare în programul de loialitate **Gramador**, concepută pentru a oferi o experiență de onboarding rapidă și modernă clienților.

## 🚀 Tehnologii Utilizate

Aplicația este construită folosind cele mai moderne tehnologii web pentru performanță și scalabilitate:

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) (pentru o viteză de dezvoltare superioară)
- **Stilizare**: [Tailwind CSS](https://tailwindcss.com/) (design modern și receptiv)
- **Backend / Database**: [Firebase](https://firebase.google.com/) (Firestore pentru stocarea datelor)
- **Autentificare**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Traduceri**: [i18next](https://www.i18next.com/) (Suport multilingv: Română, Engleză)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) (validări complexe și performante)
- **Iconițe**: [Lucide React](https://lucide.dev/)
- **PWA**: Suport pentru _Progressive Web App_ (se poate instala pe telefon ca o aplicație nativă)

## ✨ Funcționalități Principale

- **Formular de Înregistrare**: Colectare date clienți (nume, telefon, email, zi de naștere).
- **Validare în Timp Real**: Validare pentru numere de telefon (format RO și internațional) și câmpuri obligatorii.
- **Multi-language**: Suport complet pentru Română și Engleză, cu detecție automată a limbii browserului.
- **Design Receptiv (Mobile-First)**: Optimizat pentru tabletele de la punctele de vânzare și pentru telefoanele mobile.
- **Securitate**: Datele sunt salvate în Firestore și sunt protejate prin reguli de securitate care necesită autentificare.
- **Interfață Premium**: Micro-animații, moduri de încărcare (loading states) și overlay-uri de succes.

## 🛠️ Dezvoltare Locală

Pentru a rula proiectul pe calculatorul tău:

1. **Instalează dependințele**:

   ```bash
   npm install
   ```

2. **Pornește serverul de dezvoltare**:

   ```bash
   npm run dev
   ```

   Aplicația va fi disponibilă la `http://localhost:5173`.

3. **Verificare cod (Linting)**:
   ```bash
   npm run lint
   ```

## 📦 Build și Deployment

### Producție

Pentru a genera fișierele optimizate pentru producție:

```bash
npm run build
```

Fișierele rezultate vor fi în folderul `/dist`.

### Deploy pe Firebase

Aplicația este configurată pentru a fi găzduită pe Firebase Hosting.

```bash
# Asigură-te că ești logat
firebase login

# Încarcă aplicația și regulile firestore
firebase deploy
```

Poți monitoriza statusul deployment-ului în [Consola Firebase](https://console.firebase.google.com/project/gramador-dc5a5/hosting).

## 🔒 Autentificare și Securitate

### Firebase Auth

Accesul în aplicație și drepturile de scriere în baza de date sunt gestionate prin **Firebase Authentication**.

- **Metoda actuală**: Autentificare bazată pe **Email și Parolă**.
- **Gestionare**: Utilizatorii (conturile de admin/staff) trebuie creați direct în [Consola Firebase > Authentication](https://console.firebase.google.com/project/gramador-dc5a5/authentication/users) pentru a putea accesa funcționalitățile de înregistrare clienți.

### Firestore Rules

Regulile de securitate sunt configurate în `firestore.rules`. În prezent, accesul la colecția `loyalty` este permis **doar utilizatorilor autentificați**.

```javascript
match /loyalty/{document=**} {
  allow read, write: if request.auth != null;
}
```

## 📱 PWA (Progressive Web App)

Datorită configurării PWA, utilizatorii pot:

1. Să deschidă site-ul în Safari (iOS) sau Chrome (Android).
2. Să apese pe "Add to Home Screen".
3. Să folosească aplicația fără interfața browserului, având un aspect de aplicație nativă.

---

Proiect dezvoltat pentru **Gramador**.
