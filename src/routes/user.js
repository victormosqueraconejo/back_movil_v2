import express from 'express';
import bcrypt from 'bcrypt';
import Usuario from './models/usuarios.js';

const router = express.Router();

// Crear un nuevo usuario
router.post("/users", async (req, res) => {
    try {
        // Accept either English or Spanish field names
        const name = req.body.name || req.body.nombreUsuario;
        const email = req.body.email || req.body.correoElectronico;
        const password = req.body.password || req.body.contrasena || req.body.contraseña;

        // Validar que todos los campos estén presentes
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son requeridos (nombre/email/password)" });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario (mapeo a esquema `usuarios`)
        // Soporta campos legacy (primerNombre, etc.) y nuevos (nombres, apellidos)
        const nombres = req.body.nombres || 
            [req.body.primerNombre, req.body.segundoNombre].filter(Boolean).join(' ');
        const apellidos = req.body.apellidos || 
            [req.body.primerApellido, req.body.segundoApellido].filter(Boolean).join(' ');

        const newUser = new Usuario({
            nombreUsuario: name,
            correoElectronico: email,
            password: hashedPassword,
            tipoDocumento: req.body.tipoDocumento,
            numeroDocumento: req.body.numeroDocumento,
            nacionalidad: req.body.nacionalidad,
            nombres: nombres,
            apellidos: apellidos,
            rol: req.body.rol,
            liderAsignado: req.body.liderAsignado,
            departamento: req.body.departamento,
            ciudad: req.body.ciudad,
            estado: req.body.estado,
            creadoPor: req.body.creadoPor
        });
        
        // Guardar en la base de datos
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Obtener todos los usuarios
router.get("/users", async (req, res) => {
    try {
        const users = await Usuario.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Login de usuario
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Usuario.findOne({ correoElectronico: email });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        res.status(200).json({ message: "Login exitoso", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un usuario específico
router.get("/user/:id", async (req, res) => {
    try {
        const user = await Usuario.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar usuario
router.put("/user/:id", async (req, res) => {
    try {
        const updatedUser = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar usuario
router.delete("/user/:id", async (req, res) => {
    try {
        const user = await Usuario.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;