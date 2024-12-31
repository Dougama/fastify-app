import {app} from './app.js';

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const startServer = async () => {
  try {
    await app.listen({port: Number(PORT), host: HOST});
    app.log.info(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    throw err;
  }
};

startServer();
