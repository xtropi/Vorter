# Vorter
Hello everyone. My name is Mukhtar Musaev.
I am making a service that creates groups from people for playing online games.
I want to make a good-look site with authentification, deep settings, chat maybe, integration with steam/discord/telegram/twitch, database,
and most important - algorithm to make a high-compatibility groups from online and in-search registered users.

#####INSTALL#####
firstly create db named vorter
#####Create MongoDB user#####
use admin
db.createUser({user: "<login>", pwd: "<pass>",roles: [{role:"dbOwner", db:"admin"}]})
#####Environments#####
NODE_ENV = development (or production)
VORTER_LOCAL_DB = mongodb://<login>:<pass>@localhost:27017/vorter?authSource=admin
VORTER_REMOTE_DB = mongodb://<login>:<pass>@<mysite.net>:27017/vorter?authSource=admin
