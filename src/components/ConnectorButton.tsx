import { ReactComponent as Metamask } from '../assets/metamask.svg';
import { ReactComponent as WalletConnect } from '../assets/wallet-connect.svg';
import { useAppDispatch } from '../store/store.model';
import { ConnectorTypes, setWallet } from '../store/wallet-provider';
import { AutButton } from './AutButton';

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

  return (
    <AutButton
      onClick={async () => {
        dispatch(setWallet(connectorType));
        setConnector(connectorType);
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
