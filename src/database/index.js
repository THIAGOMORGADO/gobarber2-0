import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import DataBaseCom from '../config/database';
// importado as models
import User from '../app/model/User';
import File from '../app/model/File';
import Appointment from '../app/model/Appointment';

const models = [User, File, Appointment];
class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.comm = new Sequelize(DataBaseCom);
    models
      .map((model) => model.init(this.comm))
      .map((model) => model.associate && model.associate(this.comm.models));
  }

  mongo() {
    this.mongo.connection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}
export default new Database();
