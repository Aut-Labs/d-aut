import { Dialog, DialogContent, styled, Typography, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TwitterShareButton } from 'react-share';
import { pxToRem } from '../services/web3/utils';
import { AutButton } from './AutButton';

export interface SimpleDialogProps {
  title: string;
  url: string;
  description?: JSX.Element;
  open?: boolean;
  onClose?: () => void;
  twitterProps?: any;
  hideCloseBtn?: boolean;
}

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  '@media(max-width: 769px)': {
    '.MuiPaper-root': {
      margin: '0',
      opacity: '0.8',
      border: 'none',
    },
  },
}));

const AutShare = (props: SimpleDialogProps) => {
  const desktop = useMediaQuery('(min-width:769px)');

  const { onClose, title, description, url, twitterProps, hideCloseBtn } = props;
  return (
    <div
      style={{
        width: desktop ? pxToRem(700) : '100%',
        minHeight: desktop ? pxToRem(400) : '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        borderWidth: desktop ? '5px' : '0px',
        backgroundColor: 'black',

        borderColor: '#439EDD',
        borderStyle: 'solid',
        padding: pxToRem(50),
      }}
    >
      {!hideCloseBtn && (
        <CloseIcon
          onClick={onClose}
          sx={{
            position: 'absolute',
            cursor: 'pointer',
            top: 8,
            right: 8,
            color: 'white',
          }}
        />
      )}

      <div
        style={{
          display: 'flex',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
            flex: 1,
            width: '100%',
            padding: pxToRem(30),
          }}
        >
          <Typography sx={{ textAlign: 'center', mb: pxToRem(30) }} color="white" component="span" fontSize={pxToRem(40)}>
            {title}
          </Typography>

          <Typography
            sx={{
              mt: '20px',
            }}
            color="white"
            fontSize={pxToRem(18)}
          >
            {description}
          </Typography>

          <div
            className="links"
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: desktop ? '330px' : '100%',
              margin: '30px auto 0 auto',
            }}
          >
            <TwitterShareButton url={url} className="social-button" {...twitterProps}>
              <AutButton
                sx={{
                  width: pxToRem(250),
                  height: pxToRem(50),
                  mt: pxToRem(20),
                  '&.MuiButton-root': {
                    borderRadius: 0,
                    borderWidth: '2px',
                  },
                }}
                type="submit"
                color="primary"
                variant="outlined"
              >
                Share now
              </AutButton>
            </TwitterShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export function AutShareDialog(props: SimpleDialogProps) {
  const desktop = useMediaQuery('(min-width:769px)');
  return (
    <AutStyledDialog
      fullScreen={!desktop}
      onClose={props.onClose}
      open={props.open}
      BackdropProps={{ style: { backdropFilter: 'blur(5px)' } }}
    >
      <DialogContent
        sx={{
          border: 0,
          padding: 0,
        }}
      >
        <AutShare {...props} />
      </DialogContent>
    </AutStyledDialog>
  );
}

export default AutShare;
