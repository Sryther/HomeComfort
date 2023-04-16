<img src="../../assets/img/logo-766x766.png" alt="Helix logo" width="256px" height="256px"/>

## Help

### Running a development MongoDB instance

```bash
docker run --name mongo -v "data-helix:/data/db" -e MONGO_INITDB_ROOT_USERNAME=user -e MONGO_INITDB_ROOT_
PASSWORD=password -d -p 27017 mongo
```
