import { Input, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const RemainingCharsTextInput = (props) => {
  const [remainingChars, setRemainingChars] = useState(props.maxLength);

  useEffect(() => {
    const checkRemainingCharacters = () => {
      setRemainingChars(props.maxLength - props.value.length);
    };
    checkRemainingCharacters();
  }, [props.maxLength, props.value]);
  return (
    <>
      <Input {...props} />
      <Typography sx={{ position: 'relative', transform: 'translate(-30px, 33px)' }} variant="caption">
        {remainingChars} characters left
      </Typography>
    </>
  );
};

export default RemainingCharsTextInput;
