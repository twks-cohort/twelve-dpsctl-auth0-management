const axios = require("axios");
const ManagementClient = require("auth0").ManagementClient;

exports.onExecutePostLogin = async (event, api) => {
    const managementClient = new ManagementClient({
        domain: event.tenant.id + ".us.auth0.com",
        clientId: event.secrets.clientId,
        clientSecret: event.secrets.clientSecret
    });

    return managementClient.users.get({ id: event.user.user_id })
        .then((userResponse) =>{
                return userResponse.data.identities.filter((id) => id.provider === "github")[0]
            }
        )
        .then((githubIdentity) => githubIdentity.access_token)
        .then((githubAccessToken) => {
            return axios.request({
                url: "https://api.github.com/user/teams",
                headers: {
                    // use token authorization to talk to GitHub API
                    "Authorization": "token " + githubAccessToken,
                    // remember the application name registered in GitHub?
                    // use it to set User-Agent or request will fail
                    "User-Agent": "dpsctl",
                }
            });
        })
        // extract GitHub team names to array
        .then((githubTeamsResponse) => {
            githubTeamsResponse.data.map((team) => team.organization.login + "/" + team.slug);
            // deny access if not a member of any org teams

            if (githubTeams.length === 0) return api.access.deny("Access denied");

            // add teams to the application metadata
            const userRoles = new Set (event.user.app_metadata.roles || []);
            githubTeams.forEach(role => userRoles.add(role))
            // persist the app_metadata update
            return api.user.setAppMetadata("roles", [...userRoles]);
        })
        .catch(error => {
            // report and log error
            console.log(error)
            api.access.deny("Access denied: error")
        })
}
