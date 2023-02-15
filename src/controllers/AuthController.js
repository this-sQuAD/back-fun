import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import transport from '../modules/mailer.js';
import dotenv from 'dotenv'

dotenv.config()

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
        name: user.name,
        email: user.email,
        role: user.role
      },
        secret, {
        expiresIn: 86400,
      }
      )

      res.status(200).json({ message: 'Autenticação realizada com sucesso.', token })
    } catch (error) {
      return res.status(500).json({ message: "Erro ao realizar processo." })
    }
  }

  static forgot_password = async (req, res) => {
    const { email } = req.body;

    try {
      if (!email) {
        return res.status(422).json({ message: 'Email é obrigatório.' })
      }

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }

      const secret = process.env.SECRET;

      const token = jwt.sign({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
        secret, {
        expiresIn: 300,
      }
      )

      const mailerUser = process.env.MAILER_USER;

      // TODO Colocar para enviar email ao solicitante correto

      transport.sendMail({
        to: 'lennon.rodrigues@tallos.com.br',
        subject: 'Recuperação de Senha - sQuAD',
        from: mailerUser,
        html: `<p>Você pode solicitar a nova senha usando o Token: ${token}</p>
        
        Teste, clique no link abaixo
        <br>
        <a href="http://localhost:3000/" target="_blank">Clique aqui!</a>
        `,
      }, (error) => {
        if (error) {
          return res.status(400).send({ message: 'Não foi possível enviar email de recuperação de senha.' })
        }

        return res.status(200).send({ message: `Você pode solicitar a nova senha usando o Token: ${token}` })
      })


    } catch (error) {
      res.status(400).send({ message: 'Erro no esqueci minha senha, tente novamente.' })
    }
  }

  static reset_password = async (req, res) => {
    const { token, password } = req.body;

    if (!token) {
      return res.status(401).send({ message: 'No token provided.' })
    }

    if (!password) {
      return res.status(422).send({ message: 'A nova senha é obrigatória.' })
    }

    try {
      const secret = process.env.SECRET;

      const resultToken = jwt.verify(token, secret)

      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)

      await User.findByIdAndUpdate(resultToken.id, {
        '$set': {
          password: passwordHash,
        }
      })

      return res.status(200).send({ message: 'Senha alterada com sucesso.' })

    } catch (error) {
      res.status(401).json({ message: 'Invalid token.' })
    }
  }
}

export default AuthController;