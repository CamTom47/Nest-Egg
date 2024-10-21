import { BadRequestError } from '../src/ExpressError';

/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names,
 *   like { firstName: "first_name", lastName: "last_name" }
 *
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *
 * @example {firstName: 'Aliya', lastName: 'Smith'} =>
 *   { setCols: '"first_name"=$1, "last_name"=$2',
 *     values: ['Aliya', 'Smith'] }
 */

/**
 *
 * keys = [firstName, lastName]
 *
 * cols = {}
 *
 *
 *
 */

const sqlForPartialUpdate = (dataToUpdate: {}, jsToSql: {}) => {
  let keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError('No Data');

  // {firstName: 'Aliya', lastName: 'Smith'} => ['"first_name"=$1', '"last_name"=$2']

  const cols = keys.map((colName, idx) => `"${jsToSql[colName] || colName}" = $${idx + 1}`);

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate)
  }
};

export default sqlForPartialUpdate