import axios from 'axios';
import dateFormat from 'dateformat';
import { InternalErrorTypes } from '../../utils/error-parser';
import { base64toFile, dispatchEvent } from '../../utils/utils';
import { setUserData } from '../../store/user-data.reducer';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AutSDK, {
  AutIDNFT,
  AutIDProperties,
  DefaultSocials,
  Hub,
  HubNFT,
  fetchMetadata,
  getOverrides,
  queryParamsAsString,
} from '@aut-labs/sdk';
import { RootState } from '../../store/store.model';
import { OutputEventTypes } from '../../types/event-types';
import { env } from './env';
import { getGraphClient } from '../../store/graphql';
import { gql } from '@apollo/client';
import { AutIdJoinedHubState, DAutHub } from '../../interfaces/hub.model';
import { stateDetails } from './state.util';
import { dataUrlToFile, dataURLtoFile } from './utils';
import { DAutAutID } from '../../interfaces/autid.model';
import { NetworkConfig } from '../../types/network';

export const fetchHubs = async (hubs: string[], customIpfsGateway: string) => {
  const query = gql`
    query GetHubs {
      hubs(where: { address_in: ["${hubs.join('", "')}"] }) {
        address
        domain
        deployer
        minCommitment
        metadataUri
      }
    }
  `;
  const apolloClient = getGraphClient();
  const response = await apolloClient.query<any>({
    query,
  });

  const communities = await Promise.all(
    response.data.hubs.map(async ({ address, domain, metadataUri, deployer, minCommitment }) => {
      let metadata = await fetchMetadata<HubNFT>(metadataUri, customIpfsGateway);
      metadata = metadata ?? new HubNFT({ name: 'Unknown', description: 'Unknown', image: '', properties: {} as any });
      return new DAutHub({
        ...metadata,
        properties: {
          ...metadata.properties,
          minCommitment,
          deployer,
          address,
          domain,
        },
      } as DAutHub);
    })
  );
  return communities;
};

export const fetchAutIdAndHubs = async (
  selectedAddress: string,
  ipfsGateway: string,
  selectedNetwork: NetworkConfig
): Promise<DAutAutID> => {
  if (!selectedAddress) {
    throw new Error('No address provided');
  }
  const query = gql`
        query GetAutID {
          autID(id: "${selectedAddress.toLowerCase()}") {
            id
            metadataUri
            joinedHubs {
              id
              hubAddress
              commitment
              role
            }
          }
        }
      `;
  const apolloClient = getGraphClient();
  const response = await apolloClient.query<any>({
    query,
  });
  const autID = response?.data?.autID;
  if (!autID) {
    throw new Error('AutID not found');
  }
  let metadata = await fetchMetadata<AutIDNFT>(autID.metadataUri, ipfsGateway);
  metadata = metadata ?? new AutIDNFT({ name: 'Unknown', description: 'Unknown', image: '', properties: {} as any });
  const sdk = await AutSDK.getInstance(true);

  const joinedHubs = autID.joinedHubs.map((hub: AutIdJoinedHubState) => {
    return {
      id: hub.id,
      role: hub.role,
      commitment: hub.commitment,
      hubAddress: hub.hubAddress.toLowerCase(),
      isAdmin: false,
    };
  });
  const hubs = await fetchHubs(
    joinedHubs.map((hub: Partial<AutIdJoinedHubState>) => hub.hubAddress),
    ipfsGateway
  );

  const checkIfAdmin = (hub: DAutHub) => {
    const deployedHubState = joinedHubs.find((joinedHub: AutIdJoinedHubState) => joinedHub.hubAddress === hub.properties.address);
    if (hub.properties.deployer.toLowerCase() === selectedAddress.toLowerCase()) {
      deployedHubState.isAdmin = true;
    } else {
      const isAdmin = sdk.initService<Hub>(Hub, hub.properties.address).contract.functions.isAdmin(selectedAddress);
      deployedHubState.isAdmin = isAdmin;
    }
  };
  await Promise.all(hubs.map(checkIfAdmin));

  const dautAutID = new DAutAutID({
    ...metadata,
    properties: {
      ...metadata.properties,
      address: selectedAddress,
      hubs,
      network: selectedNetwork,
      joinedHubs,
    },
  });
  return dautAutID;
};

export const fetchHub = createAsyncThunk('hub/get', async (arg, { rejectWithValue, getState }) => {
  const { hubAddress, ipfsGateway } = stateDetails(getState() as RootState);
  try {
    const hubs = await fetchHubs([hubAddress], ipfsGateway);

    if (!hubs?.length) {
      return rejectWithValue(InternalErrorTypes.CouldNotFindHub);
    }
    return hubs[0];
  } catch (error) {
    return rejectWithValue(InternalErrorTypes.CouldNotFindHub);
  }
});

