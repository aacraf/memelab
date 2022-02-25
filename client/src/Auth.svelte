<script>
    import { user } from './userStore.js'; 
    import { Form, FormGroup, FormText, Input, Label, Button} from 'sveltestrap';
    import { navigate } from 'svelte-navigator';

    let myUser;
    let registerView = false;
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
            if (response.success)
            {
                user.set(response.message.username);
                alert(`Welcome ${response.message.username}`); 
                navigate('/', { replace: true });
            }
            else
            {
                alert("Login failed");   
            }
        })
    }

    const handleRegister = (e) =>{
        
        e.preventDefault();
        fetch('http://localhost:8000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: e.target.email.value,
                username: e.target.username.value,
                password: e.target.password.value
            })
        }).then(res => res.json())
        .then(response => {
            console.log(response);
            console.log(response.success);
            if (response.success)
            {
                user.set(e.target.username.value);
                registerView = false;
            }
            else
            {
                alert("Register failed");   
            }
        })
    }


</script>

{#if !registerView}
<form on:submit|preventDefault={handleLogin}>
    <FormGroup>
        <Label for="username">Username</Label>
        <Input type="text" name="username" id="username" placeholder="Username" />
    </FormGroup>
    <FormGroup>
        <Label for="password">Password</Label>
        <Input type="password" name="password" id="password" placeholder="Password" />
    </FormGroup>
    <FormGroup>
        <FormText color="muted">
            <a href="#" on:click={() => registerView=!registerView}>Register</a>
        </FormText>
    </FormGroup>
    <FormGroup>
        <Button color="primary">Login</Button>
    </FormGroup>
</form>
{:else}
<form on:submit|preventDefault={handleRegister}>
    <FormGroup>
        <Label for="email">Email (Optional)</Label>
        <Input type="text" name="email" id="email" placeholder="Email" />
    </FormGroup>
    <FormGroup>
        <Label for="username">Username</Label>
        <Input type="text" name="username" id="username" placeholder="Username" />
    </FormGroup>
    <FormGroup>
        <Label for="password">Password</Label>
        <Input type="password" name="password" id="password" placeholder="Password" />
    </FormGroup>
    <FormGroup>
        <FormText color="muted">
            <a href="#" on:click={() => registerView = !registerView}>Login</a>
        </FormText>
    </FormGroup>
    <FormGroup>
        <Button color="primary">Register</Button>
    </FormGroup>
</form>
{/if}
