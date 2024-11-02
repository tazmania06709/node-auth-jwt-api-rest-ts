import { Request, Response } from "express"
import { hashPassword } from "../services/password.services";
import prisma from "../models/user";

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const { email, password } = req.body;
        if (!email) {
            throw new Error('Please provide email');
            return;
        }
        if (!password) {
            throw new Error('Please provide password');
            return;
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.create({
            data: {
                email,
                password: hashedPassword
            }
        })

        res.status(201).json(user);
        
    } catch (error:any) {

         if(error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'Email already exists' });
        }

        console.log(error);
        res.status(500).json({ error: 'There was an error registering the user' });
        
    }
    console.log(req.body)
}
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'There was an error retrieving the users' });
    }
}
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await prisma.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'There was an error retrieving the user' });
    }
}
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { email, password } = req.body;

        let dataToUpdate: any = {...req.body };
        if(password) {
            const hashedPassword = await hashPassword(password);
            dataToUpdate.password = hashedPassword;
        }
        if (email) dataToUpdate.email = email;

        const user = await prisma.update({ 
            where: {
                id: Number(id)
            },
            data: dataToUpdate,
        });
        res.status(200).json(user);

    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        } else if (error?.code === 'P2025') {
            res.status(404).json({ error: 'User not found' });
            return;
        } else {
            console.log(error);
            res.status(500).json({ error: 'There was an error updating the user' });
        }
    }
}
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.delete({
            where: {
                id: Number(id)
            }
        });
        res.status(200).json({ message: `User: ${id} deleted successfully` }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'There was an error deleting the user' });
    }
}