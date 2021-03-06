[![BCH compliance](https://bettercodehub.com/edge/badge/cmusv-fse/s20-ESN-SA1?branch=master&token=af54cb573e08df4f068cb13365dc21ec1bcbce68)](https://bettercodehub.com/)
[![Maintainability](https://api.codeclimate.com/v1/badges/79a7a5980bd710e7bea8/maintainability)](https://codeclimate.com/repos/5e5fe6f7bff22c5bb3003e33/maintainability)

Iteration 0 - 5
------------------
Member: Four Heros

Space: https://trello.com/b/KmLktaWm/emergency-social-network

App: https://esn-sa1.herokuapp.com/
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



Iteration 1
------------------

**Documentation**

**RESTful API Documentation**
[RESTful API Documentation](https://speca.io/fse_sa1/fse-emergency-social-network-api-doc?key=aacc93e57078c4bbb43b35970f898522)

**Architecture Haiku**
[Architecture Haiku](https://docs.google.com/document/d/1kW7WspNtR8PcprGhZ-GayGlFRFut4ONFt6KqzD6EFNs/edit#)


**Use Case Analysis Model (OOA)**
[Use Case Analysis Model](https://cacoo.com/diagrams/HDRJVsgsFVwhi0Kx/0FB02)

[draw.io](https://drive.google.com/drive/folders/1rb4x9n52O5FiJXx74_Qq20kVCP6WU9mV)

**Mapping classes**
[Use Case Analysis Model](https://docs.google.com/spreadsheets/d/1b9aGNw_K7sWPfep2Gq2bhUFPBNmvl179bw3jbGZpxTI/edit?ts=5e3f600d#gid=0
)







