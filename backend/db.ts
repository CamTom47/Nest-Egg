'use strict';

//Database for Nest Egg

import  { Client } from 'pg';
import { getDatabaseUri } from './config';


let db: any;

if (process.env.NODE_ENV === 'production') {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  db = new Client({
    connectionString: getDatabaseUri(),
  });
}

db.connect();

export default db
