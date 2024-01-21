let conf = {
    secret: "bezkoder-secret-key",
    jwtExp: 3600, // 1 hour
    jwtRefresh: 86400, // 24 hours
};

if (process.env.E == "DEV") {
    conf = {
        secret: "bezkoder-secret-key",
        jwtExp: 60, // 1 minute
        jwtRefresh: 120, // 2 minutes
    };
}
console.log(conf);
export default conf;
