<script>

    import { user } from './userStore.js';

    let myUser;

    user.subscribe(function (newUser) {
        myUser = newUser;
    });


    // Obtener usuarios
    const fetchUser = (async () => {
        const response = await fetch(`http://localhost:8000/api/users/${myUser}`);
        return await response.json()
    })()
</script>

<p>Este es mi perfil</p>


{#await fetchUser}
	<p>...waiting</p>
{:then user}
    <p>{user.data.username}</p>
    <p>{user.data.email}</p>
{:catch error}
	<p>An error occurred!</p>
{/await}

