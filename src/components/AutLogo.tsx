/* eslint-disable react/no-unknown-property */
import { Box } from '@mui/system';

function Icon({ id }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="173" height="97" viewBox="0 0 173 97">
      <g id="dĀut_Logo" data-name="dĀut Logo" transform="translate(0 15)">
        <text id="dĀut" transform="translate(0 64)" fill="#ebebf2" font-size="73" font-family="SegoeUI-Light, Segoe UI" font-weight="300">
          <tspan x="0" y="0">
            d
          </tspan>
          <tspan y="0" font-family="SegoeUI-Bold, Segoe UI" font-weight="700">
            Āut
          </tspan>
        </text>
      </g>
    </svg>
  );
}

const AutLogo = ({ id }) => {
  return (
    <Box sx={{ width: '120px', height: '70px' }}>
      <Icon id={id} />
    </Box>
  );
};

export default AutLogo;
