# 📝 To-Do List — HTML/CSS/JS (Bootstrap)

Applicazione **To-Do List** sviluppata in vanilla JavaScript con **Bootstrap 5** e **Bootstrap Icons**.  
Permette di gestire attività con titolo e date, segnarle come completate, ordinarle, filtrare e cancellarle con interfaccia semplice e animazioni leggere.

---

## 🚀 Funzionalità principali

- ➕ **Aggiunta task** con titolo, data inizio e data fine (validate: `fine ≥ inizio`)
- ✅ **Completa/Incompleta**: toggle con un click
- ❌ **Elimina**: effetto barratura → fade-out → rimozione
- 🔍 **Ricerca live** nei titoli
- 🔄 **Filtro ciclico**: Tutte → Non completate → Completate
- 📅 **Ordinamento**: Nuove → Vecchie o viceversa
- ⚡ **Azioni bulk**: segna tutte completate, rimuovi completate, svuota tutto
- 🔀 **Switch Lista/Mappa**: scegli la struttura dati (Array o Map)
- 📱 **Layout responsive** grazie a Bootstrap
- 🎨 **Stile personalizzato** con sfondo, card centrata e animazioni CSS

---

## 📂 Struttura progetto

```
├── index.html    → markup principale con form, toolbar e lista
├── style.css     → personalizzazioni grafiche e animazioni
├── main.js       → logica UI: eventi, rendering e gestione filtri/ordinamenti
├── controllo.js  → gestore centrale che permette di usare lista o mappa
├── lista.js      → implementazione con Array
└── mappa.js      → implementazione con Map
```

---

## ▶️ Come avviare

Clona la repository ed entra nella cartella del progetto:

```bash
git clone https://github.com/tuo-username/tua-repo.git
cd tua-repo
```

Apri `index.html` nel browser e inizia a usare la To-Do List 🚀
