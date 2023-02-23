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
      <Typography sx={{ mt: subtitle ? '14px' : '33px' }} color="white" variant="subtitle1">
        {title}
      </Typography>
      {subtitle && (
        <Typography color="white" variant="subtitle2" sx={{ textAlign: 'center' }}>
          {subtitle}
        </Typography>
      )}
    </>
  );
};
