# Glean Indexing for Slab

Very MVP type of tool to send Slab posts and users to Glean for indexing in their search. This will only work for organizations
that have a Business or Enterprise plan with Slab as their API is gated behind those plans.

## Scripts

- `yarn install`
- `yarn build`: Build executable version
- `yarn start`: Run executable version
- `yarn dev`: Runs `build` and `start` for you

## Configuration

All configuration is done by environment variables:

- `SLAB_WORKSPACE` = The Slab workspace subdomain (e.g. `mycompany` if the URL is `https://mycompany.slab.com`)
- `SLAB_TOKEN` = A Slab API token from [Developer Settings](https://slab.com/app/admin/developer)
- `GLEAN_WORKSPACE` = The Glean API subdomain (e.g. `mycompany` if the API URL is `https://mycompany.glean.com`)
- `GLEAN_TOKEN` = A Glean API token from the [Admin Console](https://app.glean.com/admin/setup/tokenManagement)
- `BETA_USERS` = A comma-separated list of Glean users that can access the test data source
- `CREATE_DATASOURCE` = Toggles the process to create or update the datasource in Glean (default is true)
- `SYNC_USERS` = Toggles the process to index users for the datasource in Glean (default is true)
- `SYNC_POSTS` = Toggles the process to index posts for the datasource in Glean (default is true)
- `GET_DOCS_COUNT` = Toggles the process to return a count of documents for the datasource in Glean (default is true)
- `IS_TEST` = Toggle whether the datasource during the run is a private test version or the generally available one (default is false)
- `FORCE_REUPLOAD` = Toggle whether Glean should `forceRestartUpload` while processing posts (default is false)
- `BATCH_SIZE` = Glean API batch size for bulk indexing posts (default is 100)

## How It Works

On execution, this will optionally:

1. Create a Datasource in Glean
2. Re-index users in Slab to Glean
3. Re-index posts in Slab to Glean
4. Return a count of processed documents in the Glean datasource

### Datasource

Enabled using the `CREATE_DATASOURCE` environment variable.

This creates or updates a `Slab` Datasource in Glean. 

If `IS_TEST` environment variable is true, the datasource affected will be a test version and only email addresses 
identified in the `BETA_USERS` environment variable will have access to it.

### Reindex Users

Enabled using the `SYNC_USERS` environment variable.

This fetches all user accounts on Slab and sends them for bulk indexing in Glean for the Slab datasource.

### Reindex Posts

Enabled using the `SYNC_POSTS` environment variable.

This will pull all posts from Slab, filter unpublished posts, then submit them to Glean for bulk indexing.


### Additional Documentation

[GraphQL API](https://studio.apollographql.com/public/Slab/variant/current/home)
[Indexing API](https://developers.glean.com/indexing/overview/#section/Introduction)

## Requirements

- Node 16+
- Ensure environment variables are set up (either copy `.env.example` to `.env` and fill it out or provide envvars some other way)



Copyright 2023 Iterable, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
