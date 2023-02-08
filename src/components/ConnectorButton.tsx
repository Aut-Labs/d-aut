import { useEffect } from 'react';
import { ReactComponent as Metamask } from '../assets/metamask.svg';
import { ReactComponent as WalletConnect } from '../assets/wallet-connect.svg';
import { SxProps, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/store.model';
import { ConnectorTypes, NetworkConnector, setWallet } from '../store/wallet-provider';
import { AutButton } from './AutButton';
import { margin } from '@mui/system';
import { pxToRem } from '../utils/utils';

const btnConfig = {
  [ConnectorTypes.Metamask]: {
    label: 'Metamask',
    icon: <Metamask height="20px" />,
  },
  [ConnectorTypes.WalletConnect]: {
    label: 'WalletConnect',
    icon: <WalletConnect height="20px" />,
  },
};

export default function ConnectorBtn({
  connectorType,
  setConnector,
  marginTop,
}: {
  connectorType: ConnectorTypes;
  setConnector: any;
  marginTop?: number;
}) {
  const dispatch = useAppDispatch();
  const [connector] = useSelector(NetworkConnector(connectorType));

  useEffect(() => {
    if (connector) {
      // connector.connectEagerly();
    }
  }, [connector]);

  return (
    <AutButton
      onClick={async () => {
        await connector.connectEagerly();
        dispatch(setWallet(connectorType));
        setConnector(connector);
      }}
      sx={{ mt: `${marginTop}px` }}
      color="white"
      size="normal"
      variant="outlined"
      type="button"
      startIcon={btnConfig[connectorType].icon}
    >
      {btnConfig[connectorType].label}
    </AutButton>
  );
}
