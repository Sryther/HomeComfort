import SerialPort from "serialport";
import _ = require("lodash");
import Readline = SerialPort.parsers.Readline;

const parser = new Readline({ delimiter: '\r\n' });

const write = async (pathToPort: string, value: any, encoding?: BufferEncoding): Promise<any> => {
    if (_.isNil(encoding)) {
        encoding = "hex";
    }

    return new Promise((resolve, reject) => {
        try {
            const port = new SerialPort(pathToPort, async (error) => {
                if (error) {
                    console.error(`Error opening SerialPort ${pathToPort}.`, error);
                    await close(port);
                    return reject(error.message);
                }
            });

            console.log(`Writing on SerialPort ${pathToPort} data ${value}.`);
            port.write(Buffer.from(value, encoding), async (error) => {
                await close(port);

                if (error) {
                    console.error(`Error when writing to SerialPort ${pathToPort}.`, error);
                    return reject(error.message);
                }

                return resolve(null);
            });
        } catch(error: any) {
            console.error(`Generic error when writing to SerialPort ${pathToPort}.`, error);
            return reject(error.message);
        }
    });
};

const read = async (pathToPort: string, value: any, encoding?: BufferEncoding): Promise<any> => {
    if (_.isNil(encoding)) {
        encoding = "hex";
    }

    return new Promise((resolve, reject) => {
        try {
            const port = new SerialPort(pathToPort, (error) => {
                if (error) {
                    console.error(`Error opening SerialPort ${pathToPort}.`, error);
                    return reject(error.message);
                }
            });

            port.pipe(parser);

            console.log(`Reading on SerialPort ${pathToPort} data ${value}.`);
            port.write(Buffer.from(value, encoding), async (error) => {
                if (error) {
                    console.error(`Error when writing to SerialPort ${pathToPort}.`, error);
                    await close(port);
                    return reject(error.message);
                }

                parser.on('data', async (data: any) => {
                    console.log(`SerialPort on ${pathToPort} returned data ${data}.`);
                    await close(port);
                    return resolve(data);
                });

                parser.on('error', async (error) => {
                    console.error(`Error parsing response from SerialPort ${pathToPort}.`, error);
                    await close(port);
                    return reject(error.message);
                });
            });
        } catch(error: any) {
            console.error(`Generic error when writing to SerialPort ${pathToPort}.`, error);
            return reject(error.message);
        }
    });
};

const close = async (port: SerialPort) => {
    return new Promise((resolve, reject) => {
        port.close(error => {
            if (error) {
                console.error(`Error when closing port.`, error);
                return reject(error.message);
            }
            return resolve(null);
        });
    });
}

export default { write, read };
