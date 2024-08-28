import { HubNFT } from '@aut-labs/sdk';
import { HubProperties as BaseHubProperties } from '@aut-labs/sdk/dist/models/hub';
import { Role } from '@aut-labs/sdk/dist/models/role';

export interface AutIdJoinedHubState {
  id: string;
  role: string | number;
  commitment: string | number;
  hubAddress: string;
  isAdmin: boolean;
}

export class HubProperties extends BaseHubProperties {
  address: string;

  domain: string;

  autIdState?: AutIdJoinedHubState;

  constructor(data: HubProperties) {
    super(data);
    this.address = data.address;
    this.domain = data.domain;
    this.autIdState = data.autIdState;
  }
}

export class DAutHub<T = HubProperties> extends HubNFT<T> {
  constructor(data: DAutHub<T> = {} as DAutHub<T>) {
    super(data);
    this.properties = new HubProperties((data.properties || {}) as HubProperties) as T;
  }

  get roles(): Role[] {
    return (this.properties as HubProperties).rolesSets[0].roles;
  }
}
