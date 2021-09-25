import Knex from 'knex';

import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';

import validator from 'validator';
const {
  isUUID,
  isEmail,
  isStrongPassword,
  isMobilePhone,
 } = validator;

const ROLES = ['admin', 'vip', 'premium', 'member', 'basic']


const SCHEMA = {
  type: 'object',
  required: ['email', 'password'],

  properties: {
    id: { type: 'uuid' },
    email: { type: ['string'] },
    password: { type: 'string', minLength: 95, maxLength: 95 },
    phone: { type: 'string', minLength: 5, maxLength: 15 },
    role: {type: 'string', enum: ROLES},
    created_at: { type: 'timestamp' },
    updated_at: { type: 'timestamp' },
  }
};

function PostgresDB({
  schema = SCHEMA,
  client = 'pg',
  host = 'localhost',
  port = '5432',
  database = 'localhost_db',
  tableName = 'users',
  user = null,
  password = null
} = {
  schema: SCHEMA,
  client: 'pg',
  host: 'localhost',
  port: '5432',
  database: 'localhost_db',
  tableName: 'users',
  user: null,
  password: null
}) {
  try {

    if (user === 'null') user = null;
    if (password === 'null') password = null;

    const knex = Knex({
      client,
      connection: {
        host,
        port,
        database,
        user,
        password
      }
    });

    Model.knex(knex);

    // Postgres client model.
    class Postgres extends Model {

      static get tableName() {
        return tableName;
      }

      static get idColumn() {
        return 'id';
      }

      static get jsonSchema() {
        return schema;
      }
      static async createSchema() {
        try {
          await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
          if (await knex.schema.hasTable(tableName)) {
            return { success: true, operation: 'table exists' };
          }
          // await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

          // Create database schema. You should use knex migration files
          // to do this. We create it here for simplicity.
          await knex.schema.createTable(tableName, async (table) => {
            table.uuid('id').primary().notNullable();
            table.string('email').notNullable().unique(`email:${tableName}`);
            table.string('password').notNullable().index(`password:${tableName}`);
            table.string('phone').notNullable().unique(`phone:${tableName}`);
            table.enu('role', ['admin', 'vip', 'premium', 'member', 'basic']).notNullable().defaultTo('basic');
            table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
            table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
          });

          return { success: true, operation: 'table created' };
        }
        catch (error) {
          throw error;
          return { success: false, operation: 'check/create table', details: error.message, error };
        }
      }

      $beforeInsert(queryContext) {
        try {
          if (this.id === null || this.id === undefined) {
            this.id = uuidv4();
          }
        } catch (error) {
          throw error;
        }
      }

      $beforeUpdate(opt, queryContext) {
        try {
          this.updated_at = new Date();
        }
        catch (error) {
          throw error;
        }
      }

      async insertNewUser({email, phone, password, id}) {
        try {
          const valid = validateArguments({ email, phone, password, id })
          const response = await Postgres.query().insertAndFetch(valid);
          return response;
        }
        catch (error) {
          throw error;
        }
      }

      async getById(id) {
        try {
          if (!isString(id) || !isUUID(id))
            throw new Error('id invalid.')

          const response = await Postgres.query().findById(id);
          return response;
        }
        catch (error) {
          throw error;
        }
      }

      async getByEmail(email) {
        try {
          if (!isString(email) || !isEmail(email))
            throw new Error('email invalid.')

          const response = await Postgres.query().findOne({email});
          return response;
        }
        catch (error) {
          throw error;
        }
      }

      async getByPhone(phone) {
        try {
          if (!isString(phone) || !isMobilePhone(phone, 'any', {strictMode: true}))
            throw new Error('phone invalid.')

          const response = await Postgres.query().findOne({phone});
          return response
        }
        catch (error) {
          throw error;
        }
      }

      async updateEmail({ email, id}) {
        try {
          if (!isString(email) || !isEmail(email))
            throw new Error('email invalid.');

          this.email = email;
          const response = await Postgres.query().updateAndFetchById(id, this);
          return response;
        }
        catch (error) {
          throw error;
        }
      }

      async updatePassword({ password, id}) {
        try {
          if (!isString(password) || !isHash(password))
            throw new Error('password invalid.');

          this.password = password;
          const response = await Postgres.query().updateAndFetchById(id, this);
          return response;
        }
        catch (error) {
          throw error;
        }
      }

      async updatePhone({ phone, id}) {
        try {
          if (!isString(phone) || !isMobilePhone(phone, 'any', {strictMode: true}))
            throw new Error('phone invalid.');

          this.phone = phone;
          const response = await Postgres.query().updateAndFetchById(id, this);
          return response;
        }
        catch (error) {
          throw error;
        }
      }
      async updateRole({role, id}) {
        try {
          if (!isString(role) || !ROLES.includes(role))
            throw new Error('role invalid.');

          this.role = role;
          const response = await Postgres.query().updateAndFetchById(id, this);
          return response;
        }
        catch (error) {
          throw error;
        }
      }

      async deleteById(id) {
        try {
          if (!isString(id) || !isUUID(id))
            throw new Error('id invalid.');

          const response = await Postgres.query().deleteById(id);
          return response;
        }
        catch (error) {
          throw error;
        }
      }

    } // Postgres client Model end
    return Postgres;
  }
  catch (error) {
   throw error;
  }
}

export default PostgresDB;


// HELPER FUNCTIONS

// validate required arguments of object
function validateArguments({email, phone, password, id} = {}) {
   try {
     if (typeof email !== 'string' || !email || !isEmail(email)) throw new Error('email argument invalid.');
     if (typeof password !== 'string' || !password || !isHash(password)) throw new Error('password argument invalid.');
     if (typeof phone !== 'string' || !phone || !isMobilePhone(phone, 'any', { strictMode: true })) throw new Error('phone argument invalid.');

     if (id) {
       if (typeof id !== 'string' || !isUUID(id)) throw new Error('id argument invalid.');
       return {id, email, password, phone};
     }

     return {email, password, phone};
   }
   catch (error) {
     throw error;
   }
}

// check if password is a valid argon2 hash value
function isHash(string) {
  try {
    if (typeof string !== 'string' || !string) return false;
    const regex = new RegExp(/^\$argon2i\$v=19\$m=4096,t=3,p=1\$[0-z+/]{22,22}\$[0-z/+]{43,43}$/);
    const test = regex.test(string);
    if (test) return true;
    else return false;
  }
  catch (error) {
    throw error;
  }
}

// check if value is a valid string
function isString(value) {
  try {
    if (typeof value !== 'string' || !value) return false;
    else return true;
  }
  catch (error) {
    throw error;
  }
}
