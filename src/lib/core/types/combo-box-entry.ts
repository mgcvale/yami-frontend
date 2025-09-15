import type { Component } from "svelte";

export default interface ComboBoxEntry {
    name: string,
    icon?: Component,
    value: string,
};