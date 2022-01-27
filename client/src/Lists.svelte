<script>
    import { user } from "./userStore";
    import { navigate } from "svelte-navigator";
    import {
        Button,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        Form,
        FormGroup,
        FormText,
        Input,
        Label,
        Container,
        Row,
        Col,
    } from "sveltestrap";
import Memelist from "./Memelist.svelte";

    let myUser;

    user.subscribe((u) => {
        myUser = u;
    });

    async function getLists () {
        const response = await fetch("http://localhost:8000/api/memelists");
        return await response.json();
    }

    let fetchLists = getLists();

    // open form
    let createView = false;
    const openCreateForm = () => (createView = !createView);


    const handleCreateMemelist = (e) =>{
        console.log("Entro a la función");
        e.preventDefault();
        fetch('http://localhost:8000/api/memelists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: e.target.name.value,
                author: myUser,
            })
        }).then(res => res.json())
        .then(response => {
            openCreateForm();
            fetchLists = getLists();
        })
        .catch(err => console.log(err))
    }
</script>

<div>
    

    <Modal isOpen={createView} {openCreateForm}>
        <form on:submit|preventDefault={handleCreateMemelist}>
        <ModalHeader {openCreateForm}>Create a Memelist</ModalHeader>
        <ModalBody>
                <FormGroup>
                    <Label for="name"></Label>
                    <Input type="text" name="name" id="name" placeholder="Memelist name" required/>
                </FormGroup>
        </ModalBody> 
        <ModalFooter>
            <FormGroup>
                <Button color="primary">Create</Button>
                <Button color="secondary" on:click={openCreateForm}>Cancel</Button>
            </FormGroup>
        </ModalFooter>
        </form>
    </Modal>
</div>

{#await fetchLists}
    ...geting lists
{:then lists}
    <Container>
        <br><br>
        <Button outline dark on:click={openCreateForm}>Create Memelist</Button><br><br>
        <Row>
            {#each lists.data as list}
                {#if list.name != 'liked memes'}
                    <Col md>
                        <Memelist id={list.id} typeView='miniature' />
                    </Col>
                {/if}    
            {/each}
        </Row>
    </Container>
{:catch error}
    <p>Error: {error}</p>
{/await}
