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


# Test server database restoration

To restore a database on a test server, follow these steps:

## Step 1: Create a database dump
Create a new database dump from your source database using the `pg_dump` command. Replace `<your database name>` with the name of your database and `<filename>` with the desired name for the dump file:
```
pg_dump -Fc <your database name> > <filename>.dump
```

## Step 2: Restore database on the test server
For dokku usage, follow these steps:
```
dokku postgres:unlink api api && dokku postgres:destroy api && dokku postgres:create api && dokku postgres:link api api
dokku postgres:import api < medal_creator_[dateofdump].dump
```


## Optional: Restore database in development environment
```
pg_restore -c -d <your database name> <filename>.dump
```
