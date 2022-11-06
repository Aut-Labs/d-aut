import { Web3AutIDProvider, Web3DAOExpanderProvider } from '@aut-protocol/abi-types';
import axios from 'axios';
import dateFormat from 'dateformat';
import * as ethers from 'ethers';
import { Web3ThunkProviderFactory } from '../ProviderFactory/web3-thunk.provider';
import { ipfsCIDToHttpUrl, storeImageAsBlob, storeMetadata } from '../storage/storage.hub';
import { BaseNFTModel } from './models';
import { InternalErrorTypes } from '../../utils/error-parser';
import { setAutIdsOnDifferentNetworks, setTempUserData, updateErrorState } from '../../store/aut.reducer';
import { AutIDBadgeGenerator } from '../../utils/AutIDBadge/AutIDBadgeGenerator';
import { base64toFile } from '../../utils/utils';
import { setUserData } from '../../store/user-data.reducer';
import { SWIDParams } from '../../utils/AutIDBadge/Badge.model';
import { AutId, NetworkConfig } from '../ProviderFactory/web3.connectors';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AutSDK from '@aut-protocol/sdk';

const communityProvider = Web3ThunkProviderFactory('Community', {
  provider: Web3DAOExpanderProvider,
  updateErrorStateAction: (message, dispatch) => {
    dispatch(updateErrorState(message));
  },
});

const autIdProvider = Web3ThunkProviderFactory('AutId', {
  provider: Web3AutIDProvider,
  updateErrorStateAction: (message, dispatch) => {
    dispatch(updateErrorState(message));
  },
});

// export const fetchCommunity = communityProvider(
//   {
//     type: 'community/get',
//   },
//   (thunkAPI) => {
//     const { aut } = thunkAPI.getState();
//     const requiredAddress = aut.selectedUnjoinedCommunityAddress || aut.communityExtensionAddress;
//     return Promise.resolve(requiredAddress);
//   },
//   async (contract) => {
//     const resp = await contract.getDAOData();
//     // console.log(resp);
//     // const communityMetadata = await fetch(cidToHttpUrl(`${resp[2]}/metadata.json`));
//     const communityMetadata = await fetch(ipfsCIDToHttpUrl(resp[2]));
//     if (communityMetadata.status === 504) {
//       throw new Error(InternalErrorTypes.GatewayTimedOut);
//     }
//     const communityJson = await communityMetadata.json();
//     // console.log(communityJson);
//     // console.log(communityJson.properties.rolesSets[0].roles);
//     return {
//       // address: communityAddress,
//       // image: ipfsCIDToHttpUrl(communityJson.image, false),
//       name: communityJson.name,
//       description: communityJson.description,
//       roles: communityJson.properties.rolesSets[0].roles,
//       minCommitment: communityJson.properties.commitment,
//       // commitment: details[2].toString(),
//     };
//   }
// );

