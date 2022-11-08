# MedAl-creator API

## Test server

Create new dump with
```
pg_dump -Fc <your database name> > <filename>.dump
```

Restore database in dev
```
pg_restore -c -d <your database name> <filename>.dump
```

Restore database on test server with
```
dokku postgres:import api < medal_creator_26102022.dump
```
