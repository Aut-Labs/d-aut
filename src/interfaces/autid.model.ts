import { AutIDNFT, AutIDProperties as BaseAutIDProperties } from '@aut-labs/sdk/dist/models/aut.model';
import { NetworkConfig } from '../types/network';
import { AutIdJoinedHubState, DAutHub } from './hub.model';

export class AutIDProperties extends BaseAutIDProperties {
  hubs: DAutHub[];

  loginTimestamp?: number;

  address: string;

  network: NetworkConfig;

  joinedHubs: AutIdJoinedHubState[];

  constructor(data: AutIDProperties) {
    super(data);
    if (!data) {
      this.hubs = [];
      this.joinedHubs = [];
    } else {
      this.hubs = data.hubs.map((hub) => new DAutHub(hub));
      this.loginTimestamp = data.loginTimestamp;
      this.address = data.address;
      this.network = data.network;
      this.joinedHubs = data.joinedHubs;
    }
  }
}

export class DAutAutID<T = AutIDProperties> extends AutIDNFT<T> {
  constructor(data: DAutAutID<T> = {} as DAutAutID<T>) {
    super(data);
    this.properties = new AutIDProperties((data.properties || {}) as AutIDProperties) as T;
  }
}
