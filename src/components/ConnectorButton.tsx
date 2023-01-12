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
    icon: <Metamask height="15px" />,
  },
  [ConnectorTypes.WalletConnect]: {
    label: 'WalletConnect',
    icon: <WalletConnect height="15px" />,
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
      sx={{
        width: pxToRem(260),
        height: pxToRem(55),
        fontSize: pxToRem(16),
        marginTop: pxToRem(marginTop || 0),
        textTransform: 'inherit',
        '&.MuiButton-root': {
          letterSpacing: '0px',
        },
      }}
      type="button"
      color="primary"
      variant="outlined"
    >
      <span
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {btnConfig[connectorType].icon}
        <Typography
          sx={{
            flex: 1,
            fontSize: pxToRem(16),
            color: 'white',
          }}
        >
          {btnConfig[connectorType].label}
        </Typography>
      </span>
    </AutButton>
  );
}
