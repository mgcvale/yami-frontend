import Cookies from "js-cookie";
import { writable, type Writable } from "svelte/store";

export let currentThemeLight: Writable<boolean> = writable(false);

export function initializeThemeManager(doc: Document) {
    const html = doc.documentElement;

    const cookieValue = Cookies.get("light");
    const light = cookieValue === "true";
    currentThemeLight.set(light);

    currentThemeLight.set(light);

    if (light) {
        html.classList.remove("dark");
    } else {
        html.classList.add("dark");
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.attributeName === "class") {
                currentThemeLight.set(!html.classList.contains("dark"));
            }
        }
    });

    observer.observe(html, {
        attributes: true,
        attributeFilter: ["class"]
    });

    currentThemeLight.subscribe(light => {
        if (typeof document === "undefined") return;
        const html = document.documentElement;
        const hasDark = html.classList.contains("dark");

        if (light && hasDark) {
            html.classList.remove("dark");
        } else if (!light && !hasDark) {
            html.classList.add("dark");
        }

        Cookies.set("light", light.toString(), { expires: 365 });
    });

}
