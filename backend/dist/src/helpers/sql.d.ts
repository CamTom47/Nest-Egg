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
declare const sqlForPartialUpdate: (dataToUpdate: {}, jsToSql: {}) => {
    setCols: string;
    values: unknown[];
};
export default sqlForPartialUpdate;
