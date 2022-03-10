## Auth0 tenant configuration

Auth0 plays an important role in enabling a platform cli to use github and github team membership for authentication and authorization with a delivery platform. WHile a critical component, it is also a fairly narrow slice of the overall flow.  

In this use case, the idp plays a limited, pass-through function. When the development user uses the cli the `login`, auth0 coordinates the pass-through to Github for authentication, and it fetches the users 'claims' in the form of their team memberships within the organization. These are inserted into the returned id-token. But that is it. Each individual use of the resulting token involves completely seperate authorization automation depending on the target of the request.  

Because of this, the amount of configuration and the resulting testing is also quite limited. And, since the authenication workflow reuqires human interaction by design, while the configuration of the idp is automated there is a limited amount of automated testing that can used to validate the resulting idp Client. Mostly, when changes to the configuration are needed, the changes are pushed to the dev-tenant and then human interactive testing is used to validate the results.  

**Dependency**  

GiHub: requires creating two oauth-apps in the ThoughtWorks-DPS org. Since this Auth0 configuration is for use with the dpsctl commandline tool, the following twp oauth-apps were created and the client-id and client-secret were stored in the dpsctl secrethub org. (we hit the free-tier limit of 50 secrets in twdps org and are still waiting for the 1password secrets managment service purchase)  

secrethub:  
```
dpsctl/svc/
└── github/
    └── oauth-apps/
        ├── dev-dpsctl/
        │   ├── client-id
        │   └── client-secret
        └── dpsctl/
            ├── client-id
            └── client-secret
```

### Create two Auth0 tenants

* dev-twdpsio
* twdpsio

#### Create Social Connection to Github.com

__note. not found a way to use auth0 management api for creation of social connections, but as this is a one-time event, use of their dashboard interface is not unreasonable.__

Create social connection for each tenant, use the dev-dpsctl github oauth-app credentials for the dev-twdpsio tenant, and the dpsctl github oauth-app credentials for the twdpsio (production) tenant.  

![create social](images/create_social.png)  

Use the following claims with the client-id and client-secret for the respective tenant.  

![social connection setup](images/social_connection_setup.png)  

#### Bootstrap Management API client 

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

Store the credentials into the respective secrets location:  

secrethub:  
```
dpsctl/svc/auth0/
├── dev-twdpsio/
│   └── management-api/
│       ├── client-id
│       └── client-secret
└── twdpsio/
    └── management-api/
        ├── client-id
        └── client-secret
```

The pipeline for management the dpsctl application and login rules will reference the above secrets.  
