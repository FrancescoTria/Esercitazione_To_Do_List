// mappa.js
export class TaskMap {
    constructor() {
        this.tasks = new Map();
        this.nextId = 1;
    }

    addTask(text, start, end) {
        const id = String(this.nextId++);
        const task = { id, text, start, end, completed: false, createdAt: Date.now() };
        this.tasks.set(id, task);
        return task;
    }

    toggleDone(id) {
        const t = this.tasks.get(id);
        if (t) t.completed = !t.completed;
    }

    removeTask(id) {
        this.tasks.delete(id);
    }

    markAll() {
        for (const t of this.tasks.values()) t.completed = true;
    }

    removeCompleted() {
        for (const [id, t] of this.tasks) if (t.completed) this.tasks.delete(id);
    }

    clearAll() {
        this.tasks.clear();
    }

    getAll() {
        return Array.from(this.tasks.values());
    }
}
