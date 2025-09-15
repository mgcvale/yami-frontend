import type { Component } from "svelte";

export default interface TabControlEntry {
    name: string,
    value: any,
    icon: Component | null
};