const TestDatabase = require("../../services/testDataBase")
const User = require("../../model/user")

const testDatabase = new TestDatabase();

beforeAll(async () => {
   return testDatabase.start();
});

afterAll(async () => {
  return testDatabase.stop();
});


afterEach(async () => {
  return await testDatabase.cleanup();
});



describe("principal", () => {


  test("adds an User to the database", async () => {

    expect.assertions(1);
    let userName = "username_test"
    let user = new User(userName, "password", "name", "last name")
    let newUser = await user.registerUser();

    return await expect(newUser.username).toBe(userName)

  })

  describe("Business Validations for user", () => {

    test("raise error validating username with less than 3 characters",  () => {
      expect.assertions(1);
      let userName = "ab"
      let user = new User(userName, "password", "name", "last name")
      return expect(user.validateUserName()).rejects.toMatch('Invalid username, please enter a longer username');
    })


    test("raise error validating paaswords with less than 4 characters",  () => {
      expect.assertions(1);
      let password = "ab"
      let user = new User("userName", password, "name", "last name")
      return expect(user.validatePassword()).rejects.toMatch('Invalid password, please enter a longer username (min 4 characters');
    })


  })

  describe("Searching for a user previously inserted", () => {


    let userId;
    beforeEach(async () => {
      let userName = "userName"
      let user = new User(userName, "password", "name", "last name")
      let newUser = await user.registerUser();
      userId = String(newUser._id);


    })

    test("searching a user by the username", () => {
      expect.assertions(1);
      let userName = "userName"
      return User.findUserByUsername(userName).then(usr => {
        expect(usr.username).toBe(userName)
      })

    })

    test("password matches with the database paassword", () => {
      expect.assertions(1);
      let userName = "userName"
      let user = new User(userName, "password", "name", "last name")
      return user.isPasswordMatch("password").then(usr => {
        expect(usr.username).toBe(userName)
      })

    })

    test("update data of the user", async () => {
      expect.assertions(3);
      let user = new User()
      let updatedUser = await user.updateUser(userId, true, true, "OK");
      expect(updatedUser.acknowledgement).toBeTruthy()
      expect(updatedUser.onLine).toBeTruthy()
      expect(updatedUser.status).toBe("OK")
    })


    test("searching a user by the id ",  () => {
      expect.assertions(1);
      return User.findUserById(userId).then(usr => {
        expect(String(usr._id)).toBe(userId)
      })

    })


  })


  describe("get all users ordered by online status and username", () => {

    beforeEach(async () => {
      let user = new User("CcccUser", "zzzzzzzzz", "name", "last name")
      let newUser = await user.registerUser();
      let otheruser = new User("BbbbUser", "BbbbUser", "name", "last name")
      await otheruser.registerUser();
      otheruser = new User("AaaaUser", "AaaaUser", "name", "last name")
      await otheruser.registerUser();

      await user.updateUser(newUser._id, true, true, "OK");

    })


    test("get users ordered", () => {
      expect.assertions(2);
      let user = new User();
      return User.getUsers().then(listUser => {
        expect(listUser[0].username).toBe("CcccUser")
        expect(listUser[0].onLine).toBeTruthy()
      })
    })



  })





  describe("search users by username", () => {

    beforeEach(async () => {
      let user = new User("CcccUser", "zzzzzzzzz", "name", "last name")
      let newUser = await user.registerUser();
      let otheruser = new User("BbbbUser", "BbbbUser", "name", "last name")
      await otheruser.registerUser();
      otheruser = new User("AaaaUser", "AaaaUser", "name", "last name")
      await otheruser.registerUser();

      await user.updateUser(newUser._id, true, true, "OK");

    })


    test("get users by username search", () => {
      expect.assertions(1);
      let usernametoSearch = 'User'
      return User.findUsersByUsername(usernametoSearch)
          .then(listUser => {
            expect(listUser.length).toBe(3)
          })
    })

    test("get users by username search", () => {
      expect.assertions(1);
      let usernametoSearch = 'ccc'
      return User.findUsersByUsername(usernametoSearch)
          .then(listUser => {
            expect(listUser.length).toBe(1)
          })
    })
  })



  describe("search users by status", () => {

    beforeEach(async () => {
      let user = new User("CcccUser", "zzzzzzzzz", "name", "last name")
      let newUser = await user.registerUser();
      let otheruser = new User("BbbbUser", "BbbbUser", "name", "last name")
      await otheruser.registerUser();
      otheruser = new User("AaaaUser", "AaaaUser", "name", "last name")
      await otheruser.registerUser();

      await user.updateUser(newUser._id, true, true, "OK");

    })


    test("get users by status OK" , () => {
      expect.assertions(1);
      let status = 'OK'
      return User.findUsersByStatus(status)
          .then(listUser => {
            expect(listUser.length).toBe(1)
          })
    })

    test("get users by status UNDEFINED", () => {
      expect.assertions(1);
      let status = 'UNDEFINED'
      return User.findUsersByStatus(status)
          .then(listUser => {
            expect(listUser.length).toBe(2)
          })
    })
  })


})

