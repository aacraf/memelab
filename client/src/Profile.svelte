<script>

    // Obtener usuarios
    const fetchUsers = (async () => {
        const response = await fetch('http://localhost:8000/api/users');
        return await response.json()
    })()
</script>

<p>Este es mi perfil</p>

<!-- {users} -->

{#await fetchUsers}
	<p>...waiting</p>
{:then users}
    <ul>
        {#each users.data as user}
            <li>
                {user.email}
        </li>  

        {/each}
    </ul>
{:catch error}
	<p>An error occurred!</p>
{/await}

