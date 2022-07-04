import { Typography } from '@mui/material';
import { AutBackButton } from './AutBackButton';
import AutLogo from './AutLogo';

export const AutHeader = ({ title, subtitle = null, hideBackBtn = false, logoId = 'default-logo' }) => {
  return (
    <>
      {!hideBackBtn && <AutBackButton />}
      <AutLogo id={logoId} />
      <Typography sx={{ mt: '25px', letterSpacing: '3px', fontSize: '18px', textTransform: 'uppercase', fontWeight: '500' }}>
        {title}
      </Typography>
      {subtitle && <Typography sx={{ mt: '25px', letterSpacing: '1.25px', fontSize: '14px', textAlign: 'center' }}>{subtitle}</Typography>}
    </>
  );
};
