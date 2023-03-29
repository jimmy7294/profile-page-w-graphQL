<script>
  import { onMount } from "svelte";

  let userData;
  let transactionsData;

  const query = `{
    user(where: { login: { _eq: "minhtuann" }}) {
      id
      login
      transactions {
        objectId
        path
        amount
      }
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
    transactionsData = userData[0].transactions;
  });
</script>

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

<h1>Transactions</h1>

{#if transactionsData}
  <ul>
    {#each transactionsData as transaction}
      <li>
        Object ID: {transaction.objectId}, Path: {transaction.path}, Amount: {transaction.amount}
      </li>
    {/each}
  </ul>
{:else}
  <p>Loading...</p>
{/if}
