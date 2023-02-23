# d-Āut - Intro

## Web Component - what it does

This Web Component is Āut Labs' decentralized, **role-based** authentication system.  
It lets your users create an account, or login to your platform, in a fully decentralized way, while giving them a familiar (web2-like) experience.  
Each user will add their nickname and avatar, and pick a Role in your DAO - after doing that, they will join your DAO, and claim their universal ID.

## Web Component Developer notes

When a user successfully connects with dĀut their ĀutID information is stored in the 'Session Storage' with the Key 'aut-data'. Don't forget to add the attribute: dao-expander

## Pre-requisite: obtain your DAO Expander Address

This Web Component is cross-platform, and can be integrated on any Web framework.  
In order to use it, though, you **will need to have a DAO Expander Address** - you can get deploy your DAO expander contract, and receive your DAO expander key directly on our [Integrate App](https://docs.aut.id/v2/product-suite/aut-exp.).

## Web Component installation

### Example React

1. Install the library

   ```npm
   npm i @aut-labs/d-aut --save
   ```

2. Import the initialization function in the App.js/tsx (or index.js/tsx)

   ```ts
   import { Init } from '@aut-labs/d-aut';
   ```

3. Call the Init function at the start of your project

   ```ts
   Init();
   ```

4. Add the custom HTML tag and populate the dao-expander property

```tsx
import './App.css';
import { Init } from '@aut-labs/d-aut;

function App() {

  useEffect(() => {
      Init();
  }, []);

  return (
    <div>
        <d-aut  dao-expander="0x94C5A2d8B75D139FE02180Fd7Ce87EC55B01b358"></d-aut>
    </div>
  );
}

export default App;
```

### Example Angular

1. Install the library

   ```npm
   npm i @aut-labs/d-aut --save
   ```

2. Import the initialization function in the app.component.ts

   ```ts
   import { Init } from '@aut-labs/d-aut';
   ```

3. Call the Init function inside ngOnInit

   ```ts
   ngOnInit(): void { Init(); }
   ```

4. Add the CUSTOM_ELEMENTS_SCHEMA in your app.module.ts

   ```ts
   import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
   ```

5. Add the custom HTML tag and populate the dao-expander property

app.component.ts:

```ts
import { Component, OnInit } from '@angular/core';
import { Init } from '@aut-labs/d-aut;

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

```ts
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

```html
<d-aut dao-expander="0x94C5A2d8B75D139FE02180Fd7Ce87EC55B01b358"></d-aut>
```

### Example Vue

1. Install the library

   ```npm
   npm i @aut-labs/d-aut --save
   ```

2. Import the initialization function in the App.vue

   ```ts
   import { Init } from '@aut-labs/d-aut';
   ```

3. Call the Init function at the start of your project

   ```ts
   Init();
   ```

4. Add the custom HTML tag and populate the dao-expander property

App.vue:

```html
<script setup>
  import { Init } from '@aut-labs/d-aut;
  Init();
</script>

<template>
  <div class="wrapper">
    <d-aut dao-expander="0x94C5A2d8B75D139FE02180Fd7Ce87EC55B01b358"></d-aut>
  </div>
</template>

<style>
  ...;
</style>
```

## Web Component Custom HTML element attributes

'chainId' = 'string',
'explorerUrls' = 'string',
'networkName' = 'string',
'rpcUrls' = 'string',
'ipfsGateway' = 'string',

1. `dao-expander`
   The address you are given after [Integrating](https://playground.aut.id/) your DAO
2. `chain-id`
   Chain id for the desired network defaults to 80001
3. `network-name`
   Name of desired network defaults to Mumbai
4. `rps-urls`
   Rpc Urls (separate by commas if multiple)
   example: "https://rpc-mumbai.maticvigil.com/,https://rpc-mumbai.maticvigil.com/"
   default: "https://rpc-mumbai.maticvigil.com/"
5. `explorer-urls`
   Explorer Urls (separate by commas if multiple)
   example: "https://explorer-mumbai.maticvigil.com/,https://explorer-mumbai.maticvigil.com/"
   default: "https://explorer-mumbai.maticvigil.com/"
6. `ipfs-gateway`
   Set a custom ipfs gateway (useful when getting ipfs timeouts) defaults to https://cloudflare-ipfs.com/ipfs

   ## Note about setting custom network parameters:

   All four network attributes need to be provided for the custom config to be successfully set - chain-id, network-name, rps-urls, explorer-urls
