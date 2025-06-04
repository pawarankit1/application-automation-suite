import CryptoJS from "crypto-js";
import fs from "fs";
import path from "path";
import { logger } from "./LoggerUtil";

// Change to 'config' folder
const configDir = path.resolve(__dirname, "../config");
let envFilePath = path.join(configDir, ".env");
if (process.env.NODE_ENV) {
  envFilePath = path.join(configDir, `.env.${process.env.NODE_ENV}`);
}

//console.log(envFilePath);

export function encryptEnvFile() {
  const SALT = process.env.SALT || "defaultSALT";
  // Read the .env file
  const envFileContent = fs.readFileSync(envFilePath, "utf8");
  const envLines = envFileContent.split("\n");

  // Encrypt values and update the array
  const encryptedLines = envLines.map((line) => {
    const [key, value] = line.split("=");

    if (value) {
      const encryptedValue = CryptoJS.AES.encrypt(
        value,
        SALT,
      ).toString();
      return `${key}=${encryptedValue}`;
    }

    return line;
  });

  // Join the lines and write back to the .env file
  const updatedEnvContent = encryptedLines.join("\n");
  fs.writeFileSync(envFilePath, updatedEnvContent, "utf8");

  logger.info("Encryption complete. Updated .env file.");
}

export function decryptEnvFile() {
  const SALT = process.env.SALT || "defaultSALT";
  // Read the .env file
  const envFileContent = fs.readFileSync(envFilePath, "utf8");
  const envLines = envFileContent.split("\n");

  // Encrypt values and update the array
  const decryptedLines = envLines.map((line) => {
    const [key, value] = line.split("=");

    if (value) {
      const decryptedValue = CryptoJS.AES.decrypt(value, SALT).toString(
        CryptoJS.enc.Utf8,
      );

      return `${key}=${decryptedValue}`;
    }

    return line;
  });

  // Join the lines and write back to the .env file
  const updatedEnvContent = decryptedLines.join("\n");
  fs.writeFileSync(envFilePath, updatedEnvContent, "utf8");

  logger.info("Decryption complete. Updated .env file.");
}