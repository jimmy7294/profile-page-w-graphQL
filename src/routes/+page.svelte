<script>
  import { onMount } from "svelte";

  let userData;

  const query = `{
      user {
        id
        login
      }
    }`;

  onMount(async () => {
    const response = await fetch(
      "https://01.gritlab.ax/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );
    const result = await response.json();
    userData = result.data.user;
  });
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<h1>User Data</h1>

{#if userData}
  <ul>
    {#each userData as user}
      <li>
        ID: {user.id}, Login: {user.login}
      </li>
    {/each}
  </ul>
{:else}
  <p>Loading...</p>
{/if}
