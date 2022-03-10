function (user, context, callback) {
  const namespace = 'https://github.org/ThoughtWorks-DPS/';
  context.idToken[namespace + 'teams'] = user.app_metadata.roles;
  callback(null, user, context);
}