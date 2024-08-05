import Options from "../components/Options.svelte";
import { storage } from "../storage";
import "../tailwind.css";

// Action popup
// https://developer.chrome.com/docs/extensions/reference/action/

function render() {
    const target = document.getElementById("app");

    if (target) {
        storage.get().then(({ user }) => {
            new Options({
                target,
                props: { user },
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", render);
