<script>
    import { Figure, Image, Button,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        Form,
        FormGroup,
        FormText,
        Input,
        Label,
        ButtonDropdown,
        DropdownItem,
        DropdownMenu,
        DropdownToggle,
        Col, 
        Container, 
        Row,
        Toast, 
        ToastBody, 
        ToastHeader
    } from 'sveltestrap';

    import { Icon } from 'sveltestrap';
    import { user } from './userStore';
    import { navigate } from "svelte-navigator";
    import { onMount } from 'svelte';
    import Memelist from './Memelist.svelte';

    export let meme;
    let myUser;
    let liked = false;

    user.subscribe((val) => {
        myUser = val;
    });

    onMount(async () => {

        await fetch(`http://localhost:8000/api/memes/${meme.id}/liked`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: myUser,
            })
        })
        .then(res => res.json())
        .then(response => {
            liked = response.data;
        })
        .catch(error => console.log(error))
	});


    let addView = false;
    const toggleAddView = () => {
        addView = !addView
    };

    async function downloadImage() {
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = meme.image;
        link.click();
    }

    async function deleteMeme(){
        
        await fetch(`http://localhost:8000/api/memes/${meme.id}`, {
            method: 'DELETE'
        }).then(res => res.json())
        .then(response => {
            console.log(response);
            navigate("/");
        })
    }


    // Liked memes
    async function likeMeme() {
        await fetch(`http://localhost:8000/api/memes/${meme.id}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: myUser
            })
        })
            .then(res => res.json())
            .then(res => {
                liked = (res.message == 'meme liked')  
                meme.likes += res.message == 'meme liked' ? 1 : -1;
            })
            .catch(err => console.log(err));
    }
    
    const fetchLists = (async () => {
        const response = await fetch(`http://localhost:8000/api/memelists?author=${myUser}`);
        return await response.json();
    })();


</script>

<div class="meme-container">
        <Toast class="w-100">
            <div>
                <ToastHeader><span style="cursor:pointer;" class="mr-40" on:click={()=>navigate(`users/${meme.author}`)}>{meme.author}</span>
                    <ButtonDropdown class="pull-right">
                        <DropdownToggle outline dark caret> <Icon name="three-dots-vertical" /></DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem><Button on:click={downloadImage}>Download</Button></DropdownItem>
                            <DropdownItem divider />
                            {#if myUser == meme.author}
                                <DropdownItem disabled><Button color='warning' disabled>Edit</Button></DropdownItem>
                                <DropdownItem><Button color='danger' on:click={deleteMeme}>Delete</Button></DropdownItem>
                            {/if}
                        </DropdownMenu>
                    </ButtonDropdown>
                </ToastHeader>

            </div>
            <ToastBody>
                <Figure>
                    <Image fluid alt={meme.name} src={meme.image} />
                    {#if myUser}
                        <!-- <Button outline dark > -->
                            {#if liked}
                                <span on:click={likeMeme} style="font-size: 1.5rem; cursor:pointer;">
                                    <Icon name="heart-fill" />
                                </span>
                            {:else}   
                                <span on:click={likeMeme} style="font-size: 1.5rem; cursor:pointer;">
                                    <Icon name="heart" />
                                </span>
                            {/if}
                        <!-- </Button> -->
                        <span on:click={toggleAddView} style="font-size: 1.5rem; cursor:pointer;"> 
                            <Icon name="bookmark-dash"/> 
                        </span>
                    {/if}    
                    <br>
                    <span>Meme likes: {meme.likes}</span>
                </Figure>
            </ToastBody>
        </Toast>
</div>

<Modal isOpen={addView} {toggleAddView}>
    <ModalHeader {toggleAddView}>Add this meme to a Memelist</ModalHeader>
    <ModalBody>
        {#await fetchLists}
        ...geting lists
        {:then lists}
        {#each lists.data as list}
            {#if list.name != 'liked memes'}
                <Memelist id={list.id} typeView='miniature' meme_id={meme.id}/>
            {/if}
        {/each}
        {:catch error}
            <p>Error: {error}</p>
        {/await}
    </ModalBody> 
    <ModalFooter>
        <Button color="secondary" type="button" on:click={toggleAddView}>Cancel</Button>
    </ModalFooter>
</Modal>

<style>
    .meme-container{
        background-color: beige;
        margin: 20px;
    }

</style>