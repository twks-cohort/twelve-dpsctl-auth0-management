# dpsctl-auth0-management

Configuration of Auth0 applications, social integrations, and rules to support the twdps lab dpsctl command line tool.  

The oauth0/oidc flow required by the dpsctl tool is available in the free tier of Auth0. Complete these [bootstrap](doc/bootstrap.md) steps as part of signing up for Auth0 and preparing for the automated management of the Auth0 configuration.  

After completing the bootstrap steps, the github social connection in place and the Management API client endpoint available, now this repo pipeline can manage the Applications and Rules that define the functionality of our oidc endpoint.  

The pipeline has three essential steps:

1. Fetch a management api token to use for creating and updating Auth0 configuration
2. Deploy the dev or prod tenant dpsctl application definition
3. Deploy all rules used by the dpsctl application login process

Since Auth0 is not used to perform any authentication functions, the rules are the steps to take in constructing a jwt to return from a successful authentication.  

In this case that means, if the user is a member of the github org where the github oauth-app is defined (in this case ThoughtWorks-DPS) then they will be able to successfully authenticate, after which:  

* with the users own github access token, fetch all org teams of which the user is a member
* insert those teams as a list into the returned idToken

See repo pipeline for specific details.  