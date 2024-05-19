exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://github.com/orgs/twks-cohort/';
  api.idToken.setCustomClaim(namespace + 'teams', event.user.app_metadata.roles);
}
