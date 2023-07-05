import { ISDKBiconomyWrapper } from '@aut-labs-private/sdk/dist/models/IBiconomyWrapper';
import { createContext } from 'react';

export const BiconomyContext = createContext({} as { new (config: any): ISDKBiconomyWrapper });
