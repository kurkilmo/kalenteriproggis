# Kalenteriproggis aka RyhmäKalenteri
For lack of a better name.

Repository of University of Jyväskylä's course TIEA207 project, a social calendar application.

## Authors
- Ilmo Kurki
- Valtteri Luukkala
- Mikko Oinonen
- Vilma Vartiainen


## Info
A social calendar where you can join groups and follow organizations' events.

You can see your group members' events as blacked out blocks so it's easier to organize new events everyone can attend.

## Frontend
- React Native
- Expo-router

## Backend
- Node.js
- Express
- MySQL


## Setting up the production environment
### .env file
To connect to your MySQL database, you need to create a .env file. The .env file should contain following information:
- MYSQL_HOST="host location here"
- MYSQL_USER="username"
- MYSQL_PASSWORD="password"
- MYSQL_DATABASE="database name"

Additionally you want to add following information to your .env file:
- SALTROUNDS="number of salt rounds"
- SECRET="your secret"

If you decide to add organizations you can also add links to them here.

### Starting backend
For your first run you should run `npm install` once in backend folder.

To start backend run following command in backend folder.

`npm run start`

### Starting frontend
For your first run you should run `npm install` once in backend folder.

To start frontend run following command in backend folder.

`npm run start`

## Licensing
Licensed under the [MIT](LICENSE) license.
Project dependencies may use different licenses.
