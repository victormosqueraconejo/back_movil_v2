//express servidor web
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './src/routes/user.js';
import caracterizacionesRouter from './src/routes/caracterizaciones.js';
import seguimientosRouter from './src/routes/seguimientos.js';
import eventosRouter from './src/routes/eventos.js';
import parametrosRouter from './src/routes/parametros.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api', userRouter);
app.use('/api', caracterizacionesRouter);
app.use('/api', seguimientosRouter);
app.use('/api', eventosRouter);
app.use('/api', parametrosRouter);

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

//ruta basica
app.get("/", (req, res) => {
  res.send("Hola Mundo desde Express");
});

//conexion a MongoDB
mongoose.connect(process.env.MONGODB_URI,{

})
.then(()=>console.log("Conectado a Mongo Atlas"))
.catch((error)=>console.log(error));