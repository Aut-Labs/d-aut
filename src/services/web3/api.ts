import axios from 'axios';
import dateFormat from 'dateformat';
import { ipfsCIDToHttpUrl, storeImageAsBlob, storeMetadata } from '../storage/storage.hub';
import { BaseNFTModel, Community } from './models';
import { InternalErrorTypes } from '../../utils/error-parser';
import { setAutIdsOnDifferentNetworks } from '../../store/aut.reducer';
import { base64toFile, dispatchEvent } from '../../utils/utils';
import { setUserData } from '../../store/user-data.reducer';
import { SWIDParams } from '../../utils/AutIDBadge/Badge.model';
import { AutId, NetworkConfig } from '../ProviderFactory/web3.connectors';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AutSDK, { DAOExpander, fetchMetadata } from '@aut-labs/sdk';
import { RootState } from '../../store/store.model';
import { OutputEventTypes } from '../../types/event-types';
import { env } from './env';
import { constants } from 'ethers';

export const fetchCommunity = createAsyncThunk('community/get', async (arg, { rejectWithValue, getState }) => {
  const { customIpfsGateway } = (getState() as RootState).walletProvider;
  const sdk = AutSDK.getInstance();
  const daoExpander = sdk.daoExpander.contract;
  const metadataUri = await daoExpander.metadata.getMetadataUri();

  if (!metadataUri.isSuccess) {
    return rejectWithValue(InternalErrorTypes.CouldNotFindCommunity);
  }
  // console.log(resp);
  // const communityMetadata = await fetch(cidToHttpUrl(`${resp[2]}/metadata.json`));
  const communityMetadata = await fetch(ipfsCIDToHttpUrl(metadataUri.data, customIpfsGateway));

  if (communityMetadata.status === 504) {
    return rejectWithValue(InternalErrorTypes.GatewayTimedOut);
  }
  const communityJson = await communityMetadata.json();
  // console.log(communityJson);
  // console.log(communityJson.properties.rolesSets[0].roles);
  return {
    // address: communityAddress,
    // image: ipfsCIDToHttpUrl(communityJson.image, false),
    name: communityJson.name,
    description: communityJson.description,
    roles: communityJson.properties.rolesSets[0].roles,
    minCommitment: communityJson.properties.commitment,
    // commitment: details[2].toString(),
  };
});

export async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: 'image/png' });
}

const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1);
    n -= 1; // to make eslint happy
  }
  return new File([u8arr], filename, { type: mime });
};

