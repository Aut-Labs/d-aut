import { Web3AutIDProvider, Web3DAOExpanderProvider, Web3DAOExpanderRegistryProvider } from '@aut-protocol/abi-types';
import dateFormat from 'dateformat';
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as ethers from 'ethers';
import { Web3ThunkProviderFactory } from '../ProviderFactory/web3-thunk.provider';
import { ipfsCIDToHttpUrl, storeImageAsBlob, storeMetadata } from '../storage/storage.hub';
import { EnableAndChangeNetwork } from '../ProviderFactory/web3.network';
import { BaseNFTModel } from './models';
import { env } from './env';
import { InternalErrorTypes, ParseErrorMessage } from '../../utils/error-parser';
import {
  setCommunityExtesnionAddress,
  setJustJoining,
  setTempUserData,
  setUnjoinedCommunities,
  updateErrorState,
} from '../../store/aut.reducer';
import { AutIDBadgeGenerator } from '../../utils/AutIDBadge/AutIDBadgeGenerator';
import { base64toFile } from '../../utils/utils';
import { setUserData } from '../../store/user-data.reducer';
import { SWIDParams } from '../../utils/AutIDBadge/Badge.model';

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

export const fetchCommunity = communityProvider(
  {
    type: 'community/get',
  },
  (thunkAPI) => {
    const { aut } = thunkAPI.getState();
    const requiredAddress = aut.selectedUnjoinedCommunityAddress || aut.communityExtensionAddress;
    return Promise.resolve(requiredAddress);
  },
  async (contract) => {
    const resp = await contract.getDAOData();
    // console.log(resp);
    // const communityMetadata = await fetch(cidToHttpUrl(`${resp[2]}/metadata.json`));
    const communityMetadata = await fetch(ipfsCIDToHttpUrl(resp[2]));
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
  }
);

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
    const { walletProvider } = thunkAPI.getState();
    return Promise.resolve(walletProvider.networkConfig.autIdAddress);
  },
  async (contract, args, thunkAPI) => {
    const { userData, walletProvider } = thunkAPI.getState();
    // console.log(userData);
    const { username, picture, role, commitment } = userData;
    const timeStamp = dateFormat(new Date(), 'HH:MM:ss | dd/mm/yyyy');

    const config = {
      title: `${username}`,
      hash: '#1',
      network: walletProvider.networkConfig.network.chainName.toLowerCase(),
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
    try {
      const requiredAddress = aut.selectedUnjoinedCommunityAddress || aut.communityExtensionAddress;
      await contract.mint(username, cid, role, commitment, requiredAddress);
    } catch (e) {
      throw new Error(InternalErrorTypes.UserNotAMemberOfThisDaoMint);
    }
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
    const { walletProvider } = thunkAPI.getState();
    return Promise.resolve(walletProvider.networkConfig.autIdAddress);
  },
  async (contract, args, thunkAPI) => {
    const { aut, userData } = thunkAPI.getState();
    const { selectedAddress } = aut;

    try {
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
    } catch (e) {
      throw new Error(InternalErrorTypes.UserNotAMemberOfThisDaoJoin);
    }
    return true;
  }
);

export const getAutId = autIdProvider(
  {
    type: 'membership/get',
  },
  (thunkAPI) => {
    const { walletProvider } = thunkAPI.getState();
    return Promise.resolve(walletProvider.networkConfig.autIdAddress);
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
    const unjoinedCommunities = [];
    if (aut.communityExtensionAddress) {
      const communityRegistryContract = await Web3DAOExpanderRegistryProvider(walletProvider.networkConfig.communityRegistryAddress);
      const communitiesByDeployer = await communityRegistryContract.getDAOExpandersByDeployer(selectedAddress);
      // console.log('holderCommunities', holderCommunities);
      // console.log(communitiesByDeployer);
      for (const address of communitiesByDeployer) {
        if (!(holderCommunities as unknown as string[]).includes(address)) {
          const communityExtensionContract = await Web3DAOExpanderProvider(address);

          const resp = await communityExtensionContract.getDAOData();
          const communityMetadata = await fetch(ipfsCIDToHttpUrl(resp[2]));
          if (communityMetadata.status === 504) {
            throw new Error(InternalErrorTypes.GatewayTimedOut);
          }
          const communityJson = await communityMetadata.json();
          unjoinedCommunities.push({
            address,
            name: communityJson.name,
            description: communityJson.description,
            roles: communityJson.properties.rolesSets[0].roles,
            minCommitment: communityJson.properties.commitment,
          });
          // console.log(address);
        }
      }
    }

    if (unjoinedCommunities.length > 0) {
      await thunkAPI.dispatch(setUnjoinedCommunities(unjoinedCommunities));
      await thunkAPI.dispatch(setJustJoining(true));
      // await thunkAPI.dispatch(setCommunityExtesnionAddress(address));
      throw new Error(InternalErrorTypes.UserHasUnjoinedCommunities);
    }

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

        const isCoreTeam = await communityExtensioncontract.isCoreTeam(selectedAddress);

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
            isCoreTeam,
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
    // console.log(autId);
    window.sessionStorage.setItem('aut-data', JSON.stringify(autId));
    return autId;
  }
);

export const checkIfNameTaken = autIdProvider(
  {
    type: 'membership/nametaken',
  },
  (thunkAPI) => {
    const { walletProvider } = thunkAPI.getState();
    return Promise.resolve(walletProvider.networkConfig.autIdAddress);
  },
  async (contract, args) => {
    const tokenId = await contract.autIDUsername(args.username);
    if (tokenId !== ethers.constants.AddressZero) {
      throw new Error(InternalErrorTypes.UsernameAlreadyTaken);
    }
    return false;
  }
);

export const checkIfAutIdExists = autIdProvider(
  {
    type: 'membership/exists',
  },
  (thunkAPI) => {
    const { walletProvider } = thunkAPI.getState();
    return Promise.resolve(walletProvider.networkConfig.autIdAddress);
  },
  async (contract, args, thunkAPI) => {
    const { aut } = thunkAPI.getState();
    const { selectedAddress } = aut;
    const balanceOf = await contract.balanceOf(selectedAddress);
    let hasAutId;
    if (balanceOf > 0) {
      hasAutId = true;
    } else {
      hasAutId = false;
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
    if (holderCommunities) {
      const { aut } = thunkAPI.getState();
      for (const community of holderCommunities as unknown as string[]) {
        if (community === aut.communityExtensionAddress) {
          throw Error(InternalErrorTypes.AutIDAlreadyInThisCommunity);
        }
      }
    }
    return hasAutId;
    // const tokenId = await contract.getAutIDByOwner(selectedAddress);
    // if (tokenId) {
    //   await thunkAPI.dispatch(setJustJoining(true));
    //   // return true;
    //   throw new Error(InternalErrorTypes.AutIDAlreadyExistsForAddress);
    // }
    // const tokenURI = await contract.tokenURI(tokenId);
    // const response = await fetch(ipfsCIDToHttpUrl(tokenURI));
    // const autId = await response.json();

    //   return false;
    // } catch (error) {
    //   if (error?.code === 'CALL_EXCEPTION') {
    //     if (error?.reason?.toString().includes('The AutID owner is invalid')) return false;
    //   }
    //   // console.log(error);
    //   throw error;
    // }
  }
);
