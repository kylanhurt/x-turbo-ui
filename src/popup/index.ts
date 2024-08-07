import Popup from "../components/Popup.svelte";
import { storage } from "../storage";
import "../tailwind.css";

// Action popup
// https://developer.chrome.com/docs/extensions/reference/action/

function render() {
    const target = document.getElementById("app");
    console.log('popup/index.ts rendering popup')
    if (target) {
        console.log('popup/index.ts target exists')
        storage.get().then(({ user }) => {
            console.log('popup/index.ts storage.get() user:', user)
            new Popup({
                target,
                props: { user },
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", render);
