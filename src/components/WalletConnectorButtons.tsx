import { Connector, useAccount, useConnect } from 'wagmi';
import { AutButton } from './AutButton';
import { Stack, SvgIcon } from '@mui/material';
import { ReactComponent as Metamask } from '../assets/metamask.svg';
import { ReactComponent as WalletConnect } from '../assets/wallet-connect.svg';
import { useMemo } from 'react';

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
  const { connectors, isPending: isLoading } = useConnect();
  const { isReconnecting } = useAccount();

  const filteredConnectors = useMemo(() => {
    if (connectors?.length) {
      return connectors.filter((c) => !!btnConfig[c.id]);
    }
    return [];
  }, [connectors]);

  return (
    <Stack direction="column" mt={6} gap={4}>
      {filteredConnectors.map((c) => (
        <AutButton
          disabled={isReconnecting || isLoading}
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