export const fetchCommunity = createAsyncThunk('community/get', async () => {
  const sdk = AutSDK.getInstance();
  const daoExpander = sdk.daoExpander.contract;
  const metadataUri = await daoExpander.metadata.getMetadataUri();
  debugger;
  // console.log(resp);
  // const communityMetadata = await fetch(cidToHttpUrl(`${resp[2]}/metadata.json`));
  const communityMetadata = await fetch(ipfsCIDToHttpUrl(metadataUri.data));
  if (communityMetadata.status === 504) {
    throw new Error(InternalErrorTypes.GatewayTimedOut);
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

export const mintMembership = autIdProvider(
  {
    type: 'membership/mint',
  },
  (thunkAPI) => {
    const state = thunkAPI.getState() as any;
    const { selectedNetwork, networksConfig } = state.walletProvider;
    const config: NetworkConfig = networksConfig.find((n) => n.network === selectedNetwork);
    return Promise.resolve(config.contracts.autIDAddress);
  },
  async (contract, args, thunkAPI) => {
    const { userData, walletProvider } = thunkAPI.getState();
    // console.log(userData);
    const { username, picture, role, commitment } = userData;
    const { selectedNetwork } = walletProvider;
    const timeStamp = dateFormat(new Date(), 'HH:MM:ss | dd/mm/yyyy');

    const nftIdResp = await contract.getNextTokenID();
    const config = {
      title: `${username}`,
      hash: `#${nftIdResp.toString()}`,
      network: selectedNetwork.toLowerCase(),
      timestamp: `${timeStamp}`,
    } as SWIDParams;

    const { toFile } = await AutIDBadgeGenerator(config);
    const badgeFile = await toFile();
    const avatarFile = base64toFile(picture, 'avatar');
    const avatarCid = await storeImageAsBlob(avatarFile as File);

    const metadataJson = {
      name: username,
      description: `AutID are a new standard for self-sovereign Identities that do not depend from the provider,
       therefore, they are universal. They are individual NFT IDs.`,
      image: badgeFile,
      properties: {
        avatar: avatarCid,
        timestamp: timeStamp,
      },
    };
    const cid = await storeMetadata(metadataJson);
    const metadata = await fetch(ipfsCIDToHttpUrl(cid));
    if (metadata.status === 504) {
      throw new Error(InternalErrorTypes.GatewayTimedOut);
    }
    const metadataJsons = await metadata.json();
    // console.log(metadataJsons);
    // console.log(metadata);
    // console.log('Generated AutID -> ', ipfsCIDToHttpUrl(cid));
    // console.log('Avatar -> ', ipfsCIDToHttpUrl(avatarCid));
    // console.log('Role -> ', role);
    // console.log('Commitment -> ', commitment);

    const { aut } = thunkAPI.getState();
    const requiredAddress = aut.selectedUnjoinedCommunityAddress || aut.communityExtensionAddress;
    await contract.mint(username, cid, role, commitment, requiredAddress);

    await thunkAPI.dispatch(setUserData({ badge: ipfsCIDToHttpUrl(metadataJsons.image) }));
    // return true;
    return true;
  }
);

export const joinCommunity = autIdProvider(
  {
    type: 'membership/join',
  },
  (thunkAPI) => {
    const state = thunkAPI.getState() as any;
    const { selectedNetwork, networksConfig } = state.walletProvider;
    const config: NetworkConfig = networksConfig.find((n) => n.network === selectedNetwork);
    return Promise.resolve(config.contracts.autIDAddress);
  },
  async (contract, args, thunkAPI) => {
    const { aut, userData } = thunkAPI.getState();
    const { selectedAddress } = aut;

    const requiredAddress = aut.selectedUnjoinedCommunityAddress || aut.communityExtensionAddress;
    await contract.joinDAO(userData.role, userData.commitment, requiredAddress, {
      gasLimit: 2000000,
    });
    const tokenId = await contract.getAutIDByOwner(selectedAddress);
    const tokenURI = await contract.tokenURI(tokenId);
    const response = await fetch(ipfsCIDToHttpUrl(tokenURI));
    if (response.status === 504) {
      throw new Error(InternalErrorTypes.GatewayTimedOut);
    }
    const autId = await response.json();

    await thunkAPI.dispatch(setTempUserData({ username: autId.name }));

    return true;
  }
);

export const getAutId = autIdProvider(
  {
    type: 'membership/get',
  },
  (thunkAPI) => {
    const state = thunkAPI.getState() as any;
    const { selectedNetwork, networksConfig } = state.walletProvider;
    const config: NetworkConfig = networksConfig.find((n) => n.network === selectedNetwork);
    return Promise.resolve(config.contracts.autIDAddress);
  },
  async (contract, args, thunkAPI) => {
    const { aut, walletProvider } = thunkAPI.getState();
    const { selectedAddress } = aut;
    const tokenId = await contract.getAutIDByOwner(selectedAddress);
    const tokenURI = await contract.tokenURI(tokenId);
    const response = await fetch(ipfsCIDToHttpUrl(tokenURI));
    if (response.status === 504) {
      throw new Error(InternalErrorTypes.GatewayTimedOut);
    }

    const autId = await response.json();
    const holderCommunities = await contract.getHolderDAOs(selectedAddress);
    // CHECK FOR UNJOINED COMMUNITIES IF WE'RE NOT IN AUT ID
    // const unjoinedCommunities = [];
    // if (aut.communityExtensionAddress) {
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
      (holderCommunities as any).map(async (communityAddress) => {
        // * communityExtension: string
        // * role: number
        // * commitment: number
        // * isActive: boolean
        // */
        const [_, role, commitment, isActive] = await contract.getMembershipData(selectedAddress, communityAddress);

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

        const communityExtensioncontract = await Web3DAOExpanderProvider(communityAddress);

        const resp = await communityExtensioncontract.getDAOData();

        // const isCoreTeam = await communityExtensioncontract.isCoreTeam(selectedAddress);

        /**
         * [
              {
                  "type": "BigNumber",
                  "hex": "0x01"
              },
              "0x7DeF7A0C6553B9f7993a131b5e30AB59386837E0",
              "https://ipfs.io/ipfs/bafkreidjy6xlyf2he4iopzijy7bws3yl34xhwh726ca2xd7temqoqkz6xy",
              {
                  "type": "BigNumber",
                  "hex": "0x08"
              },
              {
                  "type": "BigNumber",
                  "hex": "0x01"
              },
              ""
          ]
         */
        const communityMetadata = await fetch(ipfsCIDToHttpUrl(resp[2]));
        const communityJson = await communityMetadata.json();

        /**
         * {
              "name": "Test Community",
              "description": "A Community for all the DAOHacks participants & organizers",
              "rolesSets": [
                  {
                      "roleSetName": "members",
                      "roles": [
                          {
                              "id": 1,
                              "roleName": "organizer"
                          },
                          {
                              "id": 2,
                              "roleName": "hacker"
                          },
                          {
                              "id": 3,
                              "roleName": "mentor"
                          }
                      ]
                  }
              ],
              "template": 1,
              "image": "https://hub.textile.io/ipfs/bafybeig3voiu5ak7gxxuqaluodcsa2mxrfoi7j4gmw5jetbzca5zljld3i/daohacks.png"
          }
         */
        const a = new BaseNFTModel({
          ...communityJson,
          properties: {
            // isCoreTeam,
            address: communityAddress,
            ...communityJson.properties,
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
    // console.log(autId);
    window.sessionStorage.setItem('aut-data', JSON.stringify(autId));
    return autId;
  }
);

// export const checkAvailableNetworksAndGetAutId = autIdProvider(
//   {
//     type: 'membership/scan',
//   },
//   (thunkAPI) => {
//     const state = thunkAPI.getState() as any;
//     const { selectedNetwork, networksConfig } = state.walletProvider;
//     const config: NetworkConfig = networksConfig.find((n) => n.network === selectedNetwork);
//     return Promise.resolve(config.contracts.autIDAddress);
//   },
//   async (contract, args, thunkAPI) => {
//     const { aut, walletProvider } = thunkAPI.getState();
//     const { selectedAddress } = aut;
//     const { selectedNetwork } = walletProvider;
//     let autIDs: AutId[] = [];
//     try {
//       const result = await axios.get(`https://api.skillwallet.id/api/autid/scanNetworks/${selectedAddress}`);
//       autIDs = result.data;
//     } catch (e) {
//       if (e.response.status === 404) {
//         throw new Error(InternalErrorTypes.AutIDNotFound);
//       } else {
//         throw e;
//       }
//     }
//     if (autIDs.length > 1) {
//       await thunkAPI.dispatch(setAutIdsOnDifferentNetworks(autIDs));
//       throw Error(InternalErrorTypes.FoundAutIDOnMultipleNetworks);
//     }
//     if (autIDs.length === 1) {
//       const [holderData] = autIDs;

//       if (holderData.network !== selectedNetwork) {
//         throw new Error(InternalErrorTypes.FoundAnAutIDOnADifferentNetwork);
//       }
//       const response = await fetch(ipfsCIDToHttpUrl(holderData.metadataUri));
//       if (response.status === 504) {
//         throw new Error(InternalErrorTypes.GatewayTimedOut);
//       }

//       const autId = await response.json();
//       const holderCommunities = await contract.getHolderDAOs(selectedAddress);
//       // CHECK FOR UNJOINED COMMUNITIES IF WE'RE NOT IN AUT ID
//       // const unjoinedCommunities = [];
//       // if (aut.communityExtensionAddress) {
//       //   const communityRegistryContract = await Web3DAOExpanderRegistryProvider(walletProvider.networkConfig.communityRegistryAddress);
//       //   const communitiesByDeployer = await communityRegistryContract.getDAOExpandersByDeployer(selectedAddress);
//       //   // console.log('holderCommunities', holderCommunities);
//       //   // console.log(communitiesByDeployer);
//       //   for (const address of communitiesByDeployer) {
//       //     if (!(holderCommunities as unknown as string[]).includes(address)) {
//       //       const communityExtensionContract = await Web3DAOExpanderProvider(address);

//       //       const resp = await communityExtensionContract.getDAOData();
//       //       const communityMetadata = await fetch(ipfsCIDToHttpUrl(resp[2]));
//       //       if (communityMetadata.status === 504) {
//       //         throw new Error(InternalErrorTypes.GatewayTimedOut);
//       //       }
//       //       const communityJson = await communityMetadata.json();
//       //       unjoinedCommunities.push({
//       //         address,
//       //         name: communityJson.name,
//       //         description: communityJson.description,
//       //         roles: communityJson.properties.rolesSets[0].roles,
//       //         minCommitment: communityJson.properties.commitment,
//       //       });
//       //       // console.log(address);
//       //     }
//       //   }
//       // }

//       // if (unjoinedCommunities.length > 0) {
//       //   await thunkAPI.dispatch(setUnjoinedCommunities(unjoinedCommunities));
//       //   await thunkAPI.dispatch(setJustJoining(true));
//       //   // await thunkAPI.dispatch(setCommunityExtesnionAddress(address));
//       //   throw new Error(InternalErrorTypes.UserHasUnjoinedCommunities);
//       // }

//       const communities = await Promise.all(
//         (holderCommunities as any).map(async (communityAddress) => {
//           // * communityExtension: string
//           // * role: number
//           // * commitment: number
//           // * isActive: boolean
//           // */
//           const [_, role, commitment, isActive] = await contract.getMembershipData(selectedAddress, communityAddress);

//           /**
//          * [
//                 "0xFc53e464D257F0614132D20293154eaE5CE25734",
//                 {
//                     "type": "BigNumber",
//                     "hex": "0x03"
//                 },
//                 {
//                     "type": "BigNumber",
//                     "hex": "0x08"
//                 },
//                 true
//             ]
//          */

//           const communityExtensioncontract = await Web3DAOExpanderProvider(communityAddress);

//           const resp = await communityExtensioncontract.getDAOData();

//           // const isCoreTeam = await communityExtensioncontract.isCoreTeam(selectedAddress);

//           /**
//          * [
//               {
//                   "type": "BigNumber",
//                   "hex": "0x01"
//               },
//               "0x7DeF7A0C6553B9f7993a131b5e30AB59386837E0",
//               "https://ipfs.io/ipfs/bafkreidjy6xlyf2he4iopzijy7bws3yl34xhwh726ca2xd7temqoqkz6xy",
//               {
//                   "type": "BigNumber",
//                   "hex": "0x08"
//               },
//               {
//                   "type": "BigNumber",
//                   "hex": "0x01"
//               },
//               ""
//           ]
//          */
//           const communityMetadata = await fetch(ipfsCIDToHttpUrl(resp[2]));
//           const communityJson = await communityMetadata.json();

//           /**
//          * {
//               "name": "Test Community",
//               "description": "A Community for all the DAOHacks participants & organizers",
//               "rolesSets": [
//                   {
//                       "roleSetName": "members",
//                       "roles": [
//                           {
//                               "id": 1,
//                               "roleName": "organizer"
//                           },
//                           {
//                               "id": 2,
//                               "roleName": "hacker"
//                           },
//                           {
//                               "id": 3,
//                               "roleName": "mentor"
//                           }
//                       ]
//                   }
//               ],
//               "template": 1,
//               "image": "https://hub.textile.io/ipfs/bafybeig3voiu5ak7gxxuqaluodcsa2mxrfoi7j4gmw5jetbzca5zljld3i/daohacks.png"
//           }
//          */
//           const a = new BaseNFTModel({
//             ...communityJson,
//             properties: {
//               // isCoreTeam,
//               address: communityAddress,
//               ...communityJson.properties,
//               userData: {
//                 role: role.toString(),
//                 commitment: commitment.toString(),
//                 isActive,
//               },
//             },
//           });
//           return a;
//         })
//       );
//       autId.properties.communities = communities;
//       autId.loginTimestamp = new Date().getTime();
//       autId.provider = walletProvider.selectedWalletType;
//       autId.network = walletProvider.selectedNetwork;
//       autId.address = selectedAddress;
//       // console.log(autId);
//       window.sessionStorage.setItem('aut-data', JSON.stringify(autId));
//       return autId;
//     }
//   }
// );

export const checkAvailableNetworksAndGetAutId = createAsyncThunk(
  'membership/scan',
  async (arg, { rejectWithValue, getState, dispatch }) => {
    const { aut, walletProvider } = getState() as any;
    const { selectedAddress } = aut;
    const { selectedNetwork } = walletProvider;
    let autIDs: AutId[] = [];
    try {
      const result = await axios.get(`https://api.skillwallet.id/api/autid/scanNetworks/${selectedAddress}`);
      autIDs = result.data;
    } catch (e) {
      if (e.response.status === 404) {
        rejectWithValue(InternalErrorTypes.AutIDNotFound);
      } else {
        throw e;
      }
    }
    if (autIDs.length > 1) {
      await dispatch(setAutIdsOnDifferentNetworks(autIDs));
      rejectWithValue(InternalErrorTypes.FoundAutIDOnMultipleNetworks);
    }
    if (autIDs.length === 1) {
      const [holderData] = autIDs;

      if (holderData.network !== selectedNetwork) {
        rejectWithValue(InternalErrorTypes.FoundAnAutIDOnADifferentNetwork);
      }
      const response = await fetch(ipfsCIDToHttpUrl(holderData.metadataUri));
      if (response.status === 504) {
        rejectWithValue(InternalErrorTypes.GatewayTimedOut);
      }

      const autId = await response.json();
      const sdk = AutSDK.getInstance();
      const holderCommunities = await sdk.autID.autIDContract.getHolderDAOs(selectedAddress);
      // const holderCommunities = await contract.getHolderDAOs(selectedAddress);
      // CHECK FOR UNJOINED COMMUNITIES IF WE'RE NOT IN AUT ID
      // const unjoinedCommunities = [];
      // if (aut.communityExtensionAddress) {
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
        (holderCommunities as any).map(async (communityAddress) => {
          // * communityExtension: string
          // * role: number
          // * commitment: number
          // * isActive: boolean
          // */
          const response = await sdk.autID.autIDContract.getCommunityMemberData(selectedAddress, communityAddress);

          const { role, commitment, isActive } = response.data;

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

          const communityExtensioncontract = await Web3DAOExpanderProvider(communityAddress);

          const resp = await communityExtensioncontract.getDAOData();

          // const isCoreTeam = await communityExtensioncontract.isCoreTeam(selectedAddress);

          /**
         * [
              {
                  "type": "BigNumber",
                  "hex": "0x01"
              },
              "0x7DeF7A0C6553B9f7993a131b5e30AB59386837E0",
              "https://ipfs.io/ipfs/bafkreidjy6xlyf2he4iopzijy7bws3yl34xhwh726ca2xd7temqoqkz6xy",
              {
                  "type": "BigNumber",
                  "hex": "0x08"
              },
              {
                  "type": "BigNumber",
                  "hex": "0x01"
              },
              ""
          ]
         */
          const communityMetadata = await fetch(ipfsCIDToHttpUrl(resp[2]));
          const communityJson = await communityMetadata.json();

          /**
         * {
              "name": "Test Community",
              "description": "A Community for all the DAOHacks participants & organizers",
              "rolesSets": [
                  {
                      "roleSetName": "members",
                      "roles": [
                          {
                              "id": 1,
                              "roleName": "organizer"
                          },
                          {
                              "id": 2,
                              "roleName": "hacker"
                          },
                          {
                              "id": 3,
                              "roleName": "mentor"
                          }
                      ]
                  }
              ],
              "template": 1,
              "image": "https://hub.textile.io/ipfs/bafybeig3voiu5ak7gxxuqaluodcsa2mxrfoi7j4gmw5jetbzca5zljld3i/daohacks.png"
          }
         */
          const a = new BaseNFTModel({
            ...communityJson,
            properties: {
              // isCoreTeam,
              address: communityAddress,
              ...communityJson.properties,
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
      // console.log(autId);
      window.sessionStorage.setItem('aut-data', JSON.stringify(autId));
      return autId;
    }
  }
);

export const checkIfNameTaken = autIdProvider(
  {
    type: 'membership/nametaken',
  },
  (thunkAPI) => {
    const state = thunkAPI.getState() as any;
    const { selectedNetwork, networksConfig } = state.walletProvider;
    const config: NetworkConfig = networksConfig.find((n) => n.network === selectedNetwork);
    return Promise.resolve(config.contracts.autIDAddress);
  },
  async (contract, args) => {
    const tokenId = await contract.getAutIDHolderByUsername(args.username);
    if (tokenId !== ethers.constants.AddressZero) {
      throw new Error(InternalErrorTypes.UsernameAlreadyTaken);
    }
    return false;
  }
);

// export const checkIfAutIdExists = autIdProvider(
//   {
//     type: 'membership/exists',
//   },
//   (thunkAPI) => {
//     const state = thunkAPI.getState() as any;
//     const { selectedNetwork, networksConfig } = state.walletProvider;
//     const config: NetworkConfig = networksConfig.find((n) => n.network === selectedNetwork);
//     return Promise.resolve(config.contracts.autIDAddress);
//   },
//   async (contract, args, thunkAPI) => {
//     const { aut } = thunkAPI.getState();
//     const { selectedAddress } = aut;
//     const balanceOf = await contract.balanceOf(selectedAddress);
//     let hasAutId;
//     if (balanceOf > 0) {
//       hasAutId = true;
//     } else {
//       hasAutId = false;
//     }
//     let holderCommunities = null;
//     try {
//       holderCommunities = await contract.getHolderDAOs(selectedAddress);
//     } catch (e) {
//       // if (e?.data?.message?.toString().includes(`AutID: Doesn't have a SW.`)) {
//       // console.log(e);
//       // } else {
//       //   throw e;
//       // }
//     }
//     if (holderCommunities) {
//       const { aut } = thunkAPI.getState();
//       for (const community of holderCommunities as unknown as string[]) {
//         if (community === aut.communityExtensionAddress) {
//           throw Error(InternalErrorTypes.AutIDAlreadyInThisCommunity);
//         }
//       }
//     }
//     return hasAutId;
//   }
// );

export const checkIfAutIdExists = createAsyncThunk('membership/exists', async (args, { getState, rejectWithValue }) => {
  const { aut } = getState() as any;
  const { selectedAddress } = aut;
  const sdk = AutSDK.getInstance();
  const balanceOf = await sdk.autID.autIDContract.balanceOf(selectedAddress);
  let hasAutId;
  if (balanceOf.data > 0) {
    hasAutId = true;
  } else {
    return false;
    // hasAutId = false;
  }
  let holderCommunities = null;
  try {
    holderCommunities = await sdk.autID.autIDContract.getHolderDAOs(selectedAddress);
  } catch (e) {
    // if (e?.data?.message?.toString().includes(`AutID: Doesn't have a SW.`)) {
    // console.log(e);
    // } else {
    //   throw e;
    // }
  }
  if (holderCommunities) {
    for (const community of holderCommunities as unknown as string[]) {
      if (community === aut.communityExtensionAddress) {
        throw Error(InternalErrorTypes.AutIDAlreadyInThisCommunity);
      }
    }
  }
  return hasAutId;
});

export const getAppConfig = (): Promise<NetworkConfig[]> => {
  return axios.get(`https://api.skillwallet.id/api/autid/config/network/testing`).then((r) => r.data);
};

export const scanNetworks = createAsyncThunk('membership/scan', async (address: string, thunkAPI) => {
  try {
    const result = await axios.get(`https://api.skillwallet.id/api/autid/scanNetworks/${address}`);
    return result.data;
  } catch (e) {
    if (e.response.status === 404) {
      throw new Error(InternalErrorTypes.AutIDNotFound);
    } else {
      throw e;
    }
  }
});

// export const scanNetworks = (address: string): Promise<AutId[]> => {};
