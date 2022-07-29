import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
// import { updateTransactionState } from '../../store/sw-ui-reducer';
import { updateTransactionState, updateErrorState } from '../../store/aut.reducer';
import { ParseErrorMessage } from '../../utils/error-parser';
import { EnableAndChangeNetwork } from './web3.network';
import { BaseThunkArgs, ThunkArgs, GetThunkAPI, AsyncThunkConfig, ProviderEvent, AsyncThunkPayloadCreator } from './web3.thunk.type';

const DefaultProviders: Partial<BaseThunkArgs<any, any>> = {
  updateTransactionStateAction: (state: string, dispatch) => {
    dispatch(updateTransactionState(state));
  },
  updateErrorStateAction: (state: string, dispatch) => {
    dispatch(updateErrorState(state));
  },
};

export const Web3ThunkProviderFactory = <AutContractFunctions = any, AutContractEventTypes = any>(
  type: string,
  stateActions: BaseThunkArgs<AutContractFunctions, AutContractEventTypes>
) => {
  return <Returned, ThunkArg = any>(
    args: ThunkArgs<AutContractEventTypes>,
    contractAddress: (thunkAPI: GetThunkAPI<AsyncThunkConfig>) => Promise<string>,
    thunk: AsyncThunkPayloadCreator<AutContractFunctions, Returned, ThunkArg, AsyncThunkConfig>
  ): AsyncThunk<Returned, ThunkArg, AsyncThunkConfig> => {
    stateActions = {
      ...DefaultProviders,
      ...stateActions,
    };
    const typeName = `[${type}] ${args.type}`;
    return createAsyncThunk<Returned, ThunkArg, AsyncThunkConfig>(typeName, async (arg, thunkAPI) => {
      try {
        const addressOrName = (await contractAddress(thunkAPI)) || (args as any)?.addressOrName;
        if (!addressOrName) {
          throw new Error(`Could not find addressOrName for ${type}`);
        }
        const { aut } = thunkAPI.getState() as any;
        const defaultProvider = await stateActions.provider(addressOrName, {
          event: (args as ProviderEvent<AutContractEventTypes>).event,
          beforeRequest: () => EnableAndChangeNetwork(),
          transactionState: (state) => {
            if (stateActions.updateTransactionStateAction) {
              stateActions.updateTransactionStateAction(state, thunkAPI.dispatch);
            }
          },
        });
        const walletConnectProvider = await stateActions.provider(addressOrName, {
          provider: async () => {
            const web3Provider = new ethers.providers.Web3Provider(aut.provider);
            return web3Provider;
          },
          event: (args as ProviderEvent<AutContractEventTypes>).event,
          transactionState: (state) => {
            if (stateActions.updateTransactionStateAction) {
              stateActions.updateTransactionStateAction(state, thunkAPI.dispatch);
            }
          },
        });
        debugger;
        if (aut.provider) {
          return await thunk(walletConnectProvider, arg, thunkAPI);
        }
        return await thunk(defaultProvider, arg, thunkAPI);
      } catch (error) {
        console.log(error);
        const message = ParseErrorMessage(error);
        if (stateActions.updateErrorStateAction) {
          stateActions.updateErrorStateAction(message, thunkAPI.dispatch);
        }
        return thunkAPI.rejectWithValue(message);
      }
    });
  };
};
