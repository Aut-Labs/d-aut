# d-Āut - Intro

# Web Component - what it does

This Web Component is Āut Protocol's decentralized, **role-based** authentication system.  
It lets your users create an account, or login to your platform, in a fully decentralized way, while giving them a familiar (web2-like) experience.  
Each user will add their nickname and avatar, and pick a Role in your DAO - after doing that, they will join your DAO, and claim their universal ID.

# Web Component Developer notes

When a user successfully connects with dĀut their ĀutID information is stored in the 'Session Storage' with the Key 'aut-data'. Don't forget to add the attributes: dao-expander, button-type, and network

# Pre-requisite: obtain your DAO Expander Address

This Web Component is cross-platform, and can be integrated on any Web framework.  
In order to use it, though, you **will need to have a DAO Expander Address** - you can get deploy your DAO expander contract, and receive your DAO expander key directly on our [Integrate App](https://docs.aut.id/v2/product-suite/aut-exp.).

# Web Component installation

##### React App

1. Install the library  
   `npm i @aut-protocol/d-aut --save`

2. Import the initialization function in the App.js/tsx (or index.js/tsx)  
   `import { Init } from '@aut-protocol/d-aut';`

3. Call the Init function at the start of your project  
   `Init();`

4. Add the custom HTML tag and populate the dao-expander property

###### Example

```
import './App.css';
import { Init } from '@aut-protocol/d-aut;

function App() {

  useEffect(() => {
      Init();
  }, []);

  return (
    <div>
        <d-aut network="goerli" button-type="simple" dao-expander="0x94C5A2d8B75D139FE02180Fd7Ce87EC55B01b358"></d-aut>
    </div>
  );
}

export default App;
```

##### Angular

1. Install the library  
   `npm i @aut-protocol/d-aut --save`

2. Import the initialization function in the app.component.ts  
   `import { Init } from '@aut-protocol/d-aut';`

3. Call the Init function inside ngOnInit
   `ngOnInit(): void { Init(); }`

4. Add the CUSTOM_ELEMENTS_SCHEMA in your app.module.ts
   `import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';`

5. Add the custom HTML tag and populate the partner-key property

###### Example

app.component.ts:

```
import { Component, OnInit } from '@angular/core';
import { Init } from '@aut-protocol/d-aut;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    Init();
  }
  title = 'ngular-app';
}
```

app.module.ts:

```
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

```

app.component.ts:

```
...
    <d-aut network="goerli" button-type="simple" dao-expander="0x94C5A2d8B75D139FE02180Fd7Ce87EC55B01b358"></d-aut>
...
```

##### Vue

1. Install the library  
   `npm i @aut-protocol/d-aut --save`

2. Import the initialization function in the App.vue  
   `import { Init } from '@aut-protocol/d-aut';`

3. Call the Init function at the start of your project  
   `Init();`

4. Add the custom HTML tag and populate the partner-key property

###### Example

App.vue:

```
<script setup>
import { Init } from '@aut-protocol/d-aut;
Init();
</script>

<template>
    <div class="wrapper">
        <d-aut network="goerli" button-type="simple" dao-expander="0x94C5A2d8B75D139FE02180Fd7Ce87EC55B01b358"></d-aut>
    </div>
</template>

<style>
  ...
</style>

```

# Web Component Custom HTML element attributes:

1. `dao-expander`
   The key you are given after integrating your DAO

2. `network`
   The network your contracts are deployed to. Currently Goerli and Mumbai are supported.

3. `button-type`
   Allows to pick from different button styles. Currently supported styles: simple, round-bright, square-bright,
   square-dark, round-dark, round-light, square-light - default is simple
