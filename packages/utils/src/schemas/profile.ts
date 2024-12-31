export const createProfileSchema = {
  body: {
    type: 'object',
    required: ['userId', 'image'],
    properties: {
      userId: {type: 'string', format: 'uuid'},
      bio: {type: 'string'},
      image: {type: 'string'},
    },
  },
};

export const updateProfileSchema = {
  body: {
    type: 'object',
    properties: {
      bio: {type: 'string'},
      image: {type: 'string'},
    },
  },
};

export const profileParamsSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {type: 'string', format: 'uuid'},
    },
  },
};

export const profilePhotoParamsSchema = {
  body: {
    type: 'object',
    required: ['image'],
    properties: {
      image: {type: 'string'},
    },
  },
  params: {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: {type: 'string', format: 'uuid'},
    },
  },
};
