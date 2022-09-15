// THIS FILE IS FOR DEVELOPMENT ONLY!!!

import { Init } from './index';

setTimeout(() => {
  Init({
    buttonStyles: {
      cursor: 'pointer',
      background: '#000000',
      '& .MuiTypography-root': {
        textTransform: 'none',
        fontSize: '14px',
        lineHeight: '25px',
        fontWeight: '500',
      },
      '& .swButtonAvatar': { width: '36px', height: '36px' },
      boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
      '&:hover': {
        background: '#FFFFFF',
        borderColor: '#000000',
        '& .swButtonText': {
          color: '#000000',
          mt: '4px',
        },
      },
      height: '47px',
      width: '180px',
    },
    dropdownStyles: {
      '& .MuiMenu-list': {
        padding: '0px',
      },
      '& .swButtonOption': {
        cursor: 'pointer',
        background: '#000000',
        '& .swButtonOptionText': {
          textTransform: 'none',
          fontSize: '14px',
          lineHeight: '25px',
          fontWeight: '500',
        },
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
        '&:hover': {
          background: '#FFFFFF',
          borderColor: '#000000',
          '& .swButtonOptionText': {
            color: '#000000',
            mt: '4px',
          },
        },
        height: '40px',
        width: '180px',
        border: '0px',
      },
      // '& .MuiPaper-root': {
      //   borderRadius: '13px',
      //   backgroundColor: 'transparent',
      // },
      boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
    },
  });
  setInterval(() => {
    const el: HTMLElement = document.getElementById('sw-auth');
    const hide = el.getAttribute('disable-create-new-user');
    el.setAttribute('disable-create-new-user', hide === 'true' ? 'false' : 'true');
  }, 1000);
}, 100);
