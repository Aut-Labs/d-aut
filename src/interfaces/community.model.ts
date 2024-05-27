import { RoleSet } from '@aut-labs/sdk/dist/models/nova';
import { BaseNFTModel } from '../services/web3/models';
import { Role } from '../store/aut.reducer';
import { CommitmentMessages } from '../components/CommitmentSlider';

export const MarketTemplates = [
  {
    title: 'Open-Source & Infra',
    market: 1,
    // icon: OpenSource
  },
  {
    title: 'DeFi & Payments',
    market: 2,
    // icon: Defi
  },
  {
    title: 'ReFi & Governance',
    market: 3,
    // icon: Refi
  },
  {
    title: 'Social, Art & Gaming',
    market: 4,
    // icon: Social
  },
  {
    title: 'Identity & Reputation',
    market: 5,
    // icon: Identity
  },
];

export const findRoleName = (roleId: string, rolesSets: RoleSet[]) => {
  const roleSet = (rolesSets || []).find((s) => s.roles.some((r) => r.id.toString() === roleId));
  if (roleSet) {
    const role = roleSet?.roles.find((r) => r.id.toString() === roleId);
    return role?.roleName;
  }
};

export interface AutSocial {
  type: string;
  link: string;
  metadata: any;
}

export interface CommunityDomains {
  note: string;
  domain: string;
}

export class CommunityProperties {
  address?: string;

  market: number | string;

  rolesSets: RoleSet[];

  commitment: number;

  timestamp?: number;

  socials: AutSocial[];

  userData?: {
    role: string;
    roleName?: string;
    commitment: string;
    isAdmin: boolean;
    commitmentDescription?: string;
    isActive?: boolean;
  };

  domains: CommunityDomains[];

  additionalProps?: any;

  constructor(data: CommunityProperties) {
    if (!data) {
      this.rolesSets = [];
    } else {
      this.market = MarketTemplates[data.market]?.title;
      this.commitment = data.commitment;
      this.rolesSets = data.rolesSets;
      this.address = data.address;
      this.socials = data.socials;
      this.domains = data.domains || [];
      this.additionalProps = data.additionalProps;
      this.userData = JSON.parse(JSON.stringify(data?.userData || {})) || ({} as typeof this.userData);

      if (this.userData?.role) {
        this.userData.roleName = findRoleName(this.userData.role, this.rolesSets);
      }

      if (this.userData?.commitment) {
        this.userData.commitmentDescription = CommitmentMessages(+this.userData.commitment);
      }

      this.userData.isAdmin = data.userData.isAdmin;
    }
  }
}

export class Community extends BaseNFTModel<CommunityProperties> {
  constructor(data: Community = {} as Community) {
    super(data);
    this.properties = new CommunityProperties(data.properties);
  }
}

export const DefaultRoles: Role[] = [
  {
    id: 4,
    roleName: 'Core Team',
  },
  {
    id: 5,
    roleName: 'Advisor',
  },
  {
    id: 6,
    roleName: 'Investor',
  },
];
