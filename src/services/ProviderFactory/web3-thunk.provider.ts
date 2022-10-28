import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { updateTransactionState } from '../../store/aut.reducer';
import { ParseErrorMessage } from '../../utils/error-parser';
import { EnableAndChangeNetwork } from './web3.network';
import { BaseThunkArgs, ThunkArgs, GetThunkAPI, AsyncThunkConfig, ProviderEvent, AsyncThunkPayloadCreator } from './web3.thunk.type';

const DefaultProviders: Partial<BaseThunkArgs<any, any>> = {
  updateTransactionStateAction: (state: string, dispatch) => {
    dispatch(updateTransactionState(state));
  },
};
export const Web3ThunkProviderFactory = <SWContractFunctions = any, SWContractEventTypes = any>(
  type: string,
  stateActions: BaseThunkArgs<SWContractFunctions, SWContractEventTypes>
) => {
  return <Returned, ThunkArg = any>(
    args: ThunkArgs<SWContractEventTypes>,
    contractAddress: (thunkAPI: GetThunkAPI<AsyncThunkConfig>, args?: any) => Promise<string>,
    thunk: AsyncThunkPayloadCreator<SWContractFunctions, Returned, ThunkArg, AsyncThunkConfig>
  ): AsyncThunk<Returned, ThunkArg, AsyncThunkConfig> => {
    stateActions = {
      ...DefaultProviders,
      ...stateActions,
    };
    const typeName = `[${type}] ${args.type}`;
    // @ts-ignore
    return createAsyncThunk<Returned, ThunkArg, AsyncThunkConfig>(typeName, async (arg, thunkAPI) => {
      try {
        const addressOrName = (await contractAddress(thunkAPI, arg)) || (args as any)?.addressOrName;
        if (!addressOrName) {
          throw new Error(`Could not find addressOrName for ${type}`);
        }
        let state = thunkAPI.getState() as any;
        const { networksConfig, selectedNetwork } = state.walletProvider;
        let { signer } = state.walletProvider;
        const network = networksConfig.find((n) => n.network === selectedNetwork);
        console.log('EnableAndChangeNetwork');
        await EnableAndChangeNetwork(signer.provider.provider, network);
        // get state again in case network was changed silently
        state = thunkAPI.getState() as any;
        signer = state.walletProvider.signer;

        const contractProvider = await stateActions.provider(addressOrName, {
          event: (args as ProviderEvent<SWContractEventTypes>).event,
          signer: async () => signer,
          transactionState: (state) => {
            if (stateActions.updateTransactionStateAction) {
              stateActions.updateTransactionStateAction(state, thunkAPI.dispatch);
            }
          },
        });
        return await thunk(contractProvider, arg, thunkAPI);
      } catch (error) {
        const message = ParseErrorMessage(error);
        if (stateActions.updateErrorStateAction) {
          stateActions.updateErrorStateAction(message, thunkAPI.dispatch);
        }
        return thunkAPI.rejectWithValue(message);
      }
    });
  };
};
