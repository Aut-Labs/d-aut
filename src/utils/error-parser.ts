import { AxiosResponse } from 'axios';

export const ErrorParser = (error: any, dispatch?: any): any => {
  let message = 'Server error';
  try {
    const errResponse = error.response as AxiosResponse<any>;
    if (errResponse && errResponse.status !== 500) {
      message = errResponse.data.error;
    }
  } catch (err) {
    message = 'Server error';
  }

  if (dispatch) {
    // display error logic
    // dispatch(openSnackbar({ message, severity: 'error' }));
  }
  throw new Error(error);
};

const isJson = (str: string) => {
  try {
    return !!JSON.parse(JSON.stringify(str));
  } catch (e) {
    return false;
  }
};

export const METAMASK_POSSIBLE_ERRORS = {
  '-32700': {
    standard: 'JSON RPC 2.0',
    message: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
  },
  '-32600': {
    standard: 'JSON RPC 2.0',
    message: 'The JSON sent is not a valid Request object.',
  },
  '-32601': {
    standard: 'JSON RPC 2.0',
    message: 'The method does not exist / is not available.',
  },
  '-32602': {
    standard: 'JSON RPC 2.0',
    message: 'Invalid method parameter(s).',
  },
  // '-32603': {
  //   standard: 'JSON RPC 2.0',
  //   message: 'Internal JSON-RPC error.',
  // },
  '-32000': {
    standard: 'EIP-1474',
    message: 'Invalid input.',
  },
  '-32001': {
    standard: 'EIP-1474',
    message: 'Resource not found.',
  },
  '-32002': {
    standard: 'EIP-1474',
    message: 'Resource unavailable.',
  },
  '-32003': {
    standard: 'EIP-1474',
    message: 'Transaction rejected.',
  },
  '-32004': {
    standard: 'EIP-1474',
    message: 'Method not supported.',
  },
  '-32005': {
    standard: 'EIP-1474',
    message: 'Request limit exceeded.',
  },
  '4001': {
    standard: 'EIP-1193',
    message: 'User rejected the request.',
  },
  '4100': {
    standard: 'EIP-1193',
    message: 'The requested account and/or method has not been authorized by the user.',
  },
  '4200': {
    standard: 'EIP-1193',
    message: 'The requested method is not supported by this Ethereum provider.',
  },
  '4900': {
    standard: 'EIP-1193',
    message: 'The provider is disconnected from all chains.',
  },
  '4901': {
    standard: 'EIP-1193',
    message: 'The provider is disconnected from the specified chain.',
  },
};

export enum InternalErrorTypes {
  AutIDAlreadyExistsForAddress = 'AutID already exists for this address.',
  AutIDAlreadyInThisCommunity = 'Your AutID is already a member of this DAO.',
  UsernameAlreadyTaken = 'This username is already taken.',
  UserHasUnjoinedCommunities = 'User has unjoined DAOs.',
  GatewayTimedOut = 'IPFS: Gateway timed out.',
  UserNotAMemberOfThisDaoMint = 'Failed to mint AutID. Your address is not a member of this DAO.',
  UserNotAMemberOfThisDaoJoin = 'Failed to join. Your AutID is not a member of this DAO.',
}

export const ParseErrorMessage = (error: any) => {
  if (!error) {
    return error;
  }
  if (Object.values(InternalErrorTypes).includes(error.message)) {
    return error.message;
  }

  if (error.code === 'CALL_EXCEPTION') {
    if (error.reason) {
      return error.reason;
    }
  }

  if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
    const [_, message] = error.error.message.split('execution reverted:');
    return message;
  }

  if (error.code === 'NETWORK_ERROR') {
    return 'A network error occurred. Please try again.';
  }

  if (error.message?.includes('call revert exception')) {
    console.log(error.message);
    return 'Something went wrong. Call reverted.';
  }

  if (error.message === 'Internal JSON-RPC error.') {
    if (error?.data?.message) {
      const [_, message] = error.data.message.split('execution reverted:');
      if (message) {
        return message;
      }
      return 'Something went wrong';
    }
    return error.message;
  }

  const metamaskError = METAMASK_POSSIBLE_ERRORS[error?.code];
  if (metamaskError) {
    return metamaskError.message;
  }

  if (isJson(error)) {
    error = JSON.parse(JSON.stringify(error));
  }

  if (error?.code === 'CALL_EXCEPTION') {
    if (error?.reason) {
      return error?.reason?.toString();
    }
    return 'Something went wrong.';
  }

  if (error?.reason === 'transaction failed') {
    console.error(error);
    return 'Something went wrong.';
  }

  if (error?.code === 'UNEXPECTED_ARGUMENT') {
    return error?.reason?.toString();
  }

  if (error instanceof TypeError || error instanceof Error) {
    error = error.message?.toString();
  }

  if (error?.data?.message) {
    error = error?.data?.message?.toString();
  }

  if (error.message) {
    return error.message;
  }

  if (error?.error?.message) {
    error = error.error.message;
  }

  if (typeof error !== 'string') {
    console.error(error);
    return 'Something went wrong';
  }

  const [mainMsg, fullSwMsg] = error.split('execution reverted:');

  return (fullSwMsg || mainMsg || 'Internal JSON-RPC error.').toString();
};
