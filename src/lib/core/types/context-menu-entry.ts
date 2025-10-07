import type { Component } from "svelte";

export default interface ContextMenuEntry {
    name: string;
    icon?: Component;
    action: (c: Event) => void;
    className?: string;
};
