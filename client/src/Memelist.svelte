
<script>
    import App from "./App.svelte";
    import  Meme  from './Meme.svelte';
    import { Button, Container, Col, Row } from 'sveltestrap';
    import { navigate } from 'svelte-navigator';
    import { user } from './userStore';
    import { onMount } from 'svelte';

    export let id;
    export let typeView;
    export let meme_id;
    let myUser;
    let memeAdded = false;

    user.subscribe((val) => {
        myUser = val;
    });

    onMount(async () => {

        await fetch(`http://localhost:8000/api/memelists/${id}/get_meme`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                meme_id: meme_id
            })
        })
        .then(res => res.json())
        .then(response => {
            memeAdded = response.data;
        })
        .catch(error => console.log(error))
	});

    const fetchMemelist = ( async () => {
        const response = await fetch('http://localhost:8000/api/memelists/'+id);
        return await response.json();
    })();
    
    const fetchMemes = ( async () => {
        console.log("Getting memes...");
        const response = await fetch('http://localhost:8000/api/memelists/'+id+'/memes');	
        return await response.json();
    })();


    // adding a meme to a memelist
    async function handleAddToMemelist(e) {
        await fetch(`http://localhost:8000/api/memelists/${id}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                meme_id: meme_id
            })
        })
        .then(res => res.json())
        .then(response => {
            memeAdded = response.data;
        })
        .catch(err => console.log(err));
    }

    async function deleteMemelist(e) {
        await fetch(`http://localhost:8000/api/memelists/${id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(response => {
            navigate('/memelists');
        })
        .catch(err => console.log(err));
    }

    async function handleDeleteMemeInMemelist(e) {
        await fetch(`http://localhost:8000/api/memelists/${id}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                meme_id: meme_id
            })
        })
        .then(res => res.json())
        .then(response => {
            memeAdded = false;
        })
        .catch(err => console.log(err));
    }

</script>

{#await fetchMemelist}
    ...getting memelist
{:then memelist}    
    {#if typeView == 'miniature'}
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">{memelist.data.name} by {memelist.data.author}</h5>
                
                <!-- <p class="card-text">{memelist.data.count}</p> -->
                <Button outline dark on:click={() => navigate(`/memelists/${memelist.data.id}`)}
                    >See list</Button
                >
                {#if meme_id}
                    {#if memeAdded}
                        <Button on:click={handleDeleteMemeInMemelist}
                            >Delete from list</Button
                        >
                    {:else}
                        <Button on:click={handleAddToMemelist}
                            >Add to list</Button
                        >
                    {/if}
                {/if}
            </div>
        </div>
    {:else}
        <h3>{memelist.data.name} by  {memelist.data.author}  </h3>
        {#if memelist.data.author == myUser && memelist.data.name != 'liked memes'}
            <Button color='danger' on:click={deleteMemelist} >Delete list</Button>
        {/if}
        {#await fetchMemes}
        ...getting memes
        {:then memes}
        <div>
            <Container>
                {#each memes.data as meme}
                <Row>
                    <Col sm="6">
                        <Meme meme={meme} />
                    </Col>
                </Row>
                {/each}
            </Container>
        </div>
        {:catch error}
        <p>{error}</p>
        {/await}
    {/if}

{:catch error}
    {error}
{/await}


   
