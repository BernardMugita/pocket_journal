# Welcome to the Pocket Journal backend service

The backend is configure using: 
    - TypeScript, 
    - Express server
    - Node.js

The DataBase service is MySQL which is configured using:
    
    -Sequelize ORM: The ORM prevents the user from having to interact with 
                    database directly through writing queries. 

                    Instead it defines models with a fixed structure that 
                    defines the DB structure when synced. It also facilitates
                    creating, updating, editing and deleting of database 
                    entries as need arises. 

----------------------------------------------------------------------------------
**Token Based Authentication**

The server is secured using JWT (Json-Web-Token) Authentication which protects all
endpoints outside the authentication scope (i.e login, sign up, otp requesting and 
changing passwords) accessible.

All other endpoint require a valid token that invalidates every 4 hours to prevent
against security breaches. Once the 4 hours elapse a user will be required to log 
in again. 

----------------------------------------------------------------------------------
**Setting Up Server and running service**

After cloning the application (url below for ease of access), you will be required 
to:

# install dependencies 

This will install all the required dependencies for the server to run as expected. 

```bash
npm install
```

# Add a .env file

There is a .env file containing some app variables needed for the server to run, 
you'll create your version of it and replace the following variables with your 
own to run in your development environment. These variables are:

*Server configuration*

- PORT
- HOST

*Database configuration*

- DB_HOST
- DB_USER
- DB_PASS
- DB_NAME

*JWT configuration*

- JSON_SECRET_KEY
- JSON_REFRESH_KEY


*Email handler*

- EMAIL
- APP_PASSWORD

Once replaced the variables with the relevant values, the server should resync, populate 
your database tables with columns and return a "Re-sync success" message. 

The server start is handled by *nodemon* which reloads it everytime a change is made to
the server files. To run the server use:

``` bash
npm run dev:watch
```
At this point your app should run on the specified port and should subsequently communicate
with the front-end side. 

------------------------------------------------------------------------------------------
**API Documentation**

All the APIs and endpoints are well documented using postman documentation services. They 
are well described in terms of their purposes and how to implement them. The link to the 
documentation is shared below for ease of access. 

*Link* - https://www.postman.com/mjbern/workspace/mypublicworkspace/collection/21186759-d5184845-1f68-44a8-96a4-4e292fd210a2?action=share&creator=21186759
