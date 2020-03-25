const TestDatabase = require("../services/testDataBase")
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



describe("User registration ", () => {


  test("should adds an User to the database", async () => {

    expect.assertions(1);
    let userName = "username_test"
    let user = new User(userName, "password", "name", "last name")
    let newUser = await user.registerUser();

    return await expect(newUser.username).toBe(userName)

  })

})

  describe("Business Validations for user", () => {

    test("raise error validating username with less than 3 characters", async () => {
      expect.assertions(1);
      let userName = "ab";
      let user = new User(userName, "password", "name", "last name")
      return await  expect(user.validateUserName()).rejects.toMatch('Invalid username, please enter a longer username');
    })


    test("raise error validating paaswords with less than 4 characters", async () => {
      expect.assertions(1);
      let password = "ab";
      let user = new User("userName", password, "name", "last name");
      return await  expect(user.validatePassword()).rejects.toMatch('Invalid password, please enter a longer username (min 4 characters');
    })


    test('should pass validation for banned user names', async () =>{
       expect.assertions(1);
       let user = new User('user1', "password", "name", "last name");
      return await  expect(user.validateBannedUsername()).toBeTruthy();
     })


    test('should send an error for banned user names', async () =>{
       expect.assertions(1);
       let user = new User('broadcasthost', "password", "name", "last name");
        return  expect(user.validateBannedUsername())
           .rejects
           .toBe('Invalid username, this username is reserved for the platform. Please enter a different username.');
    })

    test('should validate user names previously registered', async () => {
      expect.assertions(1);

      let user = new User("username_test", "password", "name", "last name");
      await user.registerUser();

      return await  expect(User.usernameExists("username_test")).toBeTruthy();

    })


    test('should validate user names not registered', async () => {
      expect.assertions(1);
      return User.usernameExists("username_not_registered")
          .then(res => {
            return expect(res).toBeFalsy();
          })

    })


  })

  describe('User password validations,', () =>{
    let userId;
    let userName;

    beforeEach(async () => {
       userName = "userNamePassword"
       let user = new User(userName, "password", "name", "last name")
       let newUser = await user.registerUser();
       userId = String(newUser._id);
    })

    test("should password match with the database password", async() => {
      expect.assertions(1);


      let anotherUser = new User(userName, "password", "name", "last name");
      let response = await anotherUser.isPasswordMatch()

      return expect(response.username).toBe(userName);

    })


    test('should send an error message validating password,  password not matching', async() => {
      expect.assertions(1);

      let useePass = new User(userName, "pass", "name", "last name");

      return expect(useePass.isPasswordMatch())
          .rejects.toBe('Invalid username / password.');
    })


    test('should send an error message validation password,  user not exist', async() => {
      expect.assertions(1);
      let user = new User("notauser", "pass", "name", "last name");
      return expect(user.isPasswordMatch())
          .rejects.toBe('Invalid username / password.')
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

    test("searching a user by the username",async  () => {
      expect.assertions(1);
      let userName = "userName"
      await  User.findUserByUsername(userName).then(usr => {
        return expect(usr.username).toBe(userName)
      })

    })


    test("update data of the user", async () => {
      expect.assertions(3);
      let user = new User()
      let updatedUser = await user.updateUser(userId, true, true, "OK");
      expect(updatedUser.acknowledgement).toBeTruthy()
      expect(updatedUser.onLine).toBeTruthy()
      return expect(updatedUser.status).toBe("OK")
    })


    test('update user status (specific status method)', async() =>{
      expect.assertions(1);
      let user = new User()
      let updatedUser = await user.updateUserStatus(userId,  "HELP");
      return await expect(updatedUser.status).toBe("HELP");

    })


    test("searching a user by the id ", async () => {
      expect.assertions(1);
      return await  User.findUserById(userId).then(usr => {
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


    test("get users ordered", async () => {
      expect.assertions(2);
      let user = new User();
      return await  User.getUsers().then(listUser => {
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


    test("get users by username search", async () => {
      expect.assertions(1);
      let usernametoSearch = 'User'
      return await  User.findUsersByParams({"username":usernametoSearch})
          .then(listUser => {
            expect(listUser.length).toBe(3)
          })
    })

    test("get users by username search",async  () => {
      expect.assertions(1);
      let usernametoSearch = 'ccc'
      return await  User.findUsersByParams({"username":usernametoSearch})
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


    test("get users by status OK" , async () => {
      expect.assertions(1);
      let status = 'OK'
      return await  User.findUsersByParams({"status":status})
          .then(listUser => {
            expect(listUser.length).toBe(1)
          })
    })

    test("get users by status UNDEFINED", async() => {
      expect.assertions(1);
      let status = 'UNDEFINED'
      return await  User.findUsersByParams({"status":status})
          .then(listUser => {
            expect(listUser.length).toBe(2)
          })
    })
  })



describe("Tokens", () => {

    test('should generate token for the user', async () =>{
      let userName = "userNameToken"
      let user = new User(userName, "password", "name", "last name")
      await user.registerUser();

      return await user.generateTokens()
          .then(tokens => {
            expect(tokens).toBeDefined();
          })

    })
})


describe("Search for users by id", () => {

  test('should return  true if user exist', async () =>{
    let userName = "userNameToken"
    let user = new User(userName, "password", "name", "last name")
    let newUser = await user.registerUser();

    return await User.userExist(newUser._id)
        .then(userExist => {
          expect(userExist).toBeTruthy()
        })
  })

  test('should return false if user not exist', async () =>{
    return await User.userExist('507f1f77bcf86cd799439011')
        .then(userExist => {
          expect(userExist).toBeFalsy()
        })
  })


})


describe("Sockets", () => {
  let newUser;
  beforeEach(async () => {
    let user = new User("usersocket", "password", "name", "last name")
    newUser = await user.registerUser();
  })

  test('should associate socket to the user', async () =>{
    return await User.insertSocket(newUser._id,'1')
        .then(userResponse => {
          expect(userResponse).toBeDefined()
        })
  })

  test('should remove socket associated to an user', async () =>{

    await User.insertSocket(newUser._id,'1');

    return await User.removeSocket(newUser._id,'1')
        .then(userExist => {
          expect(userExist).toBeDefined()
        })
  })

  test('should reject a promis if socket id doesnt exist', async () =>{

    return expect(User.removeSocket(newUser._id,'2'))
        .rejects.toBe("Socket does not exist");

  })


})


describe("Chat message count", () => {
  let newUser1;
  let newUser2;
  beforeEach(async () => {
    let user = new User("usersocket1", "password", "name", "last name")
    newUser1 = await user.registerUser();

    user = new User("usersocket2", "password", "name", "last name")
    newUser2 = await user.registerUser();
  })

  test('should increase count', async()=>{
      return await expect(User.changeMessageCount(newUser1,newUser2,true))
          .toBeDefined()
  })


})
