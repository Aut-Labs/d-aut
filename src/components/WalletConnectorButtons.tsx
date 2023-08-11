import { Connector, useAccount, useConnect } from 'wagmi';
import { AutButton } from './AutButton';
import { Stack, SvgIcon } from '@mui/material';
import { ReactComponent as Metamask } from '../assets/metamask.svg';
import { ReactComponent as WalletConnect } from '../assets/wallet-connect.svg';

const btnConfig = {
  metaMask: {
    label: 'MetaMask',
    icon: Metamask,
  },
  walletConnect: {
    label: 'WalletConnect',
    icon: WalletConnect,
  },
};

export default function WalletConnectorButtons({ onConnect }: { onConnect: (c: Connector) => Promise<void> }) {
  const { connectors, isLoading } = useConnect();
  const { isReconnecting } = useAccount();

  return (
    <Stack direction="column" mt={6} gap={4}>
      {connectors.map((c) => (
        <AutButton
          disabled={!c.ready || isReconnecting || isLoading}
          key={c.id}
          onClick={() => onConnect(c)}
          color="offWhite"
          size="normal"
          variant="outlined"
          type="button"
        >
          <SvgIcon sx={{ mr: 2 }} component={btnConfig[c.id]?.icon} inheritViewBox />
          {c.name}
        </AutButton>
      ))}
    </Stack>
  );
}
