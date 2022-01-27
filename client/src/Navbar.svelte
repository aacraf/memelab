<script lang="ts">
    import {
      Collapse,
      Navbar,
      NavbarToggler,
      NavbarBrand,
      Nav,
      NavItem,
      NavLink,
      Button,
      Dropdown,
      DropdownToggle,
      DropdownMenu,
      DropdownItem
    } from 'sveltestrap';
    import {getContext} from 'svelte';
    import {Link, navigate} from 'svelte-navigator';
    let isOpen = false;

    import { user } from './userStore';

    let myUser;

    user.subscribe(u => {
      myUser = u;
    });
  
    let url = getContext('url');
    function handleUpdate(event) {
      isOpen = event.detail.isOpen;
    }
  </script>
  
  <Navbar color="light" light expand="md">
    <NavbarBrand><Link to="/">MemeLab</Link></NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>

    
      <Nav class="ms-auto" navbar>
          {#if myUser}
            <NavItem>
            <NavLink><Link to="/create">Create</Link></NavLink>
            </NavItem>
            <NavItem>
              <NavLink><Link to="/memelists">Memelists</Link></NavLink>
            </NavItem>  
            <NavItem>
                <NavLink><Link to="/profile">Profile</Link></NavLink>
            </NavItem>
            <NavItem>
                <NavLink><a href="#" on:click={(e)=>{user.set(''); navigate('/')}}>LogOut</a></NavLink>
            </NavItem>
          {:else}
            <NavItem>
                <NavLink><Link to="/auth">Login</Link></NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/bestguy/sveltestrap">GitHub</NavLink>
            </NavItem>
          {/if}
        <!-- <Dropdown nav inNavbar>
          <DropdownToggle nav caret>Options</DropdownToggle>
          <DropdownMenu end>
            <DropdownItem>Option 1</DropdownItem>
            <DropdownItem>Option 2</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Reset</DropdownItem>
          </DropdownMenu>
        </Dropdown> -->
      </Nav>
    </Collapse>
  </Navbar>


  <style>
    .link > :global(a) {
        text-decoration: none;
        color: #000;
    }
    :global(a){
        color: #000 !important;
        text-decoration: none !important;
        font-weight: bold;
    }

  </style>