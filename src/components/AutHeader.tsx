import { Typography } from '@mui/material';
import { AutNavigationButtons } from './AutNavigationButtons';
import AutLogo from './AutLogo';

export const AutHeader = ({
  title,
  subtitle = null,
  hideBackBtn = false,
  hideCloseBtn = false,
  logoId = 'default-logo',
  backAction = null,
}) => {
  return (
    <>
      <AutNavigationButtons hideBack={hideBackBtn} hideClose={hideCloseBtn} backAction={backAction} />
      <AutLogo id={logoId} />
      <Typography sx={{ mt: '25px', letterSpacing: '3px', fontSize: '18px', fontWeight: '500' }}>{title}</Typography>
      {subtitle && <Typography sx={{ mt: '25px', letterSpacing: '1.25px', fontSize: '14px', textAlign: 'center' }}>{subtitle}</Typography>}
    </>
  );
};
