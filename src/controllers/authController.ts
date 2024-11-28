import { Request, Response } from "express"
import { comparePassword, hashPassword } from "../services/password.services";
import prisma from "../models/user";
import { generateToken } from "../services/auth.services";


export const register = async(req: Request , res: Response): Promise<void> => {
    console.log(req.body)

    const { email, password } = req.body;
    
    try {
        if (!email) {
            throw new Error('Please provide email');
            return;
        }
        if (!password) {
            throw new Error('Please provide password');
            return;
        }
        
        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword);

        const user = await prisma.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        const token = generateToken(user);
        res.status(201).json({ token });
    
    } catch (error: any) {

        // Todo mejorar los errores
        if(!email) {
            res.status(400).json({ error: 'Please provide email' });
        }
        
        if (!password) {
            res.status(400).json({ error: 'Please provide password' });
        }
        
        if(error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'Email already exists' });
        }

        // console.log(error);
        // res.status(500).json({ error: 'There was an error registering the user' });
    }

}

export const login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        try {
            if (!email) throw new Error('Please provide email');
            if (!password) throw new Error('Please provide password');

            const user = await prisma.findUnique({
                where: {
                    email
                }
            }); 

            if (!user) {
                throw new Error('Invalid credentials');
                return;
            }
  
            // Comparar contrasennas
            const isMatch = await comparePassword(password, user.password);
 
            if (!isMatch) {
                throw new Error('Invalid credentials');
                return;
            } 

            const token = generateToken(user);
            res.status(200).json({ token });
        } catch (error) {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    }    