/**
 * Mapper function that ensure that data being passed from frontend to backend queries is in the correct form
 *
 *  data = { name, description, userId, systemDefault } => {name, description, user_id, system_default}
 */
declare const mapper: (data: any, type: any) => {};
export default mapper;
