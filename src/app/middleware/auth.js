import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Auth from '../../config/Auth';

export default async (req, res, next) => {
  const authheader = req.headers.authorization;
  // Verificando Se tem Token No header
  if (!authheader) {
    return res.status(401).json({ error: 'Token not Provided' });
  }
  const [, token] = authheader.split(' ');
  // Verificando o segredo
  try {
    const decoded = await promisify(jwt.verify)(token, Auth.secret);
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token Invalid' });
  }
};
