import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../model/User';
import Auth from '../../config/Auth';

class SessionController {
  // Validado Email e senha do usuario para gerar token de seguraça
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'User not Found !' });
    }
    if (!(await user.CheckPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    // Gerando o Token Do Usuario
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, Auth.secret, {
        expiresIn: Auth.expiresIn,
      }),
    });
  }
}

export default new SessionController();
