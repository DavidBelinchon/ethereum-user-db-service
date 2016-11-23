# MariaDB database access module

## Installation

```sh
npm install eth-db-service  -g
```

## Usage

The module assumes that mariaDB is running on the host under alias: user-db.
Make sure you name the MariaDB image with this alias in your docker-compose deployment!

```javascript
const DbService = require('eth-db-service');
var dbService = new DbService();
```
Every method returns a promise with the result.

### Check if mobileMapping table exists

```javascript
dbService.checkIfMobileMappingTableExists()
.then(function(result) {
    if(result.lenght == 0) {
      console.log("Tabled does not exist!";)
    }
    //users is an array of user objects
}).catch(function handleError(error) {
    //your error handling goes here
});
```

### Check if userCredentials table exists

```javascript
dbService.checkIfUserCredentialsTableExists()
.then(function(result) {
    if(result.lenght == 0) {
      console.log("Tabled does not exist!";)
    }
    //users is an array of mapping objects 
}).catch(function handleError(error) {
    //your error handling goes here
});
```

### Create mobile mappings table

The table will have two rows:
- address (primary key): the secondary Ethereum address
- value : information used to send the push notification to the mobile App that registered the address

```javascript
dbService.createMobileMappingTable(message,address,password)
.then(function() {
    //do something aftewards
}).catch(function handleError(error) {
    //your error handling goes here
});
```

### Create mobile usersCredentials table

The table will have two rows:
- email (primary key)
- authenticationKey : the primary Ethereum address

```javascript
dbService.createUserCredentialsTable(message,address,password)
.then(function() {
    //do something aftewards
}).catch(function handleError(error) {
    //your error handling goes here
});
```

### Insert new user

```javascript
dbService.insertUserCredentials(email, authenticationKey)
.then(function() {
    //do something aftewards
}).catch(function handleError(error) {
    //your error handling goes here
});
```

### Insert new mapping

```javascript
dbService.insertMapping(address, value)
.then(function() {
    //do something aftewards
}).catch(function handleError(error) {
    //your error handling goes here
});
```

### Get user by email

```javascript
dbService.getUserCredentialsByEmail(email)
.then(function(user) {
    var email = user.emai;
    var authenticationKey = user.authenticationKey;
}).catch(function handleError(error) {
    //your error handling goes here
});
```

### Get mapping by secondary address

```javascript
dbService.getMappingByAddress(address)
.then(function(mapping) {
    var address = mapping.address;
    var secondaryKey = mapping.value;
}).catch(function handleError(error) {
    //your error handling goes here
});
```

### Get all users

```javascript
dbService.getUserCredentials()
.then(function(users) {
    //users is an array of user objects
}).catch(function handleError(error) {
    //your error handling goes here
});
```

### Get all mappings

```javascript
dbService.getMappings()
.then(function(mapping) {
    //users is an array of mapping objects
}).catch(function handleError(error) {
    //your error handling goes here
});
```


### Dependencies

* [mysql](https://github.com/mysqljs/mysql) `npm install mysql --save`
* [Q](https://github.com/kriskowal/q) `npm install q --save`
