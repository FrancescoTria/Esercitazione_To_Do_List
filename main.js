// main.js
import { useMap, useList, getManager } from './controllo.js';

// =======================
// Stato UI (filtri, ricerca, ordinamento)
// =======================
let currentFilter = 'all';   // 'all' | 'todo' | 'done'
let currentSort = 'desc';    // 'desc' | 'asc'
let searchQuery = '';

// =======================
// Riferimenti DOM
// =======================
const form = document.getElementById('taskForm');
const input = document.getElementById('taskInput');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const list = document.getElementById('taskList');
const counter = document.getElementById('counter');
const emptyState = document.getElementById('emptyState');

const filterBtn = document.getElementById('filterBtn');
const sortBtn = document.getElementById('sortBtn');
const searchInput = document.getElementById('searchInput');

const markAllBtn = document.getElementById('markAllBtn');
const removeCompletedBtn = document.getElementById('removeCompletedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

const modeSwitch = document.getElementById('modeSwitch');

// =======================
// Utils
// =======================
function formatDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}
function clearValidation() {
    [input, startDate, endDate].forEach(el => el.classList.remove('is-invalid', 'is-valid'));
}
function markInvalid(el, message) {
    el.classList.add('is-invalid');
    const fb = el.nextElementSibling;
    if (fb && fb.classList.contains('invalid-feedback') && message) fb.textContent = message;
}
function initTooltip(el) {
    if (window.bootstrap?.Tooltip) new bootstrap.Tooltip(el);
}
function refreshTooltip(el) {
    if (!window.bootstrap?.Tooltip) return;
    const inst = bootstrap.Tooltip.getInstance(el);
    if (inst) inst.dispose();
    new bootstrap.Tooltip(el);
}
function updateFilterBtnUI() {
    if (!filterBtn) return;
    if (currentFilter === 'all') {
        filterBtn.className = 'btn btn-outline-secondary';
        filterBtn.innerHTML = '<i class="bi bi-funnel me-1"></i><span class="filter-label">Mostra: Tutte</span>';
    } else if (currentFilter === 'todo') {
        filterBtn.className = 'btn btn-outline-primary';
        filterBtn.innerHTML = '<i class="bi bi-funnel me-1"></i><span class="filter-label">Mostra: Non completate</span>';
    } else {
        filterBtn.className = 'btn btn-outline-success';
        filterBtn.innerHTML = '<i class="bi bi-funnel me-1"></i><span class="filter-label">Mostra: Completate</span>';
    }
    refreshTooltip(filterBtn);
}
function updateSortBtnUI() {
    if (!sortBtn) return;
    if (currentSort === 'desc') {
        sortBtn.className = 'btn btn-outline-secondary';
        sortBtn.innerHTML = '<i class="bi bi-sort-down me-1"></i><span class="sort-label">Ordina: Nuove → Vecchie</span>';
        sortBtn.setAttribute('data-bs-title', 'Ordina per data: più recenti prima');
    } else {
        sortBtn.className = 'btn btn-outline-secondary';
        sortBtn.innerHTML = '<i class="bi bi-sort-up me-1"></i><span class="sort-label">Ordina: Vecchie → Nuove</span>';
        sortBtn.setAttribute('data-bs-title', 'Ordina per data: più vecchie prima');
    }
    refreshTooltip(sortBtn);
}
function cycleFilter() {
    currentFilter = currentFilter === 'all' ? 'todo'
        : currentFilter === 'todo' ? 'done'
            : 'all';
    updateFilterBtnUI();
    render();
}
function cycleSort() {
    currentSort = currentSort === 'desc' ? 'asc' : 'desc';
    updateSortBtnUI();
    render();
}

// =======================
// Event Listeners
// =======================
[input, startDate, endDate].forEach(el => {
    el.addEventListener('input', () => el.classList.remove('is-invalid'));
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearValidation();

    const text = input.value.trim();
    const start = startDate.value;
    const end = endDate.value;

    let valid = true;
    if (!text) { markInvalid(input, 'Inserisci un titolo.'); valid = false; }
    if (!start) { markInvalid(startDate, 'Serve la data di inizio.'); valid = false; }
    if (!end) { markInvalid(endDate, 'Serve la data di fine.'); valid = false; }
    if (valid && end < start) {
        markInvalid(endDate, 'La fine deve essere uguale o successiva all’inizio.');
        valid = false;
    }
    if (!valid) return;

    getManager().addTask(text, start, end);

    form.reset();
    input.focus();
    render();
});

filterBtn?.addEventListener('click', cycleFilter);
sortBtn?.addEventListener('click', cycleSort);

searchInput?.addEventListener('input', () => {
    searchQuery = searchInput.value;
    render();
});

markAllBtn?.addEventListener('click', () => { getManager().markAll(); render(); });
removeCompletedBtn?.addEventListener('click', () => { getManager().removeCompleted(); render(); });
clearAllBtn?.addEventListener('click', () => { getManager().clearAll(); render(); });

