<script>
	
	
	import Navbar from './Navbar.svelte';
	import Create from './Create.svelte';
	import Home from './Home.svelte';
	import Auth from './Auth.svelte';
	import Profile from './Profile.svelte';
	import Lists from './Lists.svelte';
	import Memelist from './Memelist.svelte';
	import {Link, Router, Route, navigate} from 'svelte-navigator';
	import {setContext} from 'svelte';
	// export let name;
	export let url = "";
	setContext('url', url);
</script>

<svelte:head>
	<title>Memelab</title>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>

<main>
	<Router url="{url}">
		<Navbar/>
		<Route path="/" component="{Home}" />
		<Route path="/create" component="{Create}" />
		<Route path="/profile" component="{Profile}" />
		<Route path="/auth" component="{Auth}" />
		<Route path="memelists/*">
			<Route path="/">
				<Lists />
			</Route>
			<Route path=":id" component="{Memelist}" />
		</Route>
		<Route path="users/:id" component="{Profile}" />
	</Router>
</main>
