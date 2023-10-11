# MedAL-creator API

This API provides access to MedAL-creator project and algorithm. Two versions of the API are available. All routes must start with either `/api/v1` or `/api/v2`.

### API Version 1

| HTTP Verb | Route                                | Description                                  |
|-----------|--------------------------------------|----------------------------------------------|
| GET       | /algorithms                          | Get all projects in Medal Creator            |
| POST      | /algorithms/:id/emergency_content     | Get emergency content for a project         |
| GET       | /algorithms/:id/versions             | Get all algorithms in a given project        |
| GET       | /versions/:id                        | Get algorithm metadata                        |
| GET       | /versions/:version_id/medal_data_config | Get Medal Data configuration for an algorithm |

### API Version 2

| HTTP Verb | Previous Route (API V1)              | Route                                | Description                                  |
|-----------|-------------------------------------|--------------------------------------|----------------------------------------------|
| GET       | /algorithms                          | /projects                            | Get all projects in Medal Creator            |
| POST      | /algorithms/:id/emergency_content     | /projects/:id/emergency_content       | Get emergency content for a project         |
| GET       | /algorithms/:id/versions             | /projects/:id/algorithms             | Get all algorithms in a given project        |
| GET       | /versions/:id                        | /algorithms/:id                      | Get algorithm metadata                        |
| GET       | /versions/:version_id/medal_data_config | /algorithms/:id/medal_data_config     | Get Medal Data configuration for an algorithm |