// Event delegation su lista
list.addEventListener('click', (e) => {
    const completeBtn = e.target.closest('.complete-btn');
    if (completeBtn) {
        const li = completeBtn.closest('li');
        const id = li?.dataset?.id;
        if (id) getManager().toggleDone(id);
        render();
        return;
    }
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const li = deleteBtn.closest('li');
        const id = li?.dataset?.id;
        if (id) getManager().removeTask(id);
        render();
    }
});

// Switch Lista/Mappa
modeSwitch?.addEventListener('change', () => {
    const label = document.querySelector('.mode-label');
    const icon = modeSwitch.nextElementSibling.querySelector('i');

    if (modeSwitch.checked) {
        useMap();
        label.textContent = "Mappa";
        icon.className = "bi bi-diagram-3";
    } else {
        useList();
        label.textContent = "Lista";
        icon.className = "bi bi-list-ul";
    }
    render();
});



// =======================
// Rendering
// =======================
function render() {
    list.innerHTML = '';

    const q = searchQuery.trim().toLowerCase();
    let items = [];
    for (const t of getManager().getAll()) {
        const matchFilter = currentFilter === 'all'
            ? true
            : currentFilter === 'todo' ? !t.completed : t.completed;
        const matchSearch = !q || t.text.toLowerCase().includes(q);
        if (matchFilter && matchSearch) items.push(t);
    }

    items.sort((a, b) => {
        const sa = a.start || '';
        const sb = b.start || '';
        if (sa !== sb) return currentSort === 'desc' ? sb.localeCompare(sa) : sa.localeCompare(sb);
        return currentSort === 'desc' ? Number(b.id) - Number(a.id) : Number(a.id) - Number(b.id);
    });

    for (const task of items) {
        renderItem(task);
    }

    const allTasks = getManager().getAll();
    let tot = allTasks.length;
    let done = allTasks.filter(t => t.completed).length;

    counter.innerHTML = tot
        ? `<span class="badge text-bg-primary"><i class="bi bi-check2 me-1"></i>${done} completati</span>
           <span class="badge text-bg-secondary"><i class="bi bi-list-ul me-1"></i>${tot} totali</span>`
        : `<span class="badge text-bg-light text-secondary">Vuoto</span>`;

    emptyState.style.display = items.length ? 'none' : 'block';

    refreshTooltip(filterBtn);
    refreshTooltip(sortBtn);
}

function renderItem(task) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.dataset.id = task.id;

    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.flexDirection = 'column';
    left.style.gap = '.2rem';

    const titleRow = document.createElement('div');
    titleRow.style.display = 'flex';
    titleRow.style.alignItems = 'center';
    titleRow.style.gap = '.5rem';

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;
    if (task.completed) text.classList.add('completed');

    titleRow.appendChild(text);

    const meta = document.createElement('div');
    meta.className = 'task-meta';
    meta.innerHTML = `
        <span class="badge text-bg-light border"><i class="bi bi-play-fill me-1"></i>Inizio: ${formatDate(task.start)}</span>
        <span class="badge text-bg-light border"><i class="bi bi-flag me-1"></i>Fine: ${formatDate(task.end)}</span>
    `;

    left.appendChild(titleRow);
    left.appendChild(meta);

    const spacer = document.createElement('div');
    spacer.className = 'flex-grow-1';

    const completeBtn = document.createElement('button');
    completeBtn.type = 'button';
    completeBtn.className = task.completed ? 'btn btn-success complete-btn' : 'btn btn-outline-secondary complete-btn';
    completeBtn.setAttribute('aria-label', task.completed ? 'Segna come incompleto' : 'Segna come completato');
    completeBtn.setAttribute('data-bs-toggle', 'tooltip');
    completeBtn.setAttribute('data-bs-title', task.completed ? 'Segna come incompleto' : 'Segna come completato');
    completeBtn.innerHTML = task.completed ? '<i class="bi bi-check2-circle"></i>' : '<i class="bi bi-check2"></i>';

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn btn-light delete-btn';
    delBtn.setAttribute('aria-label', 'Elimina');
    delBtn.setAttribute('data-bs-toggle', 'tooltip');
    delBtn.setAttribute('data-bs-title', 'Elimina');
    delBtn.innerHTML = '<i class="bi bi-x-lg"></i>';

    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.gap = '.5rem';

    li.appendChild(left);
    li.appendChild(spacer);
    li.appendChild(completeBtn);
    li.appendChild(delBtn);

    if (task.completed) {
        li.classList.add('completed-item');
        meta.querySelectorAll('.badge').forEach(b => b.classList.add('badge-done'));
    }

    list.appendChild(li);

    initTooltip(completeBtn);
    initTooltip(delBtn);
}

// =======================
// Avvio
// =======================
updateFilterBtnUI();
updateSortBtnUI();
render();
