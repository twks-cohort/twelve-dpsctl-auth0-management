## Auth0 tenant configuration

Auth0 plays an important role in enabling a platform cli to use github and github team membership for authentication and authorization with a delivery platform. While a critical component, it is also a fairly narrow slice of the overall flow.  

In this use case, the idp plays a limited, pass-through function. When the development user uses the cli to `login`, auth0 coordinates the pass-through to Github for authentication, and it fetches the users 'claims' in the form of their team memberships within the Github organization. These are inserted into the returned id-token, but that is it. Each individual use of the resulting token involves completely seperate authorization automation depending on the target of the request.  

Because of this, the amount of configuration and the resulting testing is also quite limited. And, since the authenication workflow reuqires human interaction by design, while the configuration of the idp is automated there is a limited amount of automated testing that can used to validate the resulting idp Client. Mostly, when changes to the configuration are needed, the changes are pushed to the dev-tenant and then human interactive testing is used to validate the results.  


###  Create Oauth App in GitHub Organization

To start you need to create both dev and production oauth-apps in your github organization that Auth0 can use to access user information. This example relates to the labs dpsctl cli so it will refer to the oauth-apps as dev-dpsctl and dpsctl (for prod).  

In the **Organization** settings, open `Oauth Apps` under `Developer Settings`

![GitHub Settings](images/github_settings.png)

Using your auth0 Tenant ID for the homepage and callback URLs, create the OAuth Application

> Note: You do not need to check Enable Device Flow here as this will be managed by Auth0

![Register OAuth App](images/github_oauth_app.png)

On the following screen, note the `Client ID`.  Create a new `Client Secret` and note this as well.  It will be needed for the next steps.

### Create Social Connection to Github.com

_note. Not yet found a way to use auth0 management api for creation of social connections_

Create social connection for each tenant, use the dev-dpsctl github oauth-app credentials for the dev auth0 tenant, and the dpsctl github oauth-app credentials for the production tenant.  

![create social](images/create_social.png)  

Use the following claims with the client-id and client-secret for the respective tenant.  

![social connection setup](images/social_connection_setup.png)  

### Bootstrap Management API client

Go to the applications dashboard and create a new client.  

![create application](images/create_mgmt_api.png)  

Set name to `Management API` and choose Machine-to-Machine-Application and the app type.  

![machine to machine application](images/machine-to-machine.png)  

Choose `Auth0 Management API` as the authorized API.  

![Authorize Auth0 Management API](images/authorize-machine-to-machine.png)  

Under Permissions choose `Select: All` and click `Authorize`  

![select all permissions for Management API](images/machine-to-machine-claims.png)  

From the example window, copy the client_id and client_secret.  

![Management API client credentials](images/store-credentials.png)  

Lab members see maintainers notes [here](https://github.com/ThoughtWorks-DPS/documentation-internal/blob/main/doc/maintainers.md).
