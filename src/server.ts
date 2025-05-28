import { createServer } from 'http';
import app from './app';
import registerSocketServer from './sockets';
import { PORT } from './config/constants';

const server = createServer(app);
registerSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
