export const createPostSchema = {
  body: {
    type: 'object',
    required: ['title', 'content', 'authorId'],
    properties: {
      title: {type: 'string'},
      content: {type: 'string'},
      published: {type: 'boolean', default: false},
      authorId: {type: 'string', format: 'uuid'},
    },
  },
};

export const updatePostSchema = {
  body: {
    type: 'object',
    properties: {
      title: {type: 'string'},
      content: {type: 'string'},
      published: {type: 'boolean'},
    },
  },
};

export const postParamsSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {type: 'string', format: 'uuid'},
    },
  },
};
