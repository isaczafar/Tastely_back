export {};
type obj = { [key: string]: any };
declare global {
    namespace Express {
        interface Request {
            reqData: obj;
        }
    }
    interface Object {
        getType: string;
    }
}
