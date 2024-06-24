<script lang="ts">
  let inputValue = '';

  function handleSubmit(e: Event) {
    e.preventDefault();
    // Handle form submission here
    console.log('Submitted:', inputValue);
  }
</script>

<form on:submit={handleSubmit}>
  <input type="text" bind:value={inputValue} placeholder="Enter your note" />
  <button type="submit">Submit</button>
</form>