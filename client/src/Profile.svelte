<script>

    import { user } from './userStore.js';
    import { Col, Container, Row, Button, TabContent, TabPane } from 'sveltestrap';

    import Memelist from './Memelist.svelte';

    let myUser;
    let switchContent = 'liked memes';
    export let id;

    user.subscribe(function (newUser) {
        myUser = newUser;
    });

    // viene de la url
    if (id != undefined)
    {
        myUser = id;
    }

    // Obtener usuarios
    const fetchUser = (async () => {
        const response = await fetch(`http://localhost:8000/api/users/${myUser}`);
        return await response.json()
    })()

    // Obtener memes que me gustan

    
    // Obtener mis memelist
    const fetchLists = (async () => {
        const response = await fetch(`http://localhost:8000/api/memelists?author=${myUser}`);
        return await response.json();
    })();
</script>

<Container>
    <Row>
        <Col>
            <img src="https://picsum.photos/200/300" alt=""/>
            {#await fetchUser}
                <p>...waiting</p>
            {:then user}
                <p>Name: {user.message.username}</p>
                <p>Email: {user.message.email}</p>
            {:catch error}
                <p>An error occurred!</p>
            {/await}
        </Col>
        <Col md>
            
            {#await fetchLists}
                <p>...waiting</p>
            {:then lists}
                <TabContent>
                    <TabPane tabId="liked-memes"  tab="Liked Memes" on:click={()=> switchContent = 'liked memes'} active>
                        {#each lists.data as list}
                            {#if list.name === 'liked memes'}
                                <Memelist id={list.id}/>
                            {/if}
                        {/each}
                    </TabPane>
                    <TabPane tabId="my-memelists" tab="Memelists" on:click={()=> switchContent = 'my lists'}>
                        {#each lists.data as list}
                            {#if list.name != 'liked memes'}
                                <Memelist id={list.id} typeView="miniature"/>
                            {/if}
                        {/each}
                    </TabPane>
                </TabContent>
            {:catch error}
                <p>An error occurred!</p>
            {/await}
        </Col>
    </Row>
</Container>


