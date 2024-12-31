export const createUserSchema = {
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: {type: 'string', minLength: 3},
      email: {type: 'string', format: 'email'},
      password: {type: 'string', minLength: 6},
    },
  },
};

export const updateUserSchema = {
  body: {
    type: 'object',
    properties: {
      name: {type: 'string', minLength: 3},
      email: {type: 'string', format: 'email'},
    },
  },
};

export const userParamsSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {type: 'string', minimum: 1},
    },
  },
};
