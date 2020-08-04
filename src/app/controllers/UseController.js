import * as Yup from 'yup';
import User from '../model/User';

class UserController {
  // metodo de cadastro de usuario
  async store(req, res) {
    // Validação de Usuario
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // VAlidação de Email cadastrado se ja estiste no banco de dados
    const userExist = await User.findOne({ where: { email: req.body.email } });
    if (userExist) {
      return res.status(400).json({ error: 'User already exists...' });
    }
    // Criando o Usuario no Banco de Dados via requisição do corpo
    const { id, name, email, provider } = await User.create(req.body);

    return res.json({ id, name, email, provider });
  }
  // Metodo Update
  // Atualizando Dados do Banco

  async update(req, res) {
    // Validação de para alterar e comfirmar senha do usuario
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);
    if (email !== user.email) {
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        return res.status(400).json({ error: 'User already exists...' });
      }
    }
    if (oldPassword && !(await user.CheckPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
