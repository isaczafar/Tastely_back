export {};
declare global {
    namespace String {
        type type = () => string;
    }
    interface Object {
        getType: string;
    }
    type obj = { [key: string]: any };
}
