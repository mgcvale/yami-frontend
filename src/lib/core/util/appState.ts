import { Dice1 } from "@lucide/svelte";
import { writable, type Writable } from "svelte/store";

export interface AppState {
    mouseX: number,
    mouseY: number,
    globalOnMouseMove: ((e: Event) => void)[];
    globalOnTouchStart: ((e: Event) => void)[];
    globalOnClick: ((e: Event) => void)[];
};

export const appState: Writable<AppState> = writable({
    mouseX: 0,
    mouseY: 0,
    globalOnMouseMove: [],
    globalOnTouchStart: [],
    globalOnClick: [],
});

export function loadAppState(doc: Document) {
    doc.addEventListener('mousemove', e => {
        appState.update(old => {
            const copy = { ...old };
            copy.globalOnMouseMove.forEach(fn => fn(e));
            return {
                ...copy,
                mouseX: e.clientX + window.pageXOffset,
                mouseY: e.clientY + window.pageYOffset,
            };
        });
    });
    doc.addEventListener('touchstart', e => {
        appState.update(old => {
            const copy = { ...old };
            copy.globalOnTouchStart.forEach(fn => fn(e));
            return {
                ...copy,
                mouseX: e.touches[0].clientX + window.pageXOffset,
                mouseY: e.touches[0].clientY + window.pageYOffset,
            };
        });
    });
    doc.addEventListener('click', e => {
        appState.update(old => {
            const copy = { ...old };
            copy.globalOnClick.forEach(fn => fn(e));
            return copy;
        });
    })
}