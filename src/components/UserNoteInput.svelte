<script lang="ts">
  import { Input } from '$lib/components/ui/input/index.js';
  import { Button } from "$lib/components/ui/button";
  let inputValue = '';

  function handleSubmit(e: Event) {
    e.preventDefault();
    // Handle form submission here
    console.log('Submitted:', inputValue);
  }
</script>

<div class="twp">
  <form on:submit={handleSubmit} class='user-note-input mt-2'>
    <Input type="text" bind:value={inputValue} placeholder="Note" class="max-w-xs" />
  </form>
</div>