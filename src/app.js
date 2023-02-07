import express from 'express';
import db from './config/database.js'
import routes from './routes/index.js'
import Cors from './middlewares/cors/cors.js';

db.on("error", console.log.bind(console, 'Ocorreu um erro na conexão com o banco.'))
db.once("open", () => {
  console.log('Mongo conectado!');
})

const app = express();
app.use(Cors.handleCors)
app.use(express.json())

routes(app);

export default app;