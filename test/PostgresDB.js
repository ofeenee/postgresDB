import {assert} from "chai";

import PostgresDB from '../PostgresDB.js';

const yousif = {
  email: 'yousif@almudhaf.com',
  password: '$argon2i$v=19$m=4096,t=3,p=1$3N0us+jqJpt823mgfD9YVA$dPs2u8gHPeujO5QV9Rk5BrHaE7eGDgU/HUPDQE78L0M',
  phone: '+96555968743',
  id: '9B6C8B3B-A1AE-463B-92AF-BE572CFF5A28'.toLocaleLowerCase()
};

describe('PostgresDB()', async function() {
  const User = new PostgresDB();
  const user = new User();

  beforeEach(function (done) {
    setTimeout(done, 250);
  });

  it(`createSchema() (table users if not exist)`, async function() {
    try {
      const tableReady = await User.createSchema();
      assert.isTrue(tableReady.success);
      console.info('   ', tableReady);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`new User()`, function() {
    try {
      assert.instanceOf(user, User);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`insertNewUser(${yousif.email})`, async function () {
    try {
      const response = await user.insertNewUser(yousif);

      assert.hasAllKeys(response, ['created_at', 'updated_at', 'role', ...Object.keys(yousif)]);
      assert.strictEqual(response.id, yousif.id);
      assert.strictEqual(response.email, yousif.email);
      assert.strictEqual(response.password, yousif.password);
      assert.strictEqual(response.phone, yousif.phone);
      assert.isDefined(response.created_at);
      assert.instanceOf(response.created_at, Date);
      assert.isDefined(response.updated_at);
      assert.instanceOf(response.updated_at, Date);
      assert.strictEqual(Date.parse(response.created_at), Date.parse(response.updated_at));



    }
    catch (error) {
      assert.fail(error.message);
    }
  }).timeout(10000);

  it(`getById(${yousif.id})`, async function() {
    try {
      const response = await user.getById(yousif.id);

      assert.hasAllKeys(response, ['created_at', 'updated_at', 'role', ...Object.keys(yousif)]);
      assert.strictEqual(response.id, yousif.id);
      assert.strictEqual(response.email, yousif.email);
      assert.strictEqual(response.password, yousif.password);
      assert.strictEqual(response.phone, yousif.phone);
      assert.isDefined(response.created_at);
      assert.instanceOf(response.created_at, Date);
      assert.isDefined(response.updated_at);
      assert.instanceOf(response.updated_at, Date);
      assert.strictEqual(Date.parse(response.created_at), Date.parse(response.updated_at));


    }
    catch (error) {
      assert.fail(error);
    }
  });

  it(`getByEmail(${yousif.email})`, async function() {
    try {
      const response = await user.getByEmail(yousif.email);

      assert.hasAllKeys(response, ['created_at', 'updated_at', 'role', ...Object.keys(yousif)]);
      assert.strictEqual(response.id, yousif.id);
      assert.strictEqual(response.email, yousif.email);
      assert.strictEqual(response.password, yousif.password);
      assert.strictEqual(response.phone, yousif.phone);
      assert.isDefined(response.created_at);
      assert.instanceOf(response.created_at, Date);
      assert.isDefined(response.updated_at);
      assert.instanceOf(response.updated_at, Date);
      assert.strictEqual(Date.parse(response.created_at), Date.parse(response.updated_at));

    }
    catch (error) {
      assert.fail(error);
    }
  });

  it(`getByPhone(${yousif.phone})`, async function() {
    try {
      const response = await user.getByPhone(yousif.phone);

      assert.hasAllKeys(response, ['created_at', 'updated_at', 'role', ...Object.keys(yousif)]);
      assert.strictEqual(response.id, yousif.id);
      assert.strictEqual(response.email, yousif.email);
      assert.strictEqual(response.password, yousif.password);
      assert.strictEqual(response.phone, yousif.phone);
      assert.isDefined(response.created_at);
      assert.instanceOf(response.created_at, Date);
      assert.isDefined(response.updated_at);
      assert.instanceOf(response.updated_at, Date);
      assert.strictEqual(Date.parse(response.created_at), Date.parse(response.updated_at));

    }
    catch (error) {
      assert.fail(error);
    }
  });

  it(`updateEmail(${'ofeenee@gmail.com'})`, async function () {
    try {
      yousif.email = 'ofeenee@gmail.com';
      const response = await user.updateEmail(yousif);

      assert.hasAllKeys(response, ['created_at', 'updated_at', 'role', ...Object.keys(yousif)]);
      assert.strictEqual(response.email, 'ofeenee@gmail.com');
      assert.strictEqual(response.email, yousif.email);
      assert.strictEqual(response.id, yousif.id);
      assert.strictEqual(response.password, yousif.password);
      assert.strictEqual(response.phone, yousif.phone);
      assert.isDefined(response.created_at);
      assert.instanceOf(response.created_at, Date);
      assert.isDefined(response.updated_at);
      assert.instanceOf(response.updated_at, Date);
      assert.notStrictEqual(Date.parse(response.created_at), Date.parse(response.updated_at));

    }
    catch (error) {
      assert.fail(error.message);
    }
  }).timeout(10000);

  it(`updatePhone(${'+96555566872'})`, async function () {
    try {
      yousif.phone = '+96555566872';
      const response = await user.updatePhone(yousif);

      assert.hasAllKeys(response, ['created_at', 'updated_at', 'role', ...Object.keys(yousif)]);
      assert.strictEqual(response.phone, '+96555566872');
      assert.strictEqual(response.email, yousif.email);
      assert.strictEqual(response.id, yousif.id);
      assert.strictEqual(response.password, yousif.password);
      assert.strictEqual(response.phone, yousif.phone);
      assert.isDefined(response.created_at);
      assert.instanceOf(response.created_at, Date);
      assert.isDefined(response.updated_at);
      assert.instanceOf(response.updated_at, Date);
      assert.notStrictEqual(Date.parse(response.created_at), Date.parse(response.updated_at));

    }
    catch (error) {
      assert.fail(error.message);
    }
  }).timeout(10000);

  it(`updatePassword(${'$argon2i$v=19$m=4096,t=3,p=1$zns6qnFQHUYcvyk3fZlxKQ$6Fye0j9ZMrYxNd/qDtRmBrimgyXVUClOF2KmiAynJZc'})`, async function () {
    try {
      yousif.password = '$argon2i$v=19$m=4096,t=3,p=1$zns6qnFQHUYcvyk3fZlxKQ$6Fye0j9ZMrYxNd/qDtRmBrimgyXVUClOF2KmiAynJZc';
      const response = await user.updatePassword(yousif);

      assert.hasAllKeys(response, ['created_at', 'updated_at', 'role', ...Object.keys(yousif)]);
      assert.strictEqual(response.password, '$argon2i$v=19$m=4096,t=3,p=1$zns6qnFQHUYcvyk3fZlxKQ$6Fye0j9ZMrYxNd/qDtRmBrimgyXVUClOF2KmiAynJZc');
      assert.strictEqual(response.email, yousif.email);
      assert.strictEqual(response.id, yousif.id);
      assert.strictEqual(response.password, yousif.password);
      assert.strictEqual(response.phone, yousif.phone);
      assert.isDefined(response.created_at);
      assert.instanceOf(response.created_at, Date);
      assert.isDefined(response.updated_at);
      assert.instanceOf(response.updated_at, Date);
      assert.notStrictEqual(Date.parse(response.created_at), Date.parse(response.updated_at));

    }
    catch (error) {
      assert.fail(error.message);
    }
  }).timeout(10000);

  it(`deleteById(${yousif.id})`, async function() {
    try {
      const response = await user.deleteById(yousif.id);
      assert.strictEqual(response, 1);
    }
    catch (error) {
      assert.fail(error.message);
    }
  }).timeout(10000);

  after(async () => {
    await user.$knex().destroy();
  });



});



// const hashedPassword = '$argon2i$v=19$m=4096,t=3,p=1$3N0us+jqJpt823mgfD9YVA$dPs2u8gHPeujO5QV9Rk5BrHaE7eGDgU/HUPDQE78L0M';
// const email = 'yousif@almudhaf.com';
// const newEmail = 'ofeenee@gmail.com';
// const phone = '+96555968743';
// const id = '9b6c8b3b-a1ae-463b-92af-be572cff5a28';

// const pdb = PostgresDB();
// console.log(pdb);
// console.log(await pdb.init());
// console.log(pdb);
// console.log(await pdb.getById(id));
// console.log(pdb.reference);
// console.log(await pdb.deleteById(id));
// console.log(pdb.reference);
// console.log(await pdb.insertNewUser({ email, phone, password: hashedPassword, id }));
// console.log(pdb.reference);

// console.log(await pdb.updateEmail({ email: newEmail, id }));
// console.log(pdb.reference);
// console.log(await pdb.insertNewUser({email, phone, password: hashedPassword}));
// user.insert({ email, hashedPassword, phone});