import { Button, Stack } from '@mui/material';
import { useAutConnectorContext } from '..';
import MetamaskIcon from '../assets/Metamask';
import CoinbaseIcon from '../assets/Coinbase';
import WalletConnectIcon from '../assets/WalletConnect';
import Web3Auth from '../assets/Web3Auth';

const btnConfig = {
  metaMask: {
    order: 0,
    label: 'metaMask',
    icon: <MetamaskIcon />,
  },
  walletConnect: {
    order: 1,
    label: 'WalletConnect',
    icon: <WalletConnectIcon />,
  },
  coinbaseWalletSDK: {
    order: 2,
    label: 'Coinbase',
    icon: <CoinbaseIcon />,
  },
  web3auth: {
    order: 3,
    label: 'Web3Auth',
    icon: <Web3Auth />,
  },
};

export default function WalletConnectorButtons({ onConnect }) {
  const { connectors } = useAutConnectorContext();

  return (
    <Stack direction="column" my={6} gap={4}>
      {connectors.map((c) => (
        // <AutButton key={c.id} onClick={() => onConnect(c)} color="offWhite" size="normal" variant="outlined" type="button">
        //   <SvgIcon sx={{ mr: 2 }} component={btnConfig[c.id]?.icon} inheritViewBox />
        //   {c.name}
        // </AutButton>
        <Button
          key={c.id}
          onClick={async () => onConnect(c)}
          endIcon={btnConfig[c.id]?.icon}
          variant="outlined"
          size="normal"
          color="offWhite"
          sx={{
            '&.MuiButtonBase-root': {
              borderRadius: '8px',
              borderWidth: '1px',
              justifyContent: 'space-between',
              px: '24px',
              textTransform: 'none',
            },

            '.MuiButton-endIcon svg': {
              width: '30px',
              height: '30px',
            },
            minWidth: {
              xs: '260px',
              md: '280px',
              lg: '300px',
              xxl: '440px',
            },
          }}
        >
          {c.name}
        </Button>
      ))}
    </Stack>
  );
}
