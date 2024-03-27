import { EnvConfig } from '../../types/d-aut-config';

export const env: Partial<EnvConfig> = {};

interface ApiUrls {
  tryAut: string;
  novaDashboard: string;
  myAut: string;
  showcase: string;
  leaderboard: string;
  expander: string;
}

export const autUrls = (isDev: boolean): ApiUrls => {
  if (isDev) {
    return {
      tryAut: 'https://try-internal.aut.id/',
      novaDashboard: 'https://nova-internal.aut.id/',
      myAut: 'https://os-internal.aut.id/',
      showcase: 'https://showcase-internal.aut.id/',
      leaderboard: 'https://leaderboard-internal.aut.id/',
      expander: 'https://expander-internal.aut.id/',
    };
  }

  return {
    tryAut: 'https://try.aut.id/',
    novaDashboard: 'https://nova.aut.id/',
    myAut: 'https://my.aut.id/',
    showcase: 'https://showcase.aut.id/',
    leaderboard: 'https://leaderboard.aut.id/',
    expander: 'https://expander.aut.id/',
  };
};
