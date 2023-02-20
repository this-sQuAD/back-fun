import express from "express";
import users from './userRoute.js'
import auth from './authRoute.js'
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'js-yaml';

const data = YAML.load(fs.readFileSync('./src/public/docs/swagger.yaml', 'utf8'))

const routes = (app) => {
  app.route('/').get((req, res) => {
    return res.status(200).json({ message: "Bem vindo a API!" })
  })

  app.route('/docs').get(swaggerUi.setup(data))

  app.use(
    swaggerUi.serve,
    express.json(),
    auth,
    users
  )
}

export default routes;