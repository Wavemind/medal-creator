# medal-creator

### Routes for medAL-data

| HTTP Verb | Route API V1 | Route API V2 | Description |
|----------|----------|----------|----------|
| GET | /algorithms | /projects | Get every projects in medAL-creator |
| POST | /algorithms/:id/emergency_content | /projects/:id/emergency_content | Get emergency content for a given project |
| GET | /algorithms/:id/versions | /projects/:id/algorithms | Get every algorithms in a given project |
| GET | /versions/:id | /algorithms/:id | Get Algorithm metadata |
| GET | /versions/:version_id/medal_data_config | /algorithms/:id/medal_data_config | Get given Algorithm medAL-data config |