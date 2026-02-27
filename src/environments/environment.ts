export const environment = {
  production: true,
  apiUrl: 'https://aca-services-openswetro.grayhill-df08ba08.eastus2.azurecontainerapps.io/api/v1',
  challenges: {
    'the-long-walk': {
      leagueSlug: 'polar-colombia',
      challengeId: 1130,
    },
  } as Record<string, { leagueSlug: string; challengeId: number }>,
  appName: 'OpenSwetro',
  appDescription: 'OpenSwetro - Your Ultimate Coding Challenge Platform',
  appImageUrl:
    'https://stgswetro.blob.core.windows.net/images/leagues/b5c0096f-45d1-47f4-9e0f-eb685dbfec02/638698933192772194_profile.webp',
  appUrl: 'http://localhost:4200',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es'],
};