export const mintMembership = createAsyncThunk(
  'membership/mint',
  async (selectedAddress: string, { getState, dispatch, rejectWithValue }) => {
    const { hubAddress, selectedNetwork, userData, hub } = stateDetails(getState() as RootState);

    const { username, picture, role, roleName, commitment } = userData;
    const timeStamp = dateFormat(new Date(), 'HH:MM:ss | dd/mm/yy');

    const sdk = await AutSDK.getInstance();
    const nftIdResp = await sdk.autID.contract.getNextTokenID();
    const tokenID = nftIdResp.data?.toString();
    const config = {
      name: username.toLowerCase(),
      role: roleName?.toString(),
      dao: hub.name,
      hash: `#${tokenID}`,
      network: selectedNetwork?.network.toLowerCase(),
      hubAddress,
      timestamp: `${timeStamp}`,
    };

    const formData = new FormData();
    const file = dataURLtoFile(userData.picture, 'avatar');
    // const blob = new Blob([fileBuffer], { type: 'image/png' });
    formData.append('avatar', file, 'avatar');
    formData.append('config', JSON.stringify(config));
    const result = await axios({
      method: 'post',
      url: `${env.API_URL}/user/generateBadge`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const badgeFile = await dataUrlToFile(result.data.badge, 'AutID.png');
    const avatarFile = base64toFile(picture, 'avatar');

    const badgeImage = await sdk.client.sendFileToIPFS(badgeFile as File);
    const { original, thumbnail } = await sdk.client.sendFileToIPFSWithThumbnail(avatarFile as File);

    const metadata = new AutIDNFT<AutIDProperties>({
      name: username,
      description: `ĀutID are a new standard for self-sovereign Identities that do not depend from the provider,
       therefore, they are universal. They are individual NFT IDs.`,
      image: badgeImage,
      properties: {
        tokenId: tokenID,
        avatar: original,
        thumbnailAvatar: thumbnail,
        timestamp: timeStamp,
        socials: DefaultSocials,
        bio: '',
        email: '',
      },
    });
    const cid = await sdk.client.sendJSONToIPFS(AutIDNFT.updateAutIDNFT(metadata) as any);
    console.log('username', username);
    console.log('cid', cid);
    console.log('role', role);
    console.log('commitment', commitment);
    console.log('hubAddress', hubAddress);
    const overrides = await getOverrides(sdk.signer);
    const response = await sdk.autID.contract.mintAndJoin(username.toLowerCase(), cid, role, commitment, hubAddress, overrides);
    if (!response?.isSuccess) {
      console.error('Error minting NFT', response.event);
      dispatchEvent(OutputEventTypes.Minted, false);
      return rejectWithValue(response?.errorMessage);
    }

    const hubService = sdk.initService<Hub>(Hub, hubAddress);
    const isAdmin = await hubService.contract.admins.isAdmin(selectedAddress);
    await dispatch(setUserData({ isOwner: isAdmin.data }));

    dispatchEvent(OutputEventTypes.Minted, true);

    return true;
  }
);

export const joinHub = createAsyncThunk('hub/join', async (selectedAddress: string, { getState, rejectWithValue, dispatch }) => {
  const { hubAddress, ipfsGateway, userData, selectedNetwork } = stateDetails(getState() as RootState);

  const sdk = await AutSDK.getInstance();
  const { contract } = sdk.autID;
  const result = await contract.joinHub(userData.role, userData.commitment, hubAddress);
  if (result.isSuccess) {
    console.error('Error joining hub', result.event);
    const autID = await fetchAutIdAndHubs(selectedAddress, ipfsGateway, selectedNetwork);
    const joinedHub = autID.properties.joinedHubs.find((h) => h.hubAddress.toLowerCase() === hubAddress.toLowerCase());

    await dispatch(setUserData({ username: autID.name, isOwner: joinedHub.isAdmin }));
    dispatchEvent(OutputEventTypes.Joined, true);
    return true;
  }
  return rejectWithValue(result.errorMessage);
});

export const loginToAutId = createAsyncThunk('membership/get', async (selectedAddress: string, { dispatch, getState, rejectWithValue }) => {
  const { ipfsGateway, selectedNetwork } = stateDetails(getState() as RootState);
  try {
    const autID = await fetchAutIdAndHubs(selectedAddress, ipfsGateway, selectedNetwork);
    autID.properties.loginTimestamp = new Date().getTime();

    await dispatch(setUserData({ username: autID.name }));
    window.localStorage.setItem('aut-data', JSON.stringify(autID));
    return autID;
  } catch (error) {
    console.error('Err: ', error);
    return rejectWithValue(InternalErrorTypes.AutIDNotFound);
  }
});

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
  const apolloClient = getGraphClient();
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
  const query = gql`
    query GetAutID {
      autID(id: "${selectedAddress.toLowerCase()}") {
        id
      }
    }
  `;
  const apolloClient = getGraphClient();
  const response = await apolloClient.query({
    query,
  });
  return !!response?.data?.autID;
});
