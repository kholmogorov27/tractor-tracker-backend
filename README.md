# tractor-tracker-backend

## prerequisites (for windows system)

### 1. MongoDB Enterprise via Docker

Steps:
1. Download Docker desktop;
2. pull oficial MongoDB Community Server image `mongodb/mongodb-community-server`
3. run a container with **host port** set to **27017**, container name isnt important

### 2. MongoDB Compass

Steps:
1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Add new Connection with URI: `mongodb://localhost:27017/tractor-tracker`
3. go to `tractor-tracker` DataBase, then to Indexes tab and Create Index: field name: location, type: 2dsphere
