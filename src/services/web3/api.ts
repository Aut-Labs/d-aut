import axios from 'axios';
import dateFormat from 'dateformat';
import { ipfsCIDToHttpUrl } from '../storage/storage.hub';
import { InternalErrorTypes } from '../../utils/error-parser';
import { setAutIdsOnDifferentNetworks } from '../../store/aut.reducer';
import { base64toFile, dispatchEvent } from '../../utils/utils';
import { setUserData } from '../../store/user-data.reducer';
import { SWIDParams } from '../../utils/AutIDBadge/Badge.model';
import { AutId } from '../ProviderFactory/web3.connectors';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AutSDK, { Nova, fetchMetadata, queryParamsAsString } from '@aut-labs/sdk';
import { RootState } from '../../store/store.model';
import { OutputEventTypes } from '../../types/event-types';
import { env } from './env';
import { apolloClient } from '../../store/graphql';
import { gql } from '@apollo/client';
import { AutID } from '../../interfaces/autid.model';
import { BaseNFTModel } from '@aut-labs/sdk/dist/models/baseNFTModel';
import { Community } from '../../interfaces/community.model';

export const fetchCommunity = createAsyncThunk('community/get', async (arg, { rejectWithValue, getState }) => {
  const { customIpfsGateway } = (getState() as RootState).walletProvider;
  const sdk = AutSDK.getInstance();

  const novaAddress = await sdk.nova.contract.contract.getAddress();
  const query = gql`
    query GetNovaDAO {
      novaDAO(id: "${novaAddress.toLowerCase()}") {
        id
        address
        market
        minCommitment
        metadataUri
      }
    }
  `;
  const response = await apolloClient.query<any>({
    query,
  });

  const nova = response.data.novaDAO;

  if (!nova) {
    return rejectWithValue(InternalErrorTypes.CouldNotFindCommunity);
  }

  const communityMetadata = await fetch(ipfsCIDToHttpUrl(nova.metadataUri, customIpfsGateway));

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
    minCommitment: Number(nova.minCommitment),
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

    // const nftIdResp = await contract.getNextTokenID();
    const config = {
      name: username.toLowerCase(),
      role: roleName.toString(),
      dao: aut.community.name,
      // hash: `#${nftIdResp.data.toString()}`,
      hash: '1', // @TODO: don't forget to change this.
      network: selectedNetwork?.network.toLowerCase(),
      novaAddress: aut.novaAddress,
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

    const { original, thumbnail } = await sdk.client.sendFileToIPFSWithThumbnail(avatarFile as File);

    const metadataJson = {
      name: username,
      description: `ĀutID are a new standard for self-sovereign Identities that do not depend from the provider,
       therefore, they are universal. They are individual NFT IDs.`,
      image: badgeFile,
      properties: {
        avatar: original,
        thumbnailAvatar: thumbnail,
        timestamp: timeStamp,
      },
    };
    const cid = await sdk.client.sendJSONToIPFS(metadataJson as any);
    const requiredAddress = aut.selectedUnjoinedCommunityAddress || aut.novaAddress;
    const response = await contract.mintAndJoin(username.toLowerCase(), cid, role, commitment, requiredAddress);
    if (!response?.isSuccess) {
      return rejectWithValue(response?.errorMessage);
    }

    const nova = sdk.initService<Nova>(Nova, aut.novaAddress);

    const isAdmin = await nova.contract.admins.isAdmin(selectedAddress);

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
    const requiredAddress = aut.selectedUnjoinedCommunityAddress || aut.novaAddress;
    const result = await contract.joinDAO(userData.role, userData.commitment, requiredAddress);
    if (result.isSuccess) {
      const query = gql`
        query GetAutID {
          autID(id: "${selectedAddress.toLowerCase()}") {
            id
            username
          }
        }
      `;
      const response = await apolloClient.query<any>({
        query,
      });

      const metadataResponse = await fetch(ipfsCIDToHttpUrl(response.data.autID.metadataUri, customIpfsGateway));
      if (metadataResponse.status === 504) {
        return rejectWithValue(InternalErrorTypes.GatewayTimedOut);
      }
      const autId = await metadataResponse.json();

      const nova = sdk.initService<Nova>(Nova, aut.novaAddress);

      const isAdmin = await nova.contract.admins.isAdmin(selectedAddress);

      await dispatch(setUserData({ username: autId.name, isOwner: isAdmin.data }));

      return true;
    }
    return rejectWithValue(result.errorMessage);
  }
);

export const getAutId = createAsyncThunk('membership/get', async (selectedAddress: string, { dispatch, getState, rejectWithValue }) => {
  const { walletProvider } = getState() as RootState;
  const { customIpfsGateway } = walletProvider;
  const sdk = AutSDK.getInstance();

  debugger;

  const query = gql`
    query GetAutID {
      autID(id: "${selectedAddress.toLowerCase()}") {
        id
        username
        tokenID
        novaAddress
        role
        commitment
        metadataUri
      }
    }
  `;
  const response = await apolloClient.query<any>({
    query,
  });

  const { autID } = response.data;

  if (!autID) {
    return rejectWithValue(InternalErrorTypes.AutIDNotFound);
  }

  const autIdMetadata = await fetchMetadata<BaseNFTModel<any>>(autID.metadataUri, customIpfsGateway);
  if (!autIdMetadata) {
    return rejectWithValue(InternalErrorTypes.GatewayTimedOut);
  }

  const nova = sdk.initService<Nova>(Nova, autID.novaAddress);
  const isAdmin = await nova.contract.admins.isAdmin(selectedAddress);
  const novaMetadataUri = await nova.contract.functions.metadataUri();
  const novaMarket = await nova.contract.functions.market();
  const novaMetadata = await fetchMetadata<BaseNFTModel<Community>>(novaMetadataUri, customIpfsGateway);

  const { avatar, thumbnailAvatar, timestamp } = autIdMetadata.properties;

  const userNova = new Community({
    ...novaMetadata,
    properties: {
      ...novaMetadata.properties,
      address: autID.novaAddress,
      market: novaMarket,
      userData: {
        role: autID.role.toString(),
        commitment: autID.commitment.toString(),
        isActive: true,
        isAdmin: isAdmin.data,
      },
    },
  } as unknown as Community);
  const newAutId = new AutID({
    name: autIdMetadata.name,
    image: autIdMetadata.image,
    description: autIdMetadata.description,
    properties: {
      avatar,
      thumbnailAvatar,
      timestamp,
      role: autID.role,
      socials: [],
      address: selectedAddress,
      tokenId: autID.tokenID,
      loginTimestamp: new Date().getTime(),
      network: walletProvider.selectedNetwork,
      communities: [userNova],
    },
  });

  await dispatch(setUserData({ username: newAutId.name }));
  window.localStorage.setItem('aut-data', JSON.stringify(newAutId));
  return newAutId;
});

export const checkAvailableNetworksAndGetAutId = createAsyncThunk(
  'membership/scan',
  async (selectedAddress: string, { rejectWithValue, getState, dispatch }) => {
    // @TODO: fix this to use AutId
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
      // if (aut.novaAddress) {
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

          const nova = sdk.initService<Nova>(Nova, communityAddress);
          const metadataUri = await nova.contract.metadata.getMetadataUri();

          const isAdmin = await nova.contract.admins.isAdmin(selectedAddress);

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
  const queryArgsString = queryParamsAsString({
    skip: 0,
    take: 1,
    filters: [{ prop: 'username', comparison: 'equals', value: requestBody.username.toLowerCase() }],
  });
  const query = gql`
    query GetAutIDs {
      autIDs(${queryArgsString}) {
        username
      }
    }
  `;
  const response = await apolloClient.query({
    query,
  });
  const exists = response?.data?.autIDs?.length > 0;
  if (exists) {
    return rejectWithValue(InternalErrorTypes.UsernameAlreadyTaken);
  }
  return false;
});

export const checkIfAutIdExists = createAsyncThunk('membership/exists', async (selectedAddress: string, { getState, rejectWithValue }) => {
  const { aut } = getState() as RootState;
  const sdk = AutSDK.getInstance();
  const { contract } = sdk.autID;
  const balanceOf = await contract.balanceOf(selectedAddress);

  return balanceOf.data > 0;

  // let hasAutId;
  // if (balanceOf.data > 0) {
  //   hasAutId = true;
  // } else {
  //   return false;
  //   // hasAutId = false;
  // }
  // let holderCommunities = null;
  // try {
  //   holderCommunities = await contract.getHolderDAOs(selectedAddress);
  // } catch (e) {
  //   // if (e?.data?.message?.toString().includes(`AutID: Doesn't have a SW.`)) {
  //   // console.log(e);
  //   // } else {
  //   //   throw e;
  //   // }
  // }
  // if (holderCommunities.data) {
  //   for (const community of holderCommunities.data as unknown as string[]) {
  //     if (community === aut.novaAddress) {
  //       return rejectWithValue(InternalErrorTypes.AutIDAlreadyInThisCommunity);
  //     }
  //   }
  // }
  // return hasAutId;
});
