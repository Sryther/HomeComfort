export default (fun: Function, ...args: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        fun(args, (err: Error, anyData: any) => {
            if (err) {
                return reject(err);
            }
            return resolve(anyData);
        });
    });
};
