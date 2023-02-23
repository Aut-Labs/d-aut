/* eslint-disable react/no-unknown-property */
import { Box } from '@mui/system';

function Icon({ id }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="174" height="91" viewBox="0 0 174 91">
      <g id="dĀut_Logo" data-name="dĀut Logo" transform="translate(0 7)">
        <text id="dĀut" transform="translate(0 64)" fill="#ebebf2" font-size="73" font-family="FractulAltLight" font-weight="300">
          <tspan x="0" y="0">
            d
          </tspan>
          <tspan y="0" font-family="FractulAltBold" font-weight="700">
            Āut
          </tspan>
        </text>
      </g>
    </svg>
  );
}

const AutLogo = ({ id }) => {
  return (
    <Box sx={{ width: '120px', height: '70px', display: 'flex', mt: '8px' }}>
      <Icon id={id} />
    </Box>
  );
};

export default AutLogo;