export const mintMembership = createAsyncThunk(
  'membership/mint',
  async (selectedAddress: string, { getState, dispatch, rejectWithValue }) => {
    const { userData, walletProvider, aut } = getState() as RootState;
    // console.log(userData);
    const { username, picture, role, roleName, commitment } = userData;
    const { selectedNetwork, customIpfsGateway } = walletProvider;
    const timeStamp = dateFormat(new Date(), 'HH:MM:ss | dd/mm/yy');

    const sdk = AutSDK.getInstance();
    const { contract } = sdk.autID;

    const nftIdResp = await contract.getNextTokenID();
    const config = {
      name: username,
      role: roleName.toString(),
      dao: aut.community.name,
      hash: `#${nftIdResp.data.toString()}`,
      network: selectedNetwork?.network.toLowerCase(),
      expanderAddress: aut.daoExpanderAddress,
      timestamp: `${timeStamp}`,
    } as SWIDParams;

    const formData = new FormData();
    const file = dataURLtoFile(userData.picture, 'avatar');
    // const blob = new Blob([fileBuffer], { type: 'image/png' });
    formData.append('avatar', file, 'avatar');
    formData.append('config', JSON.stringify(config));
    const result = await axios({
      method: 'post',
      url: `${env.REACT_APP_API_URL}/autid/user/generateBadge`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // const { toFile } = await AutIDBadgeGenerator(config);
    const badgeFile = await dataUrlToFile(result.data.badge, 'AutID.png');
    const avatarFile = base64toFile(picture, 'avatar');
    const avatarCid = await storeImageAsBlob(avatarFile as File);

    const metadataJson = {
      name: username,
      description: `ĀutID are a new standard for self-sovereign Identities that do not depend from the provider,
       therefore, they are universal. They are individual NFT IDs.`,
      image: badgeFile,
      properties: {
        avatar: avatarCid,
        timestamp: timeStamp,
      },
    };
    const cid = await storeMetadata(metadataJson);
    const requiredAddress = aut.selectedUnjoinedCommunityAddress || aut.daoExpanderAddress;
    const response = await contract.mint(username, cid, role, commitment, requiredAddress);
    if (!response?.isSuccess) {
      return rejectWithValue(response?.errorMessage);
    }

    const expander = sdk.initService<DAOExpander>(DAOExpander, aut.daoExpanderAddress);

    const isAdmin = await expander.contract.admins.isAdmin(selectedAddress);

    await dispatch(setUserData({ isOwner: isAdmin.data }));

    dispatchEvent(OutputEventTypes.Minted, metadataJson);

    return true;
  }
);

export const joinCommunity = createAsyncThunk(
  'membership/join',
  async (selectedAddress: string, { getState, rejectWithValue, dispatch }) => {
    const { aut, userData, walletProvider } = getState() as RootState;

    const sdk = AutSDK.getInstance();
    const { contract } = sdk.autID;
    const { customIpfsGateway } = walletProvider;
    const requiredAddress = aut.selectedUnjoinedCommunityAddress || aut.daoExpanderAddress;
    const result = await contract.joinDAO(userData.role, userData.commitment, requiredAddress);
    if (result.isSuccess) {
      const tokenId = await contract.getTokenIdByOwner(selectedAddress);
      const tokenURI = await contract.getTokenUri(tokenId.data);
      const response = await fetch(ipfsCIDToHttpUrl(tokenURI.data, customIpfsGateway));
      if (response.status === 504) {
        return rejectWithValue(InternalErrorTypes.GatewayTimedOut);
      }
      const autId = await response.json();

      const expander = sdk.initService<DAOExpander>(DAOExpander, aut.daoExpanderAddress);

      const isAdmin = await expander.contract.admins.isAdmin(selectedAddress);

      await dispatch(setUserData({ username: autId.name, isOwner: isAdmin.data }));

      return true;
    }
    return rejectWithValue(result.errorMessage);
  }
);

export const getAutId = createAsyncThunk('membership/get', async (selectedAddress: string, { dispatch, getState, rejectWithValue }) => {
  const { aut, walletProvider } = getState() as RootState;
  const flowMode = aut.flowConfig?.mode;
  const daoAddress = aut.daoExpanderAddress;
  const { customIpfsGateway } = walletProvider;
  const sdk = AutSDK.getInstance();
  const { contract } = sdk.autID;
  const balanceOf = await contract.balanceOf(selectedAddress);
  if (Number(balanceOf.data) === 0) {
    return rejectWithValue(InternalErrorTypes.AutIDNotFound);
  }
  const tokenId = await contract.getTokenIdByOwner(selectedAddress);
  const tokenURI = await contract.getTokenUri(tokenId.data);
  const metadata = await fetchMetadata<any>(tokenURI.data, customIpfsGateway);
  if (!metadata) {
    return rejectWithValue(InternalErrorTypes.GatewayTimedOut);
  }

  const autId = metadata;
  const holderCommunities = await contract.getHolderDAOs(selectedAddress);
  // CHECK FOR UNJOINED COMMUNITIES IF WE'RE NOT IN AUT ID
  // const unjoinedCommunities = [];
  // if (aut.daoExpanderAddress) {
  //   const communityRegistryContract = await Web3DAOExpanderRegistryProvider(walletProvider.networkConfig.communityRegistryAddress);
  //   const communitiesByDeployer = await communityRegistryContract.getDAOExpandersByDeployer(selectedAddress);
  //   // console.log('holderCommunities', holderCommunities);
  //   // console.log(communitiesByDeployer);
  //   for (const address of communitiesByDeployer) {
  //     if (!(holderCommunities as unknown as string[]).includes(address)) {
  //       const communityExtensionContract = await Web3DAOExpanderProvider(address);

  //       const resp = await communityExtensionContract.getDAOData();
  //       const communityMetadata = await fetch(ipfsCIDToHttpUrl(resp[2]));
  //       if (communityMetadata.status === 504) {
  //         throw new Error(InternalErrorTypes.GatewayTimedOut);
  //       }
  //       const communityJson = await communityMetadata.json();
  //       unjoinedCommunities.push({
  //         address,
  //         name: communityJson.name,
  //         description: communityJson.description,
  //         roles: communityJson.properties.rolesSets[0].roles,
  //         minCommitment: communityJson.properties.commitment,
  //       });
  //       // console.log(address);
  //     }
  //   }
  // }

  // if (unjoinedCommunities.length > 0) {
  //   await thunkAPI.dispatch(setUnjoinedCommunities(unjoinedCommunities));
  //   await thunkAPI.dispatch(setJustJoining(true));
  //   // await thunkAPI.dispatch(setCommunityExtesnionAddress(address));
  //   throw new Error(InternalErrorTypes.UserHasUnjoinedCommunities);
  // }
  const communities = await Promise.all(
    (holderCommunities.data as any).map(async (communityAddress) => {
      // * communityExtension: string
      // * role: number
      // * commitment: number
      // * isActive: boolean
      // */
      const result = await contract.getCommunityMemberData(selectedAddress, communityAddress);
      const { role, commitment, isActive } = result.data;
      /**
         * [
                "0xFc53e464D257F0614132D20293154eaE5CE25734",
                {
                    "type": "BigNumber",
                    "hex": "0x03"
                },
                {
                    "type": "BigNumber",
                    "hex": "0x08"
                },
                true
            ]
         */
      const expander = sdk.initService<DAOExpander>(DAOExpander, communityAddress);
      const metadataUri = await expander.contract.metadata.getMetadataUri();
      const isAdmin = await expander.contract.admins.isAdmin(selectedAddress);
      const metadata = await fetchMetadata<BaseNFTModel<Community>>(metadataUri.data, customIpfsGateway);

      const a = new BaseNFTModel({
        ...metadata,
        properties: {
          isAdmin: isAdmin.data,
          address: communityAddress,
          ...metadata?.properties,
          userData: {
            role: role.toString(),
            commitment: commitment.toString(),
            isActive,
          },
        },
      });
      return a;
    })
  );

  if (flowMode === 'dashboard') {
    const activeCommunities = communities.filter((c) => {
      return c.properties?.userData?.isActive;
    });
    if (activeCommunities.length !== 0) {
      const firstCommunityAddress = activeCommunities[0].properties?.address;
      const expander = sdk.initService<DAOExpander>(DAOExpander, firstCommunityAddress);
      const isAdmin = await expander.contract.admins.isAdmin(selectedAddress);
      if (!isAdmin?.data) {
        return rejectWithValue(InternalErrorTypes.OnlyOperatorsCanAccessTheDashboard);
      }
    }
  }

  autId.properties.communities = communities;
  autId.loginTimestamp = new Date().getTime();
  autId.provider = walletProvider.selectedWalletType;
  autId.network = walletProvider.selectedNetwork;
  autId.address = selectedAddress;
  await dispatch(setUserData({ username: autId.name }));

  window.localStorage.setItem('aut-data', JSON.stringify(autId));
  return autId;
});

export const checkAvailableNetworksAndGetAutId = createAsyncThunk(
  'membership/scan',
  async (selectedAddress: string, { rejectWithValue, getState, dispatch }) => {
    const { aut, walletProvider } = getState() as RootState;
    const { selectedNetwork, customIpfsGateway } = walletProvider;
    let autIDs: AutId[] = [];
    try {
      const result = await axios.get(`https://api.skillwallet.id/api/autid/scanNetworks/${selectedAddress}`);
      autIDs = result.data;
    } catch (e) {
      if (e.response.status === 404) {
        return rejectWithValue(InternalErrorTypes.AutIDNotFound);
      }
      return rejectWithValue(e);
    }
    if (autIDs.length > 1) {
      await dispatch(setAutIdsOnDifferentNetworks(autIDs));
      return rejectWithValue(InternalErrorTypes.FoundAutIDOnMultipleNetworks);
    }
    if (autIDs.length === 1) {
      const [holderData] = autIDs;

      if (holderData.network !== selectedNetwork?.network) {
        return rejectWithValue(InternalErrorTypes.FoundAnAutIDOnADifferentNetwork);
      }

      const metadata = await fetchMetadata<any>(holderData.metadataUri, customIpfsGateway);
      if (!metadata) {
        return rejectWithValue(InternalErrorTypes.GatewayTimedOut);
      }

      const autId = metadata;
      const sdk = AutSDK.getInstance();
      const { contract } = sdk.autID;
      const holderCommunities = await contract.getHolderDAOs(selectedAddress);
      // const holderCommunities = await contract.getHolderDAOs(selectedAddress);
      // CHECK FOR UNJOINED COMMUNITIES IF WE'RE NOT IN AUT ID
      // const unjoinedCommunities = [];
      // if (aut.daoExpanderAddress) {
      //   const communityRegistryContract = await Web3DAOExpanderRegistryProvider(walletProvider.networkConfig.communityRegistryAddress);
      //   const communitiesByDeployer = await communityRegistryContract.getDAOExpandersByDeployer(selectedAddress);
      //   // console.log('holderCommunities', holderCommunities);
      //   // console.log(communitiesByDeployer);
      //   for (const address of communitiesByDeployer) {
      //     if (!(holderCommunities as unknown as string[]).includes(address)) {
      //       const communityExtensionContract = await Web3DAOExpanderProvider(address);

      //       const resp = await communityExtensionContract.getDAOData();
      //       const communityMetadata = await fetch(ipfsCIDToHttpUrl(resp[2]));
      //       if (communityMetadata.status === 504) {
      //         throw new Error(InternalErrorTypes.GatewayTimedOut);
      //       }
      //       const communityJson = await communityMetadata.json();
      //       unjoinedCommunities.push({
      //         address,
      //         name: communityJson.name,
      //         description: communityJson.description,
      //         roles: communityJson.properties.rolesSets[0].roles,
      //         minCommitment: communityJson.properties.commitment,
      //       });
      //       // console.log(address);
      //     }
      //   }
      // }

      // if (unjoinedCommunities.length > 0) {
      //   await thunkAPI.dispatch(setUnjoinedCommunities(unjoinedCommunities));
      //   await thunkAPI.dispatch(setJustJoining(true));
      //   // await thunkAPI.dispatch(setCommunityExtesnionAddress(address));
      //   throw new Error(InternalErrorTypes.UserHasUnjoinedCommunities);
      // }

      const communities = await Promise.all(
        (holderCommunities.data as any).map(async (communityAddress) => {
          const response = await contract.getCommunityMemberData(selectedAddress, communityAddress);

          const { role, commitment, isActive } = response.data;

          const expander = sdk.initService<DAOExpander>(DAOExpander, communityAddress);
          const metadataUri = await expander.contract.metadata.getMetadataUri();

          const isAdmin = await expander.contract.admins.isAdmin(selectedAddress);

          const metadata = await fetchMetadata<BaseNFTModel<AutId>>(metadataUri.data, customIpfsGateway);

          const a = new BaseNFTModel({
            ...metadata,
            properties: {
              isAdmin,
              address: communityAddress,
              ...metadata?.properties,
              userData: {
                role: role.toString(),
                commitment: commitment.toString(),
                isActive,
              },
            },
          });
          return a;
        })
      );

      autId.properties.communities = communities;
      autId.loginTimestamp = new Date().getTime();
      autId.provider = walletProvider.selectedWalletType;
      autId.network = walletProvider.selectedNetwork;
      autId.address = selectedAddress;

      window.localStorage.setItem('aut-data', JSON.stringify(autId));
      return autId;
    }
  }
);

export const checkIfNameTaken = createAsyncThunk('membership/nametaken', async (requestBody: { username: string }, { rejectWithValue }) => {
  const sdk = AutSDK.getInstance();
  const { contract } = sdk.autID;
  const tokenId = await contract.getAddressByUsername(requestBody.username);
  if (tokenId.data !== constants.AddressZero) {
    return rejectWithValue(InternalErrorTypes.UsernameAlreadyTaken);
  }
  return false;
});

export const checkIfAutIdExists = createAsyncThunk('membership/exists', async (selectedAddress: string, { getState, rejectWithValue }) => {
  const { aut } = getState() as RootState;
  const sdk = AutSDK.getInstance();
  const { contract } = sdk.autID;
  const balanceOf = await contract.balanceOf(selectedAddress);
  let hasAutId;
  if (balanceOf.data > 0) {
    hasAutId = true;
  } else {
    return false;
    // hasAutId = false;
  }
  let holderCommunities = null;
  try {
    holderCommunities = await contract.getHolderDAOs(selectedAddress);
  } catch (e) {
    // if (e?.data?.message?.toString().includes(`AutID: Doesn't have a SW.`)) {
    // console.log(e);
    // } else {
    //   throw e;
    // }
  }
  if (holderCommunities.data) {
    for (const community of holderCommunities.data as unknown as string[]) {
      if (community === aut.daoExpanderAddress) {
        return rejectWithValue(InternalErrorTypes.AutIDAlreadyInThisCommunity);
      }
    }
  }
  return hasAutId;
});

export const getAppConfig = (): Promise<NetworkConfig[]> => {
  return axios.get(`https://api.skillwallet.id/api/autid/config/network/testing`).then((r) => r.data);
};
