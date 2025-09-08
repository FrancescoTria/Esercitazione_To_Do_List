// lista.js
export class TaskList {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
    }

    addTask(text, start, end) {
        const id = String(this.nextId++);
        const task = { id, text, start, end, completed: false, createdAt: Date.now() };
        this.tasks.push(task);
        return task;
    }

    toggleDone(id) {
        const t = this.tasks.find(t => t.id === id);
        if (t) t.completed = !t.completed;
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
    }

    markAll() {
        this.tasks.forEach(t => t.completed = true);
    }

    removeCompleted() {
        this.tasks = this.tasks.filter(t => !t.completed);
    }

    clearAll() {
        this.tasks = [];
    }

    getAll() {
        return [...this.tasks];
    }
}
