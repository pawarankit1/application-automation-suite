import CryptoJS from 'crypto-js';
import { encryptEnvFile } from '../utils/EncryptDecryptEnvUtil';

const SALT = process.env.SALT || 'default-salt';

export function encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, SALT).toString();
}

export function decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SALT);
    return bytes.toString(CryptoJS.enc.Utf8);
}
