import SerialPort from "serialport";
import _ = require("lodash");
import Readline = SerialPort.parsers.Readline;

const parser = new Readline({ delimiter: '\r\n' });

const write = async (pathToPort: string, value: string, encoding?: BufferEncoding): Promise<any> => {
    if (_.isNil(encoding)) {
        encoding = "hex";
    }

    return new Promise((resolve, reject) => {
        try {
            const port = new SerialPort(pathToPort);
            port.pipe(parser);

            port.on("error", error => {
                console.error(`Error opening SerialPort ${pathToPort}.`, error);
                return reject(error);
            });

            console.log(`Writing on SerialPort ${pathToPort} data ${value}.`);
            port.write(Buffer.from(value, encoding), (error) => {
                if (error) {
                    console.error(`Error when writing to SerialPort ${pathToPort}.`, error);
                    return reject(error.message);
                }

                parser.on('data', (data: any) => {
                    console.log(`SerialPort on ${pathToPort} returned data ${data}.`);

                    return resolve(data);
                });

                parser.on('error', (error) => {
                    console.error(`Error parsing response from SerialPort ${pathToPort}.`, error);
                    return reject(error.message);
                });
            });
        } catch(error: any) {
            console.error(`Generic error when writing to SerialPort ${pathToPort}.`, error);
            return reject(error.message);
        }
    });
};

export default { write };
