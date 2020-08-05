import { Router } from 'express';
import multer from 'multer';
import multerComfig from './config/multer';

// Importando Controller
import UseController from './app/controllers/UseController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

// Importando Middleware
import authMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = multer(multerComfig);

routes.post('/users', UseController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);
// providers
routes.get('/providers', ProviderController.index);
// appiontments
routes.get('/appiontments', AppointmentController.index);
routes.post('/appiontments', AppointmentController.store);
routes.delete('/appiontments/:id', AppointmentController.delete);

// schedule
routes.get('/schedule', ScheduleController.index);
// notification
routes.get('/notification', NotificationController.index);
routes.put('/notification/:id', NotificationController.update);

// users
routes.put('/users', UseController.update);
// files
routes.post('/file', upload.single('file'), FileController.store);

export default routes;
