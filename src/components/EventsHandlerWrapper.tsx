// import { getHub } from '../services/web3/web3Service';

export const EventsHandlerWrapper = ({ children }) => {
  // const dispatch = useDispatch();
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
