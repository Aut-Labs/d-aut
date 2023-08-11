/* eslint-disable react/no-unknown-property */
import { Box } from '@mui/system';

function Icon({ id }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="174" height="91" viewBox="0 0 174 91">
      <g data-name="dĀut Logo" transform="translate(0 7)">
        <text fill="#ebebf2" fontFamily="FractulAltLight" fontSize="73" fontWeight="300" transform="translate(0 64)">
          <tspan x="0" y="0">
            d
          </tspan>
          <tspan y="0" fontFamily="FractulAltBold" fontWeight="700">
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
