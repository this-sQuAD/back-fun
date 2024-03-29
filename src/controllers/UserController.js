import User from '../models/User.js'
import bcrypt from 'bcrypt';

class UserController {

  static getUser = async (req, res) => {
    const id = req.params.id;

    try {
      const user = await User.findById(id, '-password')

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }

      return res.status(200).json(user)
    } catch (error) {
      res.status(422).json({ message: 'Não foi possível localizar o usuário.' })
      throw new Error(`Não foi possível localizar os usuários. Error: ${error}`)
    }

  }

  static getAllUsers = async (req, res) => {
    let { name } = req.query;

    try {
      const query = name ? { 'name': name } : null;

      User.find(query, '-password')
        .exec((error, users) => {
          if (users.length == 0) {
            return res.status(404).send({ message: "Não localizamos nenhum usuário, verifique se os parâmetros estão corretos." });
          }
          return res.status(200).json(users);
        })
    } catch (error) {
      res.status(422).json({ message: 'Não foi possível localizar os usuários.' })
      throw new Error(`Não foi possível localizar os usuários. Error: ${error}`)
    }

  }

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

  static updateUser = async (req, res) => {
    const id = req.params.id;
    const { name, email, password, role } = req.body;

    const user = await User.findOne({ _id: id })

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado. Verifique os dados informados.' })
    }

    if (role && role != "user" && role != "admin") {
      return res.status(422).json({ message: "O perfil do usuário deve ser de 'admin' ou 'user'." })
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = password ? await bcrypt.hash(password, salt) : password

    const newUser = {
      name,
      email,
      password: passwordHash,
      role
    }

    try {
      await User.findOneAndUpdate({ _id: id }, newUser)
      return res.status(201).json({ message: "Usuário atualizado com sucesso." })
    } catch (error) {
      return res.status(500).json({ message: "Erro ao realizar processo." })
    }
  }

  static deleteUser = (req, res) => {
    const id = req.params.id;

    User.findByIdAndDelete(id)
      .exec((error, user) => {
        if (error) {
          return res.status(400).send({ message: error.message })
        }

        if (!user) {
          return res.status(404).send({ message: "Item não encontrado, verifique se os parâmetros estão corretos." })
        }

        return res.status(200).send({ message: "Usuário removido com sucesso." })
      })
  }
}

export default UserController;