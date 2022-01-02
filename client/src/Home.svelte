<script>
    import { user } from './userStore.js'; 
    import { Figure, Image  } from 'sveltestrap';

    let myUser;
    
    user.subscribe(val => {
        myUser = val;
    });


    const handleLogin = (e) =>{
        e.preventDefault();
        // console.log("valeee");
        // console.log(e.target.username.value);
        // console.log(e.target.password.value);

        fetch('http://localhost:8000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value
            })
        }).then(res => res.json())
        .then(response => {
            console.log(response);
            console.log(response.message);
            if (response.message == "Login success")
            {
                user.set(response.data.username);
                alert(`Welcome ${response.data.username}`); 
            }
            else
            {
                alert("Login failed");   
            }


            // if(data.success){
            //     // alert("Login Successful");
            //     console.log(data.data.username);
            //     // user.set(data.username);
            //     // user.setUser(data.user);
            //     // user.setToken(data.token);
            //     // user.setLoggedIn(true);
            //     // window.location.href = '/';
            // }
            // else{
            //     alert(data.message);
            // }
        })
    }

    const fetchMemes = (async  () => {
        const response = await fetch('http://localhost:8000/api/memes');
        return await response.json();
    })();
</script>

{#if myUser}
<h4> Bienvenido {myUser}</h4>
{:else}

<br/>
<br/>
<br/>

<h5> Tendras que hacer login para acceder </h5>
{/if}


{#await fetchMemes}
	<p>...waiting</p>
{:then memes}
    {#each memes.data as meme}
        <!-- <div class="meme">
            <h3>{meme.name}</h3>
            <img src={meme.image} />
            <span>{meme.author}</span>
            <span>{meme.creation_date}</span>
        </div> -->
        <Figure caption={meme.name}>
            <Image fluid alt={meme.name} src={meme.image} />
        </Figure>
    {/each}
{:catch}
    <p>...error</p>
{/await}


<style>
    /* .meme{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 10px;
    } */
</style>