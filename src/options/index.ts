import Popup from "../components/Popup.svelte";
import { storage } from "../storage";
import "../tailwind.css";

// Options
// https://developer.chrome.com/docs/extensions/mv3/options/

function render() {
    const target = document.getElementById("app");

    if (target) {
        storage.get().then(({ }) => {
            new Popup({
                target,
                props: { user: null },
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", render);
