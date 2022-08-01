import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { getCommunity } from '../services/web3/web3Service';

export const EventsHandlerWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  // useEffect(() => {
  //   window.ethereum.on('accountsChanged', (accounts) => {
  //     if (accounts.length > 0) {
  //       setAdress(accounts[0]);
  //     } else {
  //       // setWallet("");
  //       // setStatus("🦊 Connect to Metamask using the top right button.");
  //     }
  //   });
  // });
  return children;
};
