import bcrypt from 'bcrypt';


const SALT_ROUNDS: number = 10;

export const hashPassword = async(password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

// Leer y comparar con la base de datos
export const comparePassword = async(password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}