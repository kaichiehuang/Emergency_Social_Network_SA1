Iteration 0
------------------
Member: Four Heros

Space: https://trello.com/b/KmLktaWm/emergency-social-network

------------------
How to set up DB env with migrate-mongo
- npm install -g migrate-mongo //install migrate-mongo globally
- cd team_SA1_ESN/migration // go to migration directory
- check port number in the config file migrate-mongo-config.js
- migrate-mongo up     //populate collections of users, reserved_names, etc.
- check your mongoDB for init data!
- (optional) migrate-mongo down   //remove the data and collections; execute it to rollback the latest up script, so execute it many times for total removal

------------------
How to start app for quick dev and debug?

npm run devstart   //use nodemon without restart app during dev.
