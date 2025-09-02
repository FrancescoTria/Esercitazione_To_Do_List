// =======================
// Stato applicazione
// =======================
let tasks = [];
let nextId = 1;
let currentFilter = 'all'; // 'all' | 'todo' | 'done'

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

// =======================
// Avvio
// =======================
refreshList();
updateFilterBtnUI();

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
function visibleTasks() {
    if (currentFilter === 'todo') return tasks.filter(t => !t.completed);
    if (currentFilter === 'done') return tasks.filter(t => t.completed);
    return tasks.slice();
}
function updateFilterBtnUI() {
    if (!filterBtn) return;
    const label = filterBtn.querySelector('.filter-label');
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
function cycleFilter() {
    currentFilter = currentFilter === 'all' ? 'todo'
        : currentFilter === 'todo' ? 'done'
            : 'all';
    updateFilterBtnUI();
    refreshList();
}

// Aggiorna la UI di un singolo <li> in base allo stato completato
function applyCompletedUI(li, isCompleted) {
    const text = li.querySelector('.task-text');
    const completeBtn = li.querySelector('.complete-btn');
    const badges = li.querySelectorAll('.task-meta .badge');

    if (text) text.classList.toggle('completed', isCompleted);
    li.classList.toggle('completed-item', isCompleted);
    badges.forEach(b => b.classList.toggle('badge-done', isCompleted));

    if (completeBtn) {
        completeBtn.innerHTML = isCompleted
            ? '<i class="bi bi-check2-circle"></i>'
            : '<i class="bi bi-check2"></i>';
        completeBtn.className = isCompleted
            ? 'btn btn-success complete-btn'
            : 'btn btn-outline-secondary complete-btn';
        completeBtn.setAttribute('data-bs-title', isCompleted ? 'Segna come incompleto' : 'Segna come completato');
        refreshTooltip(completeBtn);
    }

    li.classList.add('completed-pop');
    setTimeout(() => li.classList.remove('completed-pop'), 220);
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

    const task = { id: nextId++, text, start, end, completed: false };
    tasks.push(task);

    refreshList();
    form.reset();
    input.focus();
});

filterBtn?.addEventListener('click', () => {
    cycleFilter();
});

list.addEventListener('click', (e) => {
    // Completa / Incompleta
    const completeBtn = e.target.closest('.complete-btn');
    if (completeBtn) {
        e.preventDefault();
        e.stopPropagation();
        const li = completeBtn.closest('li');
        const id = Number(li?.dataset?.id);
        if (!id) return;

        const t = tasks.find(x => x.id === id);
        if (!t) return;

        t.completed = !t.completed;

        // Se l'elemento non appartiene più al filtro corrente, fade-out e poi refresh
        const willDisappear = (currentFilter === 'todo' && t.completed) ||
            (currentFilter === 'done' && !t.completed);
        if (willDisappear) {
            li.classList.add('removing');
            li.addEventListener('animationend', () => refreshList(), { once: true });
        } else {
            applyCompletedUI(li, t.completed);
            updateCounter();
        }
        return;
    }

    // Elimina
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        e.preventDefault();
        e.stopPropagation();

        const li = deleteBtn.closest('li');
        const id = Number(li?.dataset?.id);
        if (!id) return;

        const span = li.querySelector('.task-text');
        if (span) {
            span.classList.add('completed');
            span.style.textDecoration = 'line-through';
            span.style.color = '#6c757d';
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    void li.offsetWidth;
                    li.classList.add('removing');
                }, 220);
            });
        });

        let removed = false;
        const reallyRemove = () => {
            if (removed) return;
            removed = true;
            tasks = tasks.filter(t => t.id !== id);
            refreshList();
        };
        li.addEventListener('animationend', (ev) => {
            if (ev.animationName === 'itemFadeOut') reallyRemove();
        }, { once: true });
        setTimeout(reallyRemove, 900);
    }
});

// =======================
// Rendering
// =======================
function refreshList() {
    list.innerHTML = '';
    visibleTasks().forEach(renderItem);
    updateCounter();
    toggleEmptyState();
}

function renderItem(task) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.dataset.id = task.id;

    // Colonna sinistra: titolo + meta date
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

    // Spacer
    const spacer = document.createElement('div');
    spacer.className = 'flex-grow-1';

    // Bottone COMPLETA
    const completeBtn = document.createElement('button');
    completeBtn.type = 'button';
    completeBtn.className = task.completed ? 'btn btn-success complete-btn' : 'btn btn-outline-secondary complete-btn';
    completeBtn.setAttribute('aria-label', task.completed ? 'Segna come incompleto' : 'Segna come completato');
    completeBtn.setAttribute('data-bs-toggle', 'tooltip');
    completeBtn.setAttribute('data-bs-title', task.completed ? 'Segna come incompleto' : 'Segna come completato');
    completeBtn.innerHTML = task.completed ? '<i class="bi bi-check2-circle"></i>' : '<i class="bi bi-check2"></i>';

    // Bottone ELIMINA
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn btn-light delete-btn';
    delBtn.setAttribute('aria-label', 'Elimina');
    delBtn.setAttribute('data-bs-toggle', 'tooltip');
    delBtn.setAttribute('data-bs-title', 'Elimina');
    delBtn.innerHTML = '<i class="bi bi-x-lg"></i>';

    // Layout riga
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.gap = '.5rem';

    li.appendChild(left);
    li.appendChild(spacer);
    li.appendChild(completeBtn);
    li.appendChild(delBtn);

    // Stato iniziale se già completato
    if (task.completed) {
        li.classList.add('completed-item');
        meta.querySelectorAll('.badge').forEach(b => b.classList.add('badge-done'));
    }

    list.prepend(li);

    // Tooltips
    initTooltip(completeBtn);
    initTooltip(delBtn);
}

// =======================
// UI helpers
// =======================
function updateCounter() {
    const tot = tasks.length;
    const done = tasks.filter(t => t.completed).length;

    counter.innerHTML = tot
        ? `<span class="badge text-bg-primary"><i class="bi bi-check2 me-1"></i>${done} completati</span>
       <span class="badge text-bg-secondary"><i class="bi bi-list-ul me-1"></i>${tot} totali</span>`
        : `<span class="badge text-bg-light text-secondary">Vuoto</span>`;
}
function toggleEmptyState() {
    emptyState.style.display = visibleTasks().length ? 'none' : 'block';
}
