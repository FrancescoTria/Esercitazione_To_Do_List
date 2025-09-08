// controllo.js
import { TaskMap } from './mappa.js';
import { TaskList } from './lista.js';

let taskManager = new TaskMap(); // default: Mappa

export function useMap() {
    taskManager = new TaskMap();
}
export function useList() {
    taskManager = new TaskList();
}
export function getManager() {
    return taskManager;
}
