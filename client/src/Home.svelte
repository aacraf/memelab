<script>
    import { user } from './userStore.js'; 
    import { Form, FormGroup, FormText, Input, Label, Button} from 'sveltestrap';
  

    let myUser;
    
    user.subscribe(val => {
        myUser = val;
        console.log("Value user; ", val);
        console.log(myUser);
    });

    console.log("MyUser: ", myUser);
    console.log("user: ", user);


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

</script>

{#if myUser}
<h4> Bienvenido {myUser}</h4>
{:else}
<h4> Tendras que hacer login para acceder </h4>
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
            <a href="#">Forgot Password?</a>
        </FormText>
    </FormGroup>
    <FormGroup>
        <Button color="primary">Login</Button>
    </FormGroup>
</form>

{/if}