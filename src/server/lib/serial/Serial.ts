import SerialPort from "serialport";
import _ = require("lodash");
import Readline = SerialPort.parsers.Readline;

const parser = new Readline({ delimiter: '\r\n' });

const write = async (pathToPort: string, baudRate: number, value: any, encoding?: BufferEncoding): Promise<any> => {
    if (_.isNil(encoding)) {
        encoding = "hex";
    }

    return new Promise((resolve, reject) => {
        try {
            const port = new SerialPort(
                pathToPort,
                {baudRate: baudRate, stopBits: 1, dataBits: 8, parity: "none"},
                async (error) => {
                    if (error) {
                        console.error(`Error opening SerialPort ${pathToPort}.`, error);
                        await close(port);
                        return reject(error.message);
                    }
                }
            );

            port.on("open", async () => {
                console.log(`Writing on SerialPort ${pathToPort} data ${value}.`);
                port.write(Buffer.from(value, encoding), async (error) => {
                    await close(port);

                    if (error) {
                        console.error(`Error when writing to SerialPort ${pathToPort}.`, error);
                        return reject(error.message);
                    }

                    return resolve(null);
                });
            });

            port.on('data', (data: Buffer) => {
                console.log(data.toString("hex"));
            });
        } catch(error: any) {
            console.error(`Generic error when writing to SerialPort ${pathToPort}.`, error);
            return reject(error.message);
        }
    });
};

const read = async (pathToPort: string, baudRate: number, value: any, encoding?: BufferEncoding): Promise<any> => {
    if (_.isNil(encoding)) {
        encoding = "hex";
    }

    return new Promise((resolve, reject) => {
        try {
            const timeout = setTimeout(async () => {
                await close(port);
                return resolve(null);
            }, 15000);

            const port = new SerialPort(
                pathToPort,
                {baudRate: baudRate, stopBits: 1, dataBits: 8, parity: "none"},
                (error) => {
                    if (error) {
                        console.error(`Error opening SerialPort ${pathToPort}.`, error);

                        handleTimeoutTermination(timeout);
                        return reject(error.message);
                    }
                }
            );

            port.on("open", async () => {
                port.pipe(parser);

                console.log(`Reading on SerialPort ${pathToPort} data ${value}.`);
                port.write(Buffer.from(value, encoding), async (error) => {
                    if (error) {
                        console.error(`Error when writing to SerialPort ${pathToPort}.`, error);

                        handleTimeoutTermination(timeout);
                        await close(port);
                        return reject(error.message);
                    }

                    parser.on('data', async (data: any) => {
                        console.log(`SerialPort on ${pathToPort} returned data ${data}.`);

                        handleTimeoutTermination(timeout);
                        await close(port);
                        return resolve(data);
                    });

                    parser.on('error', async (error) => {
                        console.error(`Error parsing response from SerialPort ${pathToPort}.`, error);

                        handleTimeoutTermination(timeout);
                        await close(port);
                        return reject(error.message);
                    });
                });
            });

            port.on('data', async (data: Buffer) => {
                console.log(data.toString("hex"));

                handleTimeoutTermination(timeout);
                await close(port);
                return resolve(data.toString("hex"));
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

const handleTimeoutTermination = (timeout: NodeJS.Timeout) => {
    clearTimeout(timeout);
}

export default { write, read };
