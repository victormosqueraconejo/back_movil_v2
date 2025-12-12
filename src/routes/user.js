import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import Usuario from './models/usuarios.js';

const router = express.Router();

// Crear un nuevo usuario
router.post("/users", async (req, res) => {
    try {
        const { username, password, tipo_documento, numero_documento, nombres, apellidos, 
                correo_electronico, rol, lider_asignado, departamento, ciudad } = req.body;

        // Validar campos requeridos
        if (!username || !password || !tipo_documento || !numero_documento || !nombres || !apellidos || !correo_electronico || !rol) {
            return res.status(400).json({ message: "Campos requeridos: username, password, tipo_documento, numero_documento, nombres, apellidos, correo_electronico, rol" });
        }

        // Encriptar la contraseña
        const password_hash = await bcrypt.hash(password, 10);

        const newUser = new Usuario({
            _id: req.body._id || uuidv4(),
            username,
            password_hash,
            tipo_documento,
            numero_documento,
            nacionalidad: req.body.nacionalidad,
            nombres,
            apellidos,
            correo_electronico,
            rol,
            lider_asignado,
            departamento,
            ciudad,
            estado: req.body.estado || 'ACTIVO'
        });
        
        const user = await newUser.save();

        const userResponse = user.toObject();
        delete userResponse.password_hash;

        res.status(201).json(userResponse);
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

// Login de usuario (devuelve JWT)
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Debe enviar username y password" });
        }

        const user = await Usuario.findOne({ username }).select('+password_hash');

        // Si el usuario no existe o la contraseña es incorrecta, devolver mismo mensaje genérico
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // No enviar password_hash en la respuesta
        const userResponse = user.toObject();
        delete userResponse.password_hash;

        const payload = {
            sub: user._id,
            username: user.username,
            rol: user.rol
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'dev-secret-change-me',
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '2d'
            }
        );

        res.status(200).json({
            message: "Login exitoso",
            token,
            user: userResponse
        });
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
        // Si se envía nueva contraseña, hashearla
        if (req.body.password) {
            req.body.password_hash = await bcrypt.hash(req.body.password, 10);
            delete req.body.password;
        }

        const updatedUser = await Usuario.findByIdAndUpdate(
            req.params.id,
            { ...req.body, modificado_en: new Date() },
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