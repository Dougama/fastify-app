export const getTokenSchema = {
  body: {
    type: 'object',
    properties: {
      email: {type: 'string', format: 'email'},
      password: {type: 'string', minLength: 6},
    },
  },
};
