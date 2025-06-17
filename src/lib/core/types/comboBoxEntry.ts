import type { Component } from "@lucide/svelte";

export default interface ComboBoxEntry {
    name: string,
    icon?: Component,
    value: string,
};