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
      <Typography variant="subtitle1" sx={{ mt: '25px' }}>
        {title}
      </Typography>
      {subtitle && <Typography sx={{ mt: '25px', letterSpacing: '1.25px', fontSize: '14px', textAlign: 'center' }}>{subtitle}</Typography>}
    </>
  );
};
