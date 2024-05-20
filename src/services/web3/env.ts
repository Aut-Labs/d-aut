import { EnvConfig } from '../../types/d-aut-config';

export const env: Partial<EnvConfig> = {};

interface ApiUrls {
  myAut: string;
  hub: string;
  launchpad: string;
}

export const autUrls = (isDev: boolean): ApiUrls => {
  if (isDev) {
    return {
      myAut: 'https://internal.os.aut.id/',
      hub: 'https://internal.hub.sbs/',
      launchpad: 'https://internal.launch.hub.sbs/',
    };
  }

  return {
    myAut: 'https://os.aut.id/',
    hub: 'https://hub.sbs/',
    launchpad: 'https://launch.hub.sbs/',
  };
};
