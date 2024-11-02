import express, { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/usersController";

const router = express.Router();


//Middleware de JWT para ver si estamos autenticados

const authenticateToken = (req: Request, res: Response, next: NextFunction):any => {
    //Middleware para verificar el token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); //Si no hay token, retornar 401

    //Verificar el token
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
           // console.error('Error en la autenticacion: ', err);
            return res.status(403).json({error: 'No tines acceso a este recurso'}); //Si hay un error, retornar 403
        }
        //req.user = user;
        next();
    });  
}

router.post('/', authenticateToken, createUser);
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, (req, res) => { return console.log('put')});
router.patch('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;