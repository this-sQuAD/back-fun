import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

class AuthController {
  static register = async (req, res) => {
    const { name, email, password, confirmPassword, role = "user" } = req.body;

    if (!name) {
      return res.status(422).json({ message: 'O nome é obrigatório.' })
    }

    if (!email) {
      return res.status(422).json({ message: 'O email é obrigatório.' })
    }

    if (!password) {
      return res.status(422).json({ message: 'A senha é obrigatória.' })
    }

    if (password != confirmPassword) {
      return res.status(422).json({ message: 'As senhas não conferem.' })
    }

    if (role != "user" && role != "admin") {
      return res.status(422).json({ message: "O perfil do usuário deve ser de 'admin' ou 'user'." })
    }

    const userExists = await User.findOne({ email: email })

    if (userExists) {
      return res.status(422).json({ message: 'Por favor, utilize outro e-mail.' })
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
      name,
      email,
      password: passwordHash,
      role
    })
    try {
      await user.save()
      return res.status(201).json({ message: "Usuário criado com sucesso." })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao realizar processo." })
    }
  }

  static login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ message: 'Email e senha são obrigatórios.' })
    }

    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' })
    }

    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      return res.status(422).json({ message: 'Senha inválida.' })
    }

    try {
      const secret = process.env.SECRET;

      const token = jwt.sign({
        id: user._id,
      },
        secret,
      )

      res.status(200).json({ message: 'Autenticação realizada com sucesso.', token })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao realizar processo." })
    }
  }
}

export default AuthController;