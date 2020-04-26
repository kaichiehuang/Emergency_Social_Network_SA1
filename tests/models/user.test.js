const TestDatabase = require('../services/testDataBase');
const User = require('../../model/user');
const UserHelper = require('../../utils/userHelper');
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
describe('User registration ', () => {
    test('Registers a User to the database', async () => {
        const userName = 'username_test';
        const user = new User();
        user.setRegistrationData(userName, 'password');
        return user.registerUser().then((result) => {
            expect(result).toBeTruthy();
            expect(user.username).toBe(userName);
        });
    });
});
//
describe('Business Validations for user', () => {
    test('raise error validating username with less than 3 characters', async () => {
        expect.assertions(1);
        const userName = 'ab';
        const user = new User();
        user.setRegistrationData(userName, 'password');
        return user.validateCreate().catch((err) => {
            expect(err).not.toBe('');
        });
    });
    test('raise error validating passwords with less than 4 characters', async () => {
        expect.assertions(1);
        const password = 'ab';
        const user = new User();
        user.setRegistrationData('asdasdasdasdasd', password);
        return user.validateCreate().catch((err) => {
            expect(err).not.toBe(null);
        });
    });
    test('should pass validation for banned user names', () => {
        expect.assertions(1);
        const user = new User();
        user.setRegistrationData('user1234d', 'password');
        return expect(user.validateCreate()).toBeTruthy();
    });
    test('should send an error for banned user names', async () => {
        expect.assertions(1);
        const user = new User();
        user.setRegistrationData('broadcasthost', 'password');
        return user.validateCreate().catch((err) => {
            expect(err).not.toBe('');
        });
    });
    test('should validate user names previously registered', () => {
        const user = new User();
        user.setRegistrationData('username_test', 'password');
        return user.registerUser().then( (result) => {
            expect(result).toBeTruthy();
            return User.usernameExists('username_test');
        }).then((res) => {
            expect(res).toBeTruthy();
        });
    });
    test('should validate user names not registered', async () => {
        expect.assertions(1);
        return User.usernameExists('username_not_registered').then((res) => {
            expect(res).toBeFalsy();
        });
    });
});
describe('User password validations,', () => {
    let userName;
    beforeEach(async () => {
        userName = 'userNamePassword';
        createdUser = new User();
        createdUser.setRegistrationData(userName, 'password');

        return createdUser.registerUser()
            .then((result) => {
                userId = String(createdUser._id);
            });
    });
    test('should password match with the database password', async () => {
        expect.assertions(1);
        return UserHelper.isPasswordMatch('password', createdUser.password)
            .then((res) => {
                expect(res).toBeTruthy();
            });
    });
    test('should send an error message validating password,  password not matching', async () => {
        expect.assertions(1);
        return UserHelper.isPasswordMatch('pass', createdUser.password)
            .catch((res) => {
                expect(res).toBe('Invalid username / password.');
            });
    });
});
describe('Searching and update operations on a user previously inserted', () => {
    let userId;
    let createdUser;
    beforeEach(() => {
        const userName = 'userName';
        createdUser = new User();
        createdUser.setRegistrationData(userName, 'password');

        return createdUser.registerUser()
            .then((result) => {
                userId = String(createdUser._id);
            });
    });
    test('searching a user by the username', () => {
        expect.assertions(1);
        return User.findUserByUsername(createdUser.username).then((usr) => {
            expect(usr.username).toBe(createdUser.username);
        });
    });
    test('update data of the user', () => {
        expect.assertions(3);
        return createdUser.updateUser({
            'acknowledgement': true,
            'onLine': true,
            'status': 'OK'
        }).then( (result) => {
            expect(createdUser.acknowledgement).toBeTruthy();
            expect(createdUser.onLine).toBeTruthy();
            expect(createdUser.status).toBe('OK');
        });
    });
    test('update user status (specific status method)', async () => {
        expect.assertions(1);
        return createdUser.updateUser({'status': 'HELP'}).then( (result) => {
            expect(createdUser.status).toBe('HELP');
        });
    });
    test('searching a user by the id ', async () => {
        expect.assertions(1);
        return await User.findUserById(userId).then((usr) => {
            expect(String(usr._id)).toBe(userId);
        });
    });
});
describe('Update operations on a user - profile information and validation rules', () => {
    let createdUser;
    beforeEach(async () => {
        const userName = 'profileUser';
        createdUser = new User();
        createdUser.setRegistrationData(userName, 'password');

        return createdUser.registerUser()
            .then((result) => {
                userId = String(createdUser._id);
            });
    });
    // 1.
    test('update data validation required fields - user info step 1 - empty data', () => {
        return createdUser.updateUser({
            // step1
            'step': 1,

            'name': '',
            'last_name': '',
            'phone_number': '',
            'address': '',
            'city': '',
            'birth_date': '',
            'emergency_contact': {
                'name': '',
                'phone_number': '',
                'address': '',
                'email': ''
            },
            'privacy_terms_data_accepted': null
        }).catch((err) => {
            expect(err).toMatch('Missing required fields. Every field in this step is mandatory.');
        });
    });
    test('update data validation required fields - user info step 1 - missing some data', () => {
        return createdUser.updateUser({
            // step1
            'step': 1,

            'name': 'name',
            'last_name': 'apellido',
            'phone_number': '31321',
            'address': 'sssssss',
            'city': 'Sunnyvale',
            'birth_date': '',
            'emergency_contact': {
                'name': 'Juan',
                'phone_number': '',
                'address': ''
            },
            'privacy_terms_data_accepted': null
        }).catch((err) => {
            expect(err).toMatch('Missing required fields. Every field in this step is mandatory.');
        });
    });
    test('update data validation required fields - user info step 1 - all data, missing data treatment acceptance', () => {
        return createdUser.updateUser({
            // step1
            'step': 1,

            'name': 'name',
            'last_name': 'apellido',
            'phone_number': '31321',
            'address': 'sssssss',
            'city': 'Sunnyvale',
            'birth_date': '2000-01-01',
            'emergency_contact': {
                'name': 'Juan',
                'phone_number': '336999645',
                'address': '432 easy street'
            },
            'privacy_terms_data_accepted': null
        }).catch((err) => {
            expect(err).toMatch('Please accept the term and conditions for personal data treatment');
        });
    });
    test('update data validation required fields - user info step 1 - all data, phone length', () => {
        return createdUser.updateUser({
            // step1
            'step': 1,

            'name': 'name',
            'last_name': 'apellido',
            'phone_number': '31321',
            'address': 'sssssss',
            'city': 'Sunnyvale',
            'birth_date': '2000-01-01',
            'emergency_contact': {
                'name': 'Juan',
                'phone_number': '336999645',
                'address': '432 easy street'
            },
            'privacy_terms_data_accepted': 1
        }).catch((err) => {
            expect(err).toMatch('Phone numbers must be longer than 7 characters');
        });
    });
    test('update data validation OK - user info step 1 - all data complete', () => {
        return createdUser.updateUser({
            // step1
            'step': 1,

            'name': 'name',
            'last_name': 'apellido',
            'phone_number': '44444444',
            'address': 'sssssss',
            'city': 'Sunnyvale',
            'birth_date': '2000-01-01',
            'emergency_contact': {
                'name': 'Juan',
                'phone_number': '336999645',
                'address': '432 easy street'
            },
            'privacy_terms_data_accepted': 1
        }).then((res) => {
            expect(res).toBe(true);
            expect(createdUser.phone_number).toMatch('44444444');
        });
    });
    test('update data validation required fields - user info step 2 - blood type required', () => {
        return createdUser.updateUser({
            // step1
            'step': 2,

            'medical_information': {
                'blood_type': '',
                'allergies': '',
                'prescribed_drugs': '',
                'privacy_terms_medical_accepted': null,
            },
        }).catch((err) => {
            expect(err).toMatch('Blood type is a mandatory field, please select a valid blood type'); ;
        });
    });
    test('update data validation required fields - user info step 2 - data treatment medical info required', async () => {
        return createdUser.updateUser({
            // step1
            'step': 2,

            'medical_information': {
                'blood_type': 'AB+',
                'allergies': '',
                'prescribed_drugs': '',
                'privacy_terms_medical_accepted': null,
            },
        }).catch((err) => {
            expect(err).toMatch('Please accept the term and conditions for medical data treatment');
        });
    });
    test('update data validation OK - user info step 2 - all data complete', () => {
        return createdUser.updateUser({
            // step1
            'step': 2,

            'medical_information': {
                'blood_type': 'AB+',
                'allergies': 'list of allergies',
                'prescribed_drugs': '',
                'privacy_terms_medical_accepted': 1,
            },
        }).then((res) => {
            expect(res).toBe(true);
            expect(createdUser.medical_information.allergies).toMatch('list of allergies');
        });
    });
    test('update data validation required fields - user info step 3 - security question and answer', () => {
        return createdUser.updateUser({
            // step1
            'step': 3,

            'personal_message': {
                'message': '',
                'security_question': 'a question',
                'security_question_answer': ''
            }
        }).catch((err) => {
            expect(err).toMatch('The security question and the answer to this cannot be empty if one of these is sent.');
        });
    });
    test('update data validation OK - user info step 3 - all data complete', () => {
        return createdUser.updateUser({
            // step1
            'step': 3,

            'personal_message': {
                'message': 'a message',
                'security_question': 'a question',
                'security_question_answer': 'an answer'
            }
        }).then((res) => {
            expect(res).toBe(true);
            expect(createdUser.personal_message.message).toMatch('a message');
        });
    });
});
describe('Test profile access for only authorized users', () => {
    let user1Id = null;
    let user2Id = null;
    let user3Id = null;
    let createdUser1 = null;
    let createdUser2 = null;
    let createdUser3 = null;

    beforeEach(async () => {
        createdUser1 = new User();
        createdUser1.setRegistrationData('username1', 'zzzzzzzzz');
        return createdUser1.registerUser()
            .then((result) => {
                user1Id = String(createdUser1._id);
                // set data
                return createdUser1.updateUser({
                    'step': 1,

                    'name': 'name',
                    'last_name': 'apellido',
                    'phone_number': '44444444',
                    'address': 'sssssss',
                    'city': 'Sunnyvale',
                    'birth_date': '2000-01-01',
                    'emergency_contact': {
                        'name': 'Juan',
                        //* *** ONLY A USER WITH THIS PHONE NUMBER CAN ACCESS THE MESSAGE
                        'phone_number': '2142244',
                        'address': '432 easy street'
                    },
                    'privacy_terms_data_accepted': 1
                });
                // set personal message
            })
            .then((result) => {
                return createdUser1.updateUser({
                    'step': 3,
                    'personal_message': {
                        'message': 'a message',
                        'security_question': 'a question',
                        'security_question_answer': 'an answer'
                    }
                });
            })
            .then( (result) =>{
                createdUser2 = new User();
                createdUser2.setRegistrationData('username2', 'zzzzzzzzz');
                return createdUser2.registerUser();
            })
            .then( (result) =>{
                user2Id = String(createdUser2._id);
                return createdUser2.updateUser({
                    'step': 1,

                    'name': 'name2',
                    'last_name': 'apellido',
                    'phone_number': '2142244',
                    'address': 'sssssss',
                    'city': 'Sunnyvale',
                    'birth_date': '2000-01-01',
                    'emergency_contact': {
                        'name': 'Juan22',
                        'phone_number': '222142244',
                        'address': '432 easy street'
                    },
                    'privacy_terms_data_accepted': 1
                });
            })
            .then( (result) =>{
                createdUser3 = new User();
                createdUser3.setRegistrationData('username3', 'zzzzzzzzz');
                return createdUser3.registerUser();
            })
            .then( (result) =>{
                user3Id = String(createdUser3._id);
                return createdUser3.updateUser({
                    'step': 1,

                    'name': 'name3',
                    'last_name': 'apellido',
                    'phone_number': '2143332244',
                    'address': 'sssssss',
                    'city': 'Sunnyvale',
                    'birth_date': '2000-01-01',
                    'emergency_contact': {
                        'name': 'Juan22',
                        'phone_number': '222142244',
                        'address': '432 easy street'
                    },
                    'privacy_terms_data_accepted': 1
                });
            })
            .then((res) => {})
            .catch((_) => {});
    });
    test('NO ACCESS TO PROFILE - invalid must fail', async () => {
        expect.assertions(1);
        return await User.findUserByIdIfAuthorized(user1Id, user3Id)
            .then((listUser) => {
            }).catch((err) => {
                expect(err).toBe('You are not authorized');
            });
    });
    test('ACCESS TO PROFILE, matching phone - must work', async () => {
        expect.assertions(1);
        return await User.findUserByIdIfAuthorized(user1Id, user2Id)
            .then((listUser) => {
                expect(listUser.emergency_contact.phone_number).toBe('2142244');
            }).catch((err) => {});
    });

    test('ACCESS TO PERSONAL MESSAGE, WRONG ANSWER - must fail', async () => {
        expect.assertions(1);
        return createdUser1.getPersonalMessage('wrong answer').catch((err) => {
            expect(err).toMatch('Invalid answer');
        });
    });
    test('ACCESS TO PERSONAL MESSAGE, matching phone AND RIGHT ANSWER - must work', async () => {
        expect.assertions(1);
        return createdUser1.getPersonalMessage('an answer').then((message) => {
            expect(message).toBe('a message');
        });
    });
});
describe('get all users ordered by online status and username', () => {
    let createdUser1;
    let createdUser2;
    let createdUser3;

    beforeEach(() => {
        createdUser1 = new User();
        createdUser1.setRegistrationData('CcccUser', 'zzzzzzzzz');

        return createdUser1.registerUser()
            .then((result) => {
                return createdUser1.updateUser({
                    'acknowledgement': true,
                    'onLine': true,
                    'status': 'OK'
                });
            })
            .then((result) => {
                createdUser2 = new User();
                createdUser2.setRegistrationData('BbbbUser', 'BbbbUser');
                return createdUser2.registerUser();
            })
            .then((result) => {
                createdUser3 = new User();
                createdUser3.setRegistrationData('AaaaUser', 'AaaaUser');
                return createdUser3.registerUser();
            });
    });
    test('get users ordered', () => {
        expect.assertions(2);
        return User.getUsers().then((listUsers) => {
            expect(listUsers[0].username).toBe('CcccUser'); // createdUser1.username
            expect(listUsers[0].onLine).toBeTruthy();
        });
    });
});
describe('search users by username', () => {
    let createdUser1;
    let createdUser2;
    let createdUser3;

    beforeEach(() => {
        createdUser1 = new User();
        createdUser1.setRegistrationData('CcccUser', 'zzzzzzzzz');

        return createdUser1.registerUser()
            .then((result) => {
                return createdUser1.updateUser({
                    'acknowledgement': true,
                    'onLine': true,
                    'status': 'OK'
                });
            })
            .then((result) => {
                createdUser2 = new User();
                createdUser2.setRegistrationData('BbbbUser', 'BbbbUser');
                return createdUser2.registerUser();
            })
            .then((result) => {
                createdUser3 = new User();
                createdUser3.setRegistrationData('AaaaUser', 'AaaaUser');
                return createdUser3.registerUser();
            });
    });
    test('get users by username search', async () => {
        expect.assertions(1);
        const usernametoSearch = 'User';
        return await User.findUsersByParams({
            'username': usernametoSearch
        }).then((listUser) => {
            expect(listUser.length).toBe(3);
        });
    });
    test('get users by username search', async () => {
        expect.assertions(1);
        const usernametoSearch = 'ccc';
        return await User.findUsersByParams({
            'username': usernametoSearch
        }).then((listUser) => {
            expect(listUser.length).toBe(1);
        });
    });
});
describe('search users by status', () => {
    let createdUser1;
    let createdUser2;
    let createdUser3;
    beforeEach(async () => {
        createdUser1 = new User();
        createdUser1.setRegistrationData('CcccUser', 'zzzzzzzzz');

        return createdUser1.registerUser()
            .then((result) => {
                return createdUser1.updateUser({
                    'acknowledgement': true,
                    'onLine': true,
                    'status': 'OK'
                });
            })
            .then((result) => {
                createdUser2 = new User();
                createdUser2.setRegistrationData('BbbbUser', 'BbbbUser');
                return createdUser2.registerUser();
            })
            .then((result) => {
                createdUser3 = new User();
                createdUser3.setRegistrationData('AaaaUser', 'AaaaUser');
                return createdUser3.registerUser();
            });
    });
    test('get users by status OK', async () => {
        expect.assertions(1);
        const status = 'OK';
        return await User.findUsersByParams({
            'status': status
        }).then((listUser) => {
            expect(listUser.length).toBe(1);
        });
    });
    test('get users by status UNDEFINED', async () => {
        expect.assertions(1);
        const status = 'UNDEFINED';
        return await User.findUsersByParams({
            'status': status
        }).then((listUser) => {
            expect(listUser.length).toBe(2);
        });
    });
});
describe('Tokens', () => {
    test('should generate token for the user', async () => {
        const userName = 'userNameToken';
        const createdUser = new User();
        createdUser.setRegistrationData(userName, 'password');

        return createdUser.registerUser()
            .then((result) => {
                return UserHelper.generateTokens(result._id);
            });
    });
});
describe('Search for users by id', () => {
    test('should return  true if user exist', () => {
        const userName = 'userNameToken';
        const createdUser = new User();
        createdUser.setRegistrationData(userName, 'password');

        return createdUser.registerUser()
            .then((result) => {
                expect(result).toBeTruthy();
                return User.userExist(String(createdUser._id));
            })
            .then((result) =>{
                expect(result).toBeTruthy();
            });
    });
    test('should return false if user not exist', () => {
        return User.userExist('507f1f77bcf86cd799439011')
            .then((userExist) => {
                expect(userExist).toBeFalsy();
            });
    });
});
describe('Sockets', () => {
    let newUser;
    beforeEach(async () => {
        newUser = new User();
        newUser.setRegistrationData('usersocket', 'password');

        return newUser.registerUser()
            .then((result) => {
                userId = String(newUser._id);
            });
    });
    test('should associate socket to the user', () => {
        return newUser.insertSocket('1')
            .then((userResponse) => {
                expect(userResponse).toBeTruthy();
                expect(newUser.sockets).toBeDefined();
            });
    });
    test('should remove socket associated to an user', async () => {
        return newUser.insertSocket('1')
            .then((userResponse) => {
                expect(userResponse).toBeTruthy();
                expect(newUser.sockets).toBeDefined();
                return newUser.removeSocket('1');
            })
            .then((userResponse) => {
                expect(userResponse).toBeTruthy();
                expect(newUser.sockets).toBeDefined();
                expect(newUser.sockets.has('1')).toBeFalsy();
            });
    });
    test('should reject a promise if socket id doesnt exist', async () => {
        return expect(newUser.removeSocket('2')).rejects.toBe('Socket does not exist');
    });
});
describe('Chat message count & spam report', () => {
    let newUser1;
    let newUser2;
    beforeEach(async () => {
        newUser1 = new User();
        newUser1.setRegistrationData('usersocket1', 'password');
        return newUser1.registerUser()
            .then((result) => {
                expect(result).toBeTruthy();
                newUser2 = new User();
                newUser2.setRegistrationData('usersocket2', 'password');
                return newUser2.registerUser();
            })
            .then((result) => {
                expect(result).toBeTruthy();
            });
    });
    test('should increase count', () => {
        return newUser1.changeMessageCount(String(newUser2._id))
            .then((result) => {
                expect(result).toBe(1);
            });
    });
});
