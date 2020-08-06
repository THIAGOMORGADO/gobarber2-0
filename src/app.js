import express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
import routes from './routes';
import sentryConfig from './config/sentry';

// importando arquivo de index da pasta database
import './database';

class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/file',
      express.static(path.resolve(__dirname, '..', 'tmp', 'upload'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }
}
export default new App().server;
