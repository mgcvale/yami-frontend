import { writable, type Writable } from "svelte/store";
import type ComboBoxEntry from "../types/comboBoxEntry";
import { MapPinHouse, Sandwich, User } from "@lucide/svelte";

export const searchOptions: Record<string, ComboBoxEntry> = {
    user: { name: "User", icon: User, value: "user" },
    food: { name: "Food", icon: Sandwich, value: "food" },
    restaurant: { name: "Restaurant", icon: MapPinHouse, value: "restaurant" },
};
  
export const searchingFor: Writable<ComboBoxEntry> = writable(searchOptions['user']);