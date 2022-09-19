// THIS FILE IS FOR DEVELOPMENT ONLY!!!

import { Init } from './index';

setTimeout(() => {
  Init();
  // setInterval(() => {
  //   const el: HTMLElement = document.getElementById('sw-auth');
  //   const hide = el.getAttribute('disable-create-new-user');
  //   el.setAttribute('disable-create-new-user', hide === 'true' ? 'false' : 'true');
  // }, 1000);
}, 100);
