# 📝 To-Do List — HTML/CSS/JS (Bootstrap)

App **To-Do List** in vanilla JavaScript con **Bootstrap 5** e **Bootstrap Icons**.  
Gestisce attività con titolo e date, completamento rapido, filtri, ordinamenti, ricerca live, azioni bulk e dati demo.

---

## 🚀 Funzionalità

- ➕ **Aggiunta task** con titolo, data inizio e data fine  
  • Validazione: `fine ≥ inizio`
- ✅ **Toggle Completa/Incompleta**
- ❌ **Elimina** con feedback visivo
- 🔍 **Ricerca live** sui titoli
- 🔄 **Filtro ciclico**: Tutte → Non completate → Completate
- 📅 **Ordinamento** per data: Nuove → Vecchie o viceversa
- ⚡ **Azioni bulk**: segna tutte completate, rimuovi completate, svuota tutto
- 🔀 **Switch Lista/Mappa**: scegli la struttura dati (Array o Map)
- ☁️ **Dati demo**: caricamento da JSONPlaceholder via `fetch` (bottone “Carica demo” e all’avvio)
- 🧭 **Tooltips robusti** anche su elementi creati dinamicamente
- 📱 **Layout responsive**: toolbar su una riga in desktop, wrap solo sotto 992 px
- 🎨 **UI**: sfondo full-screen, card centrata, badge di conteggio, animazioni leggere

---

## 🧩 Stack

- HTML5, CSS3
- Bootstrap 5 + Bootstrap Icons via CDN
- JavaScript ES Modules (nessun bundler)

---

## 📂 Struttura progetto

├── index.html → markup con navbar, form, toolbar, lista
├── style.css → sfondo full-screen, toolbar responsive, animazioni
├── main.js → logica UI: eventi, rendering, filtri, sort, demo fetch
├── controllo.js → gestore centrale: switch tra lista o mappa
├── lista.js → implementazione con Array
└── mappa.js → implementazione con Map
