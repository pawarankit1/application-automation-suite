import winston from "winston";
import path from "path";
import moment from "moment-timezone";


// Get logging directory path
const loggingDir = path.resolve(__dirname, '../logging');

// Function to mask sensitive data
export const maskSensitiveData = (data: string): string => {
    return '*'.repeat(data.length);
};

//Function to format log entry with timestamp and timezone
const customFormat = winston.format.printf(({level, message, timestamp}) =>{
    return `${timestamp} [${level}]: ${message}`;

});

//set the desired timezone
const timeZone = "Europe/Amsterdam"

export const logger = winston.createLogger({
    format : winston.format.combine(
        winston.format.timestamp({ format: () => moment().tz(timeZone).format()}),
        customFormat
    ),
    transports: [
        new winston.transports.Console({level : "info"}),
        new winston.transports.File({
            filename: path.join(loggingDir,"test_run.log"),
            maxFiles: 5,
            maxsize: 10 * 1024,
            level: "info",
        }),
        new winston.transports.File({
            filename: path.join(loggingDir,"test_error.log"),
            maxFiles: 5,
            maxsize: 10 * 1024,
            level: "error",
        }),
    ],
});