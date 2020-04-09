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
    test("Registers a User to the database", async () => {
        expect.assertions(1);
        let userName = "username_test"
        let user = new User()
        user.setRegistrationData(userName, "password");
        let newUser = await user.registerUser();
        return await expect(newUser.username).toBe(userName)
    })
})
//
describe("Business Validations for user", () => {
    test("raise error validating username with less than 3 characters", async () => {
        expect.assertions(1);
        let userName = "ab";
        let user = new User()
        user.setRegistrationData(userName, "password");

        return await expect(user.validateUserName()).rejects.toMatch('Invalid username, please enter a longer username');
    })
    test("raise error validating paaswords with less than 4 characters", async () => {
        expect.assertions(1);
        let password = "ab";
        let user = new User();
        user.setRegistrationData("userName", password);
        return await expect(user.validatePassword()).rejects.toMatch('Invalid password, please enter a longer username (min 4 characters');
    })
    test('should pass validation for banned user names', async () => {
        expect.assertions(1);
        let user = new User();
        user.setRegistrationData('user1', "password");
        return await expect(user.validateBannedUsername()).toBeTruthy();
    })
    test('should send an error for banned user names', async () => {
        expect.assertions(1);
        let user = new User();
        user.setRegistrationData('broadcasthost', "password");
        return expect(user.validateBannedUsername()).rejects.toBe('Invalid username, this username is reserved for the platform. Please enter a different username.');
    })
    test('should validate user names previously registered', async () => {
        expect.assertions(1);
        let user = new User();
        user.setRegistrationData("username_test", "password");
        await user.registerUser();
        return await expect(User.usernameExists("username_test")).toBeTruthy();
    })
    test('should validate user names not registered', async () => {
        expect.assertions(1);
        return User.usernameExists("username_not_registered").then(res => {
            return expect(res).toBeFalsy();
        })
    })
})
describe('User password validations,', () => {
    let userId;
    let userName;
    beforeEach(async () => {
        userName = "userNamePassword"
        let user = new User()
        user.setRegistrationData(userName, "password");

        let newUser = await user.registerUser();
        userId = String(newUser._id);
    })
    test("should password match with the database password", async () => {
        expect.assertions(1);
        let anotherUser = new User();
        anotherUser.setRegistrationData(userName, "password");
        let response = await anotherUser.isPasswordMatch()
        return expect(response.username).toBe(userName);
    })
    test('should send an error message validating password,  password not matching', async () => {
        expect.assertions(1);
        let userPass = new User();
        userPass.setRegistrationData(userName, "pass");
        return expect(userPass.isPasswordMatch()).rejects.toBe('Invalid username / password.');
    })
    test('should send an error message validation password,  user not exist', async () => {
        expect.assertions(1);
        let user = new User();
        user.setRegistrationData("notauser", "pass");
        return expect(user.isPasswordMatch()).rejects.toBe('Invalid username / password.')
    })
})
describe("Searching and update operations on a user previously inserted", () => {
    let userId;
    beforeEach(async () => {
        let userName = "userName"
        let user = new User()
        user.setRegistrationData(userName, "password");

        let newUser = await user.registerUser();
        userId = String(newUser._id);
    })
    test("searching a user by the username", async () => {
        expect.assertions(1);
        let userName = "userName"
        await User.findUserByUsername(userName).then(usr => {
            return expect(usr.username).toBe(userName)
        })
    })
    test("update data of the user", async () => {
        expect.assertions(3);
        let user = new User()
        let updatedUser = await user.updateUser(userId, {
            "acknowledgement": true,
            "onLine":true,
            "status":"OK"
        });
        expect(updatedUser.acknowledgement).toBeTruthy()
        expect(updatedUser.onLine).toBeTruthy()
        return expect(updatedUser.status).toBe("OK")
    })
    test('update user status (specific status method)', async () => {
        expect.assertions(1);
        let user = new User()
        let updatedUser = await user.updateUser(userId, {"status":"HELP"});
        return await expect(updatedUser.status).toBe("HELP");
    })
    test("searching a user by the id ", async () => {
        expect.assertions(1);
        return await User.findUserById(userId).then(usr => {
            expect(String(usr._id)).toBe(userId)
        })
    })
})
describe("Update operations on a user - profile information and validation rules", () => {
    let userId;
    beforeEach(async () => {
        let userName = "profileUser"
        let user = new User()
        user.setRegistrationData(userName, "password");

        let newUser = await user.registerUser();
        userId = String(newUser._id);
    })
    //1.
    test("update data validation required fields - user info step 1 - empty data", async () => {
        let user = new User()
        return await expect(user.updateUser(userId, {
            //step1
            "step": 1,

            "name": "",
            "last_name": "",
            "phone_number": "",
            "address": "",
            "city": "",
            "birth_date": "",
            "emergency_contact":{
                "name": "",
                "phone_number": "",
                "address": "",
                "email": ""
            },
            "privacy_terms_data_accepted": null
        }))
        .rejects.toMatch('Missing required fields. Every field in this step is mandatory.');
    })
    test("update data validation required fields - user info step 1 - missing some data", async () => {
        let user = new User()
        return await expect(user.updateUser(userId, {
            //step1
            "step": 1,

            "name": "name",
            "last_name": "apellido",
            "phone_number": "31321",
            "address": "sssssss",
            "city": "Sunnyvale",
            "birth_date": "",
            "emergency_contact":{
                "name": "Juan",
                "phone_number": "",
                "address": ""
            },
            "privacy_terms_data_accepted": null
        }))
        .rejects.toMatch('Missing required fields. Every field in this step is mandatory.');
    })
    test("update data validation required fields - user info step 1 - all data, missing data treatment acceptance", async () => {
        let user = new User()
        return await expect(user.updateUser(userId, {
            //step1
            "step": 1,

            "name": "name",
            "last_name": "apellido",
            "phone_number": "31321",
            "address": "sssssss",
            "city": "Sunnyvale",
            "birth_date": "2000-01-01",
            "emergency_contact":{
                "name": "Juan",
                "phone_number": "336999645",
                "address": "432 easy street"
            },
            "privacy_terms_data_accepted": null
        }))
        .rejects.toMatch('Please accept the term and conditions for personal data treatment');
    })
    test("update data validation required fields - user info step 1 - all data, phone length", async () => {
        let user = new User()
        return await expect(user.updateUser(userId, {
            //step1
            "step": 1,

            "name": "name",
            "last_name": "apellido",
            "phone_number": "31321",
            "address": "sssssss",
            "city": "Sunnyvale",
            "birth_date": "2000-01-01",
            "emergency_contact":{
                "name": "Juan",
                "phone_number": "336999645",
                "address": "432 easy street"
            },
            "privacy_terms_data_accepted": 1
        }))
        .rejects.toMatch('Every phone number must have more than 7 characters.');
    })
    test("update data validation OK - user info step 1 - all data complete", async () => {
        let user = new User()
        user = await user.updateUser(userId, {
            //step1
            "step": 1,

            "name": "name",
            "last_name": "apellido",
            "phone_number": "44444444",
            "address": "sssssss",
            "city": "Sunnyvale",
            "birth_date": "2000-01-01",
            "emergency_contact":{
                "name": "Juan",
                "phone_number": "336999645",
                "address": "432 easy street"
            },
            "privacy_terms_data_accepted": 1
        });

        return expect(user.phone_number).toMatch('44444444');
    })
    test("update data validation required fields - user info step 2 - blood type required", async () => {
        let user = new User()
        return await expect(user.updateUser(userId, {
            //step1
            "step": 2,

            "medical_information":{
                "blood_type": "",
                "allergies": "",
                "prescribed_drugs": "",
                "privacy_terms_medical_accepted": null,
            },
        }))
        .rejects.toMatch('Blood type is a mandatory field, please select a valid blood type');
    })
    test("update data validation required fields - user info step 2 - data treatment medical info required", async () => {
        let user = new User()
        return await expect(user.updateUser(userId, {
            //step1
            "step": 2,

            "medical_information":{
                "blood_type": "AB+",
                "allergies": "",
                "prescribed_drugs": "",
                "privacy_terms_medical_accepted": null,
            },
        }))
        .rejects.toMatch('Please accept the term and conditions for medical data treatment');
    })
    test("update data validation OK - user info step 2 - all data complete", async () => {
        let user = new User()
        user = await user.updateUser(userId, {
            //step1
            "step": 2,

            "medical_information":{
                "blood_type": "AB+",
                "allergies": "list of allergies",
                "prescribed_drugs": "",
                "privacy_terms_medical_accepted": 1,
            },
        });

        return expect(user.medical_information.allergies).toMatch('list of allergies');
    })
    test("update data validation required fields - user info step 3 - security question and answer", async () => {
        let user = new User()
        return await expect(user.updateUser(userId, {
            //step1
            "step": 3,

            "personal_message":{
                "message": "",
                "security_question": "a question",
                "security_question_answer": ""
            }
        }))
        .rejects.toMatch('The security question and the answer to this cannot be empty if one of these is sent.');
    })
    test("update data validation OK - user info step 3 - all data complete", async () => {
        let user = new User()
        user = await user.updateUser(userId, {
            //step1
            "step": 3,

            "personal_message":{
                "message": "a message",
                "security_question": "a question",
                "security_question_answer": "an answer"
            }
        });

        return expect(user.personal_message.message).toMatch('a message');
    })
})
describe("Test profile access for only authorized users", () => {
    let user1Id = null;
    let user2Id = null;

    beforeEach(async () => {
        const user_instance = new User();
        let user1 = new User()
        user1.setRegistrationData("username1", "zzzzzzzzz");
        user1 = await user1.registerUser();
        user1Id = user1._id;
        await user_instance.updateUser(user1._id, {
            "step": 1,

            "name": "name",
            "last_name": "apellido",
            "phone_number": "44444444",
            "address": "sssssss",
            "city": "Sunnyvale",
            "birth_date": "2000-01-01",
            "emergency_contact":{
                "name": "Juan",
                //**** ONLY A USER WITH THIS PHONE NUMBER CAN ACCESS THE MESSAGE
                "phone_number": "2142244",
                "address": "432 easy street"
            },
            "privacy_terms_data_accepted": 1
        });
        await user_instance.updateUser(user1._id, {
            "step": 3,
            "personal_message":{
                "message": "a message",
                "security_question": "a question",
                "security_question_answer": "an answer"
            }
        });

        let user2 = new User()
        user2.setRegistrationData("username2", "zzzzzzzzz");
        user2 = await user2.registerUser();
        user2Id = user2._id;
        await user_instance.updateUser(user2._id, {
            "step": 1,

            "name": "name2",
            "last_name": "apellido",
            "phone_number": "2142244",
            "address": "sssssss",
            "city": "Sunnyvale",
            "birth_date": "2000-01-01",
            "emergency_contact":{
                "name": "Juan22",
                "phone_number": "222142244",
                "address": "432 easy street"
            },
            "privacy_terms_data_accepted": 1
        });

        let user3 = new User()
        user3.setRegistrationData("username3", "zzzzzzzzz");
        user3 = await user3.registerUser();
        user3Id = user3._id;
        await user_instance.updateUser(user3._id, {
            "step": 1,

            "name": "name3",
            "last_name": "apellido",
            "phone_number": "2143332244",
            "address": "sssssss",
            "city": "Sunnyvale",
            "birth_date": "2000-01-01",
            "emergency_contact":{
                "name": "Juan22",
                "phone_number": "222142244",
                "address": "432 easy street"
            },
            "privacy_terms_data_accepted": 1
        });

    })
    test("NO ACCESS TO PROFILE - invalid must fail", async () => {
        console.log(user1Id)
        expect.assertions(1);
        return await User.findUserByIdIfAuthorized(user1Id,user3Id)
        .then(listUser => {
        }).catch(err => {
            console.log(user1Id, user3Id)
            expect(err).toBe('You are not authorized');
        });
    })
    test("ACCESS TO PROFILE, matching phone - must work", async () => {
        console.log(user1Id)
        expect.assertions(1);
        return await User.findUserByIdIfAuthorized(user1Id,user2Id)
        .then(listUser => {
            expect(listUser.emergency_contact.phone_number).toBe('2142244');
        }).catch(err => {});
    })
})
describe("get all users ordered by online status and username", () => {
    beforeEach(async () => {
        let user = new User()
        user.setRegistrationData("CcccUser", "zzzzzzzzz");
        let newUser = await user.registerUser();
        await user.updateUser(newUser._id, {
            "acknowledgement": true,
            "onLine":true,
            "status":"OK"
        });

        let otheruser = new User()
        otheruser.setRegistrationData("BbbbUser", "BbbbUser");
        await otheruser.registerUser();
        otheruser = new User()
        otheruser.setRegistrationData("AaaaUser", "AaaaUser");
        await otheruser.registerUser();

    })
    test("get users ordered", async () => {
        expect.assertions(2);
        let user = new User();
        return await User.getUsers().then(listUser => {
            expect(listUser[0].username).toBe("CcccUser")
            expect(listUser[0].onLine).toBeTruthy()
        })
    })
})
describe("search users by username", () => {
    beforeEach(async () => {
        let user = new User()
        user.setRegistrationData("CcccUser", "zzzzzzzzz");
        let newUser = await user.registerUser();
        let otheruser = new User()
        otheruser.setRegistrationData("BbbbUser", "BbbbUser");
        await otheruser.registerUser();
        otheruser = new User()
        otheruser.setRegistrationData("AaaaUser", "AaaaUser");
        await otheruser.registerUser();
        await user.updateUser(newUser._id, {
            "acknowledgement": true,
            "onLine":true,
            "status":"OK"
        });
    })
    test("get users by username search", async () => {
        expect.assertions(1);
        let usernametoSearch = 'User'
        return await User.findUsersByParams({
            "username": usernametoSearch
        }).then(listUser => {
            expect(listUser.length).toBe(3)
        })
    })
    test("get users by username search", async () => {
        expect.assertions(1);
        let usernametoSearch = 'ccc'
        return await User.findUsersByParams({
            "username": usernametoSearch
        }).then(listUser => {
            expect(listUser.length).toBe(1)
        })
    })
})
describe("search users by status", () => {
    beforeEach(async () => {
        let user = new User()
        user.setRegistrationData("CcccUser", "zzzzzzzzz");
        let newUser = await user.registerUser();
        await user.updateUser(newUser._id, {
            "acknowledgement": true,
            "onLine":true,
            "status":"OK"
        });
        let otheruser = new User()
        otheruser.setRegistrationData("BbbbUser", "BbbbUser");
        await otheruser.registerUser();
        otheruser = new User()
        otheruser.setRegistrationData("AaaaUser", "AaaaUser");
        await otheruser.registerUser();

    })
    test("get users by status OK", async () => {
        expect.assertions(1);
        let status = 'OK'
        return await User.findUsersByParams({
            "status": status
        }).then(listUser => {
            expect(listUser.length).toBe(1)
        })
    })
    test("get users by status UNDEFINED", async () => {
        expect.assertions(1);
        let status = 'UNDEFINED'
        return await User.findUsersByParams({
            "status": status
        }).then(listUser => {
            expect(listUser.length).toBe(2)
        })
    })
})
describe("Tokens", () => {
    test('should generate token for the user', async () => {
        let userName = "userNameToken"
        let user = new User()
        user.setRegistrationData(userName, "password");

        await user.registerUser();
        return await user.generateTokens().then(tokens => {
            expect(tokens).toBeDefined();
        })
    })
})
describe("Search for users by id", () => {
    test('should return  true if user exist', async () => {
        let userName = "userNameToken"
        let user = new User()
        user.setRegistrationData(userName, "password");

        let newUser = await user.registerUser();
        return await User.userExist(newUser._id).then(userExist => {
            expect(userExist).toBeTruthy()
        })
    })
    test('should return false if user not exist', async () => {
        return await User.userExist('507f1f77bcf86cd799439011').then(userExist => {
            expect(userExist).toBeFalsy()
        })
    })
})
describe("Sockets", () => {
    let newUser;
    beforeEach(async () => {
        let user = new User()
        user.setRegistrationData("usersocket", "password");
        newUser = await user.registerUser();
    })
    test('should associate socket to the user', async () => {
        return await User.insertSocket(newUser._id, '1').then(userResponse => {
            expect(userResponse).toBeDefined()
        })
    })
    test('should remove socket associated to an user', async () => {
        await User.insertSocket(newUser._id, '1');
        return await User.removeSocket(newUser._id, '1').then(userExist => {
            expect(userExist).toBeDefined()
        })
    })
    test('should reject a promis if socket id doesnt exist', async () => {
        return expect(User.removeSocket(newUser._id, '2')).rejects.toBe("Socket does not exist");
    })
})
describe("Chat message count", () => {
    let newUser1;
    let newUser2;
    beforeEach(async () => {
        let user = new User()
        user.setRegistrationData("usersocket1", "password");
        newUser1 = await user.registerUser();
        user = new User()
        user.setRegistrationData("usersocket2", "password");
        newUser2 = await user.registerUser();
    })
    test('should increase count', async () => {
        return await expect(User.changeMessageCount(newUser1, newUser2, true)).toBeDefined()
    })
})