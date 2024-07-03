<script lang="ts">
  import { Input } from '$lib/components/ui/input/index.js';
  import axios from 'axios'
  import { onMount } from 'svelte';

  let isProcessing = false
  let inputValue = '';
  let authorTargetNotes = []
  export let targetUsername: string

  
  const getAuthorTargetNotesViaLocalStorage = async () => {
    const { authorTargetNotes: notes } = await chrome.storage.local.get('authorTargetNotes');
    if (!notes[targetUsername] || notes.length < 1) return
    authorTargetNotes = notes[targetUsername]
    console.log('first authorTargetNotes:', authorTargetNotes)
  }

  onMount(getAuthorTargetNotesViaLocalStorage)

  console.log('UserNoteInput targetUsername:', targetUsername)
  async function handleSubmit(e: Event) {
    e.preventDefault();
    isProcessing = true;
    // get selfUsername from localStorage
    const { selfUsername } = await chrome.storage.local.get('selfUsername');
    console.log('UserNoteInput selfUsername:', selfUsername)
    // Handle form submission here
    try {
      await axios.post(`${import.meta.env.VITE_API_DOMAIN}/notes`, {
        note: inputValue,
        author: selfUsername,
        target: targetUsername
      });
    } catch (err) {
      console.error(err);
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="twp">
  <form on:submit={handleSubmit} class='user-note-input mt-2'>
    <div class="notes-wrap flex flex-col">
      {#if authorTargetNotes.length > 0}
        <div class="notes-list">
          <ul class="list-disc">
            {#each authorTargetNotes as note}
              <li class="note-text"><em>{note.note}</em></li>
            {/each}
          </ul>
        </div>
      {:else}
      <div class="note-row flex flex-row">
        <Input
          autofocus
          type="text"
          bind:value={inputValue}
          placeholder="Note"
          class={`max-w-xs loading`}
        />
        <svg

          width="24"
          height="24"
          viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
          class={`stroke-white fill-white self-center ml-3 ${isProcessing ? 'visible' : 'invisible'}`}
        >
          <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
          <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z" class="spinner_z9k8"/>
        </svg>
      </div>
      {/if}

    </div>
  </form>
</div>

<style>
  .spinner_z9k8{
    transform-origin:center;
    animation:spinner_StKS .75s infinite linear;
  }
    @keyframes spinner_StKS{100%{transform:rotate(360deg)}
  }
</style>