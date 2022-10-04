import React from 'react';
import IRoute from '../interfaces/route';
import LoginWith from '../pages/LoginWith';
import LoginWithSkillWallet from '../pages/LoginWithAut';
import NewUser from '../pages/NewUser';
import UserDetails from '../pages/UserDetails';
import UserRole from '../pages/UserRole';
import Commitment from '../pages/Commitment';
import Congratulations from '../pages/Congratulations';
import MintSuccess from '../pages/MintSuccess';
import PickUnjoinedDAO from '../pages/PickUnjoinedDAO';

const routes: IRoute[] = [
  {
    path: '/',
    name: 'Login With',
    component: PickUnjoinedDAO,
    exact: true,
  },
  {
    path: '/unjoined',
    name: 'Login With',
    component: PickUnjoinedDAO,
    exact: true,
  },
  {
    path: '/autid',
    name: 'Aut Id',
    component: LoginWithSkillWallet,
    exact: true,
  },
  {
    path: '/newuser',
    name: 'New User',
    component: NewUser,
    exact: true,
  },
  {
    path: '/userdetails',
    name: 'User Details',
    component: UserDetails,
    exact: true,
  },
  {
    path: '/role',
    name: 'User Role',
    component: UserRole,
    exact: true,
  },
  {
    path: '/commitment',
    name: 'Commitment',
    component: Commitment,
    exact: true,
  },
  {
    path: '/congrats',
    name: 'Congrats',
    component: Congratulations,
    exact: true,
  },
  {
    path: '/mintsuccess',
    name: 'Mint Success',
    component: MintSuccess,
    exact: true,
  },
];

export default routes;
