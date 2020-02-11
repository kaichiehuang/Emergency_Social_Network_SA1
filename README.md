<<<<<<< HEAD
# s20-ESN-SA1
YOU ARE *NOT* PERMITTED TO SHARE THIS REPO OUTSIDE THIS GITHUB ORG. YOU ARE *NOT* PERMITTED TO FORK THIS REPO UNDER ANY CIRCUMSTANCES. YOU ARE *NOT* PERMITTED TO CREATE ANY PUBLIC REPOS INSIDE THE CMUSV-FSE ORGANIZATION.  YOU SHOULD HAVE LINKS FROM THIS README FILE TO YOUR PROJECT DOCUMENTS, SUCH AS YOUR REST API SPECS AND YOUR ARCHITECTURE DOCUMENT. *IMPORTANT*: MAKE SURE TO CHECK AND UPDATE YOUR LOCAL GIT CONFIGURATION TO MATCH YOUR LOCAL GIT CREDENTIALS TO YOUR SE-PROJECT GITHUB CREDENTIALS: OTHERWISE YOUR COMMITS WILL NOT BE INCLUDED IN GITHUB STATISTICS AND REPO AUDITS WILL UNDERESTIMATE YOUR CONTRIBUTION. 
=======
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
>>>>>>> development
