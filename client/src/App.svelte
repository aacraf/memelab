<script>
	
	import Navbar from './Navbar.svelte';
	import Create from './Create.svelte';
	import Home from './Home.svelte';
	import Auth from './Auth.svelte';
	import Profile from './Profile.svelte';
	import { Router, Route, Link } from "svelte-navigator";
	import {setContext} from 'svelte';
	export let url = "";
	setContext('url', url);
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
</svelte:head>

<main>

	<Router url="{url}">
		<Navbar/>
		<Route path="/" component="{Home}" />
		<Route path="/create" component="{Create}" />
		<Route path="/profile" component="{Profile}" />
		<Route path="/auth" component="{Auth}" />
	</Router>
</main>
