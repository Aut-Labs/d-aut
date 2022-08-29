import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { autState, setSelectedAddress } from '../store/aut.reducer';
import { Box } from '@mui/material';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers, providers } from 'ethers';
import { ReactComponent as Metamask } from '../assets/metamask.svg';
import { ReactComponent as WalletConnect } from '../assets/wallet-connect.svg';
import { useAppDispatch } from '../store/store.model';
import { AutButton, ButtonIcon } from '../components/AutButton';
import { getAutId } from '../services/web3/api';
import { AutPageBox } from '../components/AutPageBox';
import { InternalErrorTypes } from '../utils/error-parser';
import { AutHeader } from '../components/AutHeader';
import { useSelector } from 'react-redux';
import { metaMaskConnector, walletConnectConnector } from '../services/ProviderFactory/web3.connectors';
import { SelectedNetworkConfig, setWallet } from '../store/wallet-provider';
import { useWeb3React } from '@web3-react/core';
import { EnableAndChangeNetwork, toHex } from '../services/ProviderFactory/web3.network';
import { Web3Auth } from '@web3auth/web3auth';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import {
  DAOExpanderRegistryContractEventType,
  Web3AutIDProvider,
  Web3DAOExpanderProvider,
  Web3DAOExpanderRegistryProvider,
} from '@aut-protocol/abi-types';
import { env } from '../services/web3/env';
import { storeAsBlob } from '../services/storage/storage.hub';

// const provider = new WalletConnectProvider({
//   rpc: {
//     80001: 'https://matic-mumbai.chainstacklabs.com',
//   },
// });
const [metamaskConnector] = metaMaskConnector;
const [wcConnector] = walletConnectConnector;

const LoginWithSkillWallet: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const autData = useSelector(autState);
  const networkConfig = useSelector(SelectedNetworkConfig);
  const history = useHistory();
  const { isActive, provider, account } = useWeb3React();

  // useEffect(() => {
  //   if (autData.provider && autData.isWalletConnect) {
  //     autData.provider.once('accountsChanged', async (accounts: string[]) => {
  //       await dispatch(setSelectedAddress(accounts[0]));

  //       const result = await dispatch(getAutId(null));
  //       if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
  //         history.push('/role');
  //       }
  //     });
  //   }
  // }, [autData.provider]);

  useEffect(() => {
    const initWeb3Auth = async () => {
      const web3auth = new Web3Auth({
        clientId: 'BP18Rka5ef4bg2pdbkcfEtc3re5_kGczGRH4vSU4VnU_bv814uDXO36KHj2e_1O_nFilDFEW7ijQXWz3CqdiRhA',
        chainConfig: {
          // this is ethereum chain config, change if other chain(Solana, Polygon)
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: toHex(networkConfig.network.chainId),
          rpcTarget: networkConfig.network.rpcUrls[0],
          displayName: networkConfig.network.chainName,
          blockExplorer: networkConfig.network.blockExplorerUrls[0],
          ticker: networkConfig.network.nativeCurrency.symbol,
          tickerName: networkConfig.network.nativeCurrency.name,
        },
      });

      await web3auth.initModal();
      console.log('initing');
      const provider = await web3auth.connect();
      const ethProvider = new ethers.providers.Web3Provider(provider);
      const accouints = await ethProvider.listAccounts();
      const balance = await ethProvider.getBalance(accouints[0]);
      console.log(accouints);

      // const response = await ethProvider.provider.request({
      //   method: 'personal_sign',
      //   params: ['sass', accouints[0]],
      // });
      // console.log(response);
      const daoExp = await Web3DAOExpanderRegistryProvider('0x36221Bfcb46e6e0388677A6BC6b51D27d00e2cfA', {
        signer: async () => {
          return ethProvider.getSigner();
        },
        event: DAOExpanderRegistryContractEventType.DAOExpanderDeployed,
      });
      await setTimeout(async () => {
        const metadata = {
          name: 'gdfgf',
          image:
            'data:image/jpeg;base64,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',
          description: 'gfhgf',
          market: 1,
          roles: [
            {
              id: 1,
              roleName: 'ghfhf',
            },
            {
              id: 2,
              roleName: 'gfhf',
            },
            {
              id: 3,
              roleName: 'gfhgf',
            },
          ],
          commitment: 3,
          contractType: 1,
          daoAddr: '0x73297cb191a7f510C440a1Ce64Cb2E1b18753409',
        };
        const cid = await storeAsBlob(metadata);
        const response = await daoExp.deployDAOExpander(1, '0x73297cb191a7f510C440a1Ce64Cb2E1b18753409', 1, cid, 4);
        // const result = await daoExp.joinCom(1, 1, '0x6bBE078Be00Ca7D59dab4eA1a297514497f86ab8');
        console.log(response);
      }, 5000);
      console.log(provider);
    };

    initWeb3Auth();
  }, []);

  useEffect(() => {
    // console.log(isActive);
    const activate = async () => {
      if (isActive) {
        const res = await dispatch(setSelectedAddress(account));
        const result = await dispatch(getAutId(null));
        if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
          history.push('/role');
        }
      }
    };
    activate();
  }, [isActive]);

  const handleWalletConnectClick = async () => {
    await wcConnector.activate();
    await dispatch(setWallet('walletConnect'));
  };

  const handleMetamaskClick = async () => {
    await metamaskConnector.activate();
    await dispatch(setWallet('metamask'));

    // await dispatch(switchToMetaMask());
    // const result = await dispatch(getAutId(null));

    // if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
    //   history.push('/role');
    // }
  };

  return (
    <AutPageBox>
      <AutHeader logoId="new-user-logo" title=" WELCOME BACK" />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <AutButton
          startIcon={
            <ButtonIcon>
              <Metamask />
            </ButtonIcon>
          }
          sx={{ mt: '29px' }}
          onClick={handleMetamaskClick}
        >
          Metamask
        </AutButton>
        <AutButton
          onClick={handleWalletConnectClick}
          startIcon={
            <ButtonIcon>
              <WalletConnect />
            </ButtonIcon>
          }
          sx={{ mt: '30px' }}
        >
          WalletConnect
        </AutButton>
      </Box>
    </AutPageBox>
  );
};

export default LoginWithSkillWallet;
