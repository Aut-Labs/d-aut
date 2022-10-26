import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/store.model';
import { AutPageBox } from '../components/AutPageBox';
import { checkIfAutIdExists, fetchCommunity } from '../services/web3/api';
import { setJustJoining, setSelectedAddress } from '../store/aut.reducer';
import type { Connector } from '@web3-react/types';
import { AutHeader } from '../components/AutHeader';
import { useWeb3React } from '@web3-react/core';
import { ConnectorTypes, IsConnected, NetworksConfig, setNetwork } from '../store/wallet-provider';
import ConnectorBtn from '../components/ConnectorButton';
import { EnableAndChangeNetwork } from '../services/ProviderFactory/web3.network';
import NetworkSelector from '../components/NetworkSelector';

const NewUser: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const networks = useSelector(NetworksConfig);
  const history = useHistory();
  const [connector, setConnector] = useState<Connector>(null);
  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const { isActive, account } = useWeb3React();
  const isConnected = useSelector(IsConnected);

  const checkForExistingAutId = async () => {
    const hasAutId = await dispatch(checkIfAutIdExists(null));
    if (hasAutId.meta.requestStatus !== 'rejected') {
      await dispatch(fetchCommunity(null));
      if (!hasAutId.payload) {
        await dispatch(setJustJoining(false));
        history.push('userdetails');
      } else {
        await dispatch(setJustJoining(true));
        history.push('role');
      }
    }
  };

  useEffect(() => {
    const activate = async () => {
      if (isActive && isConnected) {
        const res = await dispatch(setSelectedAddress(account));
        await checkForExistingAutId();
      }
    };
    activate();
  }, [isActive, isConnected]);

  const switchNetwork = async (c: Connector, chainId: number, index: number, name: string = null) => {
    if (!c) {
      return;
    }
    await c.deactivate();
    await c.activate(chainId);
    const config = networks.find((n) => n.chainId?.toString() === chainId?.toString());
    try {
      await EnableAndChangeNetwork(c.provider, config);
      await dispatch(setNetwork(config.network));
    } catch (error) {
      // console.log(error);
    }
  };

  const changeConnector = async (c: Connector) => {
    // @ts-ignore
    const foundChainId = Number(c?.provider?.chainId);
    const index = networks.map((n) => n.chainId?.toString()).indexOf(foundChainId?.toString());
    const chainAllowed = index !== -1;
    if (chainAllowed) {
      await switchNetwork(c, foundChainId, index);
    }
    setConnector(c);
    setSelectingNetwork(true);
  };

  const changeNetwork = async (chainId) => {
    const index = networks.map((n) => n.chainId?.toString()).indexOf(chainId?.toString());
    await switchNetwork(connector, chainId, index);
  };

  return (
    <>
      {selectingNetwork ? (
        <NetworkSelector
          onSelect={async (chainId) => {
            await changeNetwork(chainId);
            setSelectingNetwork(false);
          }}
          onBack={() => {
            setSelectingNetwork(false);
          }}
        />
      ) : (
        <AutPageBox>
          <AutHeader
            logoId="new-user-logo"
            title="WELCOME"
            subtitle={
              <>
                First, import your wallet <br /> & claim your Role in your DAO
                {/* <span style={{ textDecoration: 'underline' }}>{autData.community?.name}!</span> */}
              </>
            }
          />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <ConnectorBtn setConnector={changeConnector} connectorType={ConnectorTypes.Metamask} />
            <ConnectorBtn setConnector={changeConnector} connectorType={ConnectorTypes.WalletConnect} />
          </Box>
        </AutPageBox>
      )}
    </>
  );
};

export default NewUser;
