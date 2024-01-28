import { HolderData } from '@aut-labs/sdk';
import { BaseNFTModel } from '@aut-labs/sdk/dist/models/baseNFTModel';
import { Community } from './community.model';
import { NetworkConfig } from '../services/ProviderFactory/web3.connectors';

export interface AutSocial {
  type: string;
  link: string;
  metadata: any;
}

export const DefaultSocials: AutSocial[] = [
  {
    type: 'discord',
    link: '',
    metadata: {},
  },
  {
    type: 'ens',
    link: '',
    metadata: {},
  },
  {
    type: 'twitter',
    link: '',
    metadata: {},
  },
  {
    type: 'github',
    link: '',
    metadata: {},
  },
];

export class AutIDProperties {
  avatar: string;

  thumbnailAvatar: string;

  communities: Community[];

  timestamp: string;

  loginTimestamp: number;

  address: string;

  tokenId: string;

  socials: AutSocial[];

  ethDomain?: string;

  network?: NetworkConfig;

  holderData?: HolderData;

  constructor(data: AutIDProperties) {
    if (!data) {
      this.communities = [];
      this.socials = [];
    } else {
      this.timestamp = data.timestamp;
      this.avatar = data.avatar;
      this.address = data.address;
      this.tokenId = data.tokenId;
      this.communities = (data.communities || []).map((community) => new Community(community));
      this.ethDomain = data.ethDomain;
      this.socials = data.socials || DefaultSocials;
      this.socials = this.socials.filter((s) => s.type !== 'eth');
      this.network = data.network;
      this.holderData = data.holderData;
      this.thumbnailAvatar = data.thumbnailAvatar;
      this.loginTimestamp = data.loginTimestamp;
    }
  }
}

export class AutID extends BaseNFTModel<AutIDProperties> {
  constructor(data: AutID = {} as AutID) {
    super(data);
    this.properties = new AutIDProperties(data.properties);
  }
}
