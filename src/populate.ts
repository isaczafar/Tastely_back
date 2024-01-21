import { Recipie, Ingredient, User, Role, Profile } from "./../models";
import { Request, Response, NextFunction } from "express";
import database from "./database";
import { hashSync } from "bcryptjs";
import Sequelize from "sequelize";
import { error, profile } from "console";
const { or, iLike } = Sequelize.Op;

const ing = [
    { name: "Kycklingbröst", unit: "mg;g;kg" },
    { name: "Laxfilé", unit: "mg;g;kg" },
    { name: "Quinoa", unit: "ml;cl;dl;l" },
    { name: "Couscous", unit: "ml;cl;dl;l" },
    { name: "Bulgur", unit: "ml;cl;dl;l" },
    { name: "Spaghetti", unit: "mg;g;kg;ml;cl;dl;l" },
    { name: "Broccoli", unit: "mg;g;kg" },
    { name: "Morötter", unit: "mg;g;kg;st" },
    { name: "Paprika", unit: "mg;g;kg;st" },
    { name: "Tomater", unit: "mg;g;kg;st" },
    { name: "Gurka", unit: "mg;g;kg;st" },
    { name: "Avokado", unit: "st" },
    { name: "Bladspenat", unit: "mg;g;kg" },
    { name: "Svamp", unit: "mg;g;kg" },
    { name: "Majs", unit: "ml;cl;dl;l" },
    { name: "Svarta bönor", unit: "g; ml;cl;dl;l" },
    { name: "Kikärtor", unit: "g; ml;cl;dl;l" },
    { name: "Linser", unit: "g; ml;cl;dl;l" },
    { name: "Röd lök", unit: "mg;g;kg;st" },
    { name: "Vitlök", unit: "klyftor" },
    { name: "Ingefära", unit: "mg;g;kg;ml;cl;dl;l" },
    { name: "Citron", unit: "st" },
    { name: "Lime", unit: "st" },
    { name: "Koriander", unit: "mg;g;kg" },
    { name: "Basilika", unit: "mg;g;kg" },
    { name: "Persilja", unit: "mg;g;kg" },
    { name: "Oregano", unit: "mg;g;kg" },
    { name: "Rosmarin", unit: "mg;g;kg" },
    { name: "Timjan", unit: "mg;g;kg" },
    { name: "Dill", unit: "mg;g;kg" },
    { name: "Chilipeppar", unit: "mg;g;kg;st" },
    { name: "Parmesanost", unit: "mg;g;kg" },
    { name: "Fetaost", unit: "mg;g;kg" },
    { name: "Mozzarella", unit: "mg;g;kg" },
    { name: "Cheddarost", unit: "mg;g;kg" },
    { name: "Goudaost", unit: "mg;g;kg" },
    { name: "Ägg", unit: "st" },
    { name: "Mjölk", unit: "ml;cl;dl;l" },
    { name: "Grädde", unit: "ml;cl;dl;l" },
    { name: "Yoghurt", unit: "ml;cl;dl;l" },
    { name: "Smör", unit: "mg;g;kg" },
    { name: "Olivolja", unit: "ml;cl;dl;l" },
    { name: "Rapsolja", unit: "ml;cl;dl;l" },
    { name: "Honung", unit: "ml;cl;dl;l;ml;cl;dl;l" },
    { name: "Sojasås", unit: "ml;cl;dl;l;ml;cl;dl;l" },
    { name: "Balsamvinäger", unit: "ml;cl;dl;l" },
    { name: "Vitvinsvinäger", unit: "ml;cl;dl;l" },
    { name: "Senap", unit: "ml;cl;dl;l" },
    { name: "Ketchup", unit: "ml;cl;dl;l" },
    { name: "Majonnäs", unit: "ml;cl;dl;l" },
    { name: "Srirachasås", unit: "ml;cl;dl;l" },
    { name: "Worcestershiresås", unit: "ml;cl;dl;l" },
    { name: "Sambal oelek", unit: "ml;cl;dl;l" },
    { name: "Sesamolja", unit: "ml;cl;dl;l" },
    { name: "Hoisinsås", unit: "ml;cl;dl;l" },
    { name: "Jordnötssmör", unit: "ml;cl;dl;l" },
    { name: "Mandelsmör", unit: "ml;cl;dl;l" },
    { name: "Cashewnötter", unit: "mg;g;kg" },
    { name: "Valnötter", unit: "mg;g;kg" },
    { name: "Solrosfrön", unit: "mg;g;kg" },
    { name: "Pumpafrön", unit: "mg;g;kg" },
    { name: "Chiafrön", unit: "ml;cl;dl;l" },
    { name: "Linfrön", unit: "ml;cl;dl;l" },
    { name: "Sesamfrön", unit: "ml;cl;dl;l" },
    { name: "Havregryn", unit: "ml;cl;dl;l" },
    { name: "Quinoagryn", unit: "ml;cl;dl;l" },
    { name: "Ris", unit: "ml;cl;dl;l" },
    { name: "Bulgurvete", unit: "ml;cl;dl;l" },
    { name: "Mjöl", unit: "ml;cl;dl;l;mg;g;kg" },
    { name: "Socker", unit: "ml;cl;dl;l;mg;g;kg" },
    { name: "Honung", unit: "ml;cl;dl;l;ml;cl;dl;l" },
    { name: "Brunt socker", unit: "ml;cl;dl;l;mg;g;kg" },
    { name: "Vaniljextrakt", unit: "ml;cl;dl;l" },
    { name: "Kanel", unit: "ml;cl;dl;l" },
    { name: "Muskotnöt", unit: "ml;cl;dl;l" },
    { name: "Kardemumma", unit: "ml;cl;dl;l" },
    { name: "Korianderpulver", unit: "ml;cl;dl;l" },
    { name: "Spiskummin", unit: "ml;cl;dl;l" },
    { name: "Paprikapulver", unit: "ml;cl;dl;l" },
    { name: "Cayennepeppar", unit: "ml;cl;dl;l" },
    { name: "Garam masala", unit: "ml;cl;dl;l" },
    { name: "Currypulver", unit: "ml;cl;dl;l" },
    { name: "Cideräpple", unit: "ml;cl;dl;l" },
    { name: "Tranbär", unit: "ml;cl;dl;l" },
    { name: "Rosiner", unit: "ml;cl;dl;l" },
    { name: "Apelsin", unit: "st" },
    { name: "Äpple", unit: "st" },
    { name: "Blåbär", unit: "ml;cl;dl;l" },
    { name: "Jordgubbar", unit: "ml;cl;dl;l" },
    { name: "Hallon", unit: "ml;cl;dl;l" },
    { name: "Mango", unit: "st" },
    { name: "Ananas", unit: "st" },
    { name: "Melon", unit: "st" },
    { name: "Kiwi", unit: "st" },
    { name: "Aprikos", unit: "st" },
    { name: "Granatäpple", unit: "st;ml;cl;dl;l" },
    { name: "Persika", unit: "st" },
    { name: "Lök", unit: "mg;g;kg;st" },
    { name: "Selleri", unit: "mg;g;kg;stjälkar" },
    { name: "Potatis", unit: "mg;g;kg;st" },
];
let usr = [
    {
        username: "User 1",
        password: "Aaa111",
        email: "111@111.com",
    },
];
const role_arr = [{ name: "user" }, { name: "admin" }, { name: "mod" }];

function createRecipie() {
    let text = [
        "Lorem ipsum dolor sit amet, non eiusmod et nulla ea.",
        "Aute irure excepteur reprehenderit labore culpa ad duis.",
        "Proident exercitation reprehenderit ut commodo id id Lorem.",
        "Fugiat ullamco id aliquip occaecat ullamco adipisicing.",
        "Adipisicing velit consectetur incididunt aute qui voluptate irure excepteur dolor.",
        "Nostrud eu fugiat amet.",
        "Nulla ipsum labore nisi nisi nulla aliquip eiusmod aute officia.",
        "Incididunt laboris magna excepteur occaecat dolore exercitation",
        "dolor tempor cupidatat excepteur proident magna.",
        "Sunt et exercitation amet reprehenderit.",
        "Id officia ut ea et minim non ex qui nulla velit fugiat sunt non sunt voluptate ut nostrud.",
        "Proident veniam sunt nisi voluptate incididunt commodo cupidatat non amet",
        "Deserunt enim quis est laboris reprehenderit exercitation.",
        "Qui tempor ea velit esse excepteur reprehenderit velit esse eiusmod.",
        "Sint irure consectetur incididunt velit ut eiusmod incididunt excepteur laboris amet.",
        "Voluptate nulla proident nostrud id excepteur excepteur deserunt culpa Lorem elit veniam.",
        "Cupidatat nulla mollit quis aliquip ipsum ea mollit ea eu officia exercitation",
        "duis cupidatat pariatur fugiat elit sunt laborum veniam.",
        "Amet anim elit irure sunt cillum quis amet.",
        "Incididunt sit officia velit ipsum cillum.",
        "Lorem ipsum dolor sit amet, consectetur consequat occaecat labore",
        "Occaecat eu ea qui amet tempor exercitation id veniam deserunt elit irure voluptate exercitation nostrud.",
        "Velit tempor aliqua consectetur officia ullamco sunt dolore consectetur ea ea in eu.",
        "Dolore reprehenderit ut ea sunt quis eu exercitation cillum",
        "Exercitation id eiusmod amet laboris consectetur laboris ipsum culpa.",
        "Nostrud fugiat dolore mollit anim veniam exercitation laborum sit ea nostrud officia proident duis.",
        "In proident elit nostrud Anim voluptate id anim sunt labore eu sit proident voluptate.",
        "Dolore ex ullamco quis nulla exercitation nostrud.",
        "Occaecat consequat ut aliqua incididunt reprehenderit sit exercitation",
        "nisi veniam anim nisi aliquip cupidatat.",
        "Magna eu minim anim fugiat irure reprehenderit culpa dolore velit nostrud ad.",
        "Est laboris sunt sit nisi ut qui culpa incididunt nulla incididunt velit eu eiusmod.",
        "Voluptate nulla eiusmod amet et pariatur ipsum elit magna quis adipisicing",
        "eu esse sunt id excepteur ipsum qui irure ut.",
        "Ipsum cupidatat adipisicing exercitation sunt ut magna commodo qui et eu ea labore sint in.",
        "Tempor eu ullamco dolor id occaecat commodo pariatur et cillum aliquip officia.",
        "Magna cupidatat aliqua consequat mollit voluptate labore elit ut laboris non incididunt mollit voluptate esse irure.",
        "Dolore aliqua pariatur cillum aliqua ad nisi nulla dolor occaecat amet.",
        "Commodo consectetur consequat velit esse nostrud ex cupidatat reprehenderit",
        "aliqua eiusmod laboris enim aliqua officia enim sint enim mollit.",
        "Deserunt tempor eu anim Lorem dolor minim in quis ad dolor do consequat ex ullamco ",
        "veniam adipisicing exercitation consequat.",
        "Magna sint velit commodo in proident magna proident officia sit aliqua elit labore incididunt sunt incididunt.",
        "Ut laboris ad officia Fugiat magna irure laborum ea minim esse eiusmod ut ad deserunt mollit minim sint consectetur in aliqua.",
        "Consequat et sit duis irure sint laboris anim duis voluptate voluptate reprehenderit cillum quis commodo labore sint esse.",
        "Qui non proident sint ipsum commodo laboris dolore eiusmod mollit sunt mollit ex ut nostrud ipsum in.",
        "Occaecat eu excepteur ex sint qui anim reprehenderit culpa non.",
        "Adipisicing sit culpa nostrud esse laborum laboris cupidatat consequat deserunt cillum proident ",
        "aliquip non incididunt est dolore commodo tempor non.",
        "Excepteur reprehenderit laboris dolor consectetur adipisicing aute duis ipsum nostrud.",
    ];

    let descr = "";
    while (descr.length < 350) {
        let i = Math.floor(Math.random() * text.length);
        descr += text[i];
    }

    let instCount = Math.floor(Math.random() * (15 - 5) + 6);
    let instructions = [];
    for (let i = 0; i < instCount; i++) {
        let x = Math.floor(Math.random() * text.length);
        instructions.push(text[x]);
    }

    let name = "";
    let r = text[Math.floor(Math.random() * text.length)];
    let words = r.replace(/\.|\,/g, "").split(" ");
    let x = 0;
    while (name.length < 15 || x < 3) {
        x++;
        name += words[Math.floor(Math.random() * words.length)];
    }
    let ingredCount = Math.floor(Math.random() * (25 - 8) + 8);
    let ingreds = [];
    for (let i = 0; i < ingredCount; i++) {
        let ingred = ing[Math.floor(Math.random() * ing.length)];
        let units = ingred.unit.split(";");
        let temp = {
            name: ingred.name,
            amount: Math.floor(Math.random() * 20 - 5),
            unit: units[Math.floor(Math.random() * units.length)],
        };
        ingreds.push(temp);
    }
    let dif = Math.floor(Math.random() * 6 + 1);
    let time = Math.floor(Math.random() * (240 - 30 + 1 + 30));
    let uid = Math.floor(Math.random() * usr.length);

    return {
        name: name,
        description: descr,
        ingredients: ingreds,
        instructions: instructions,
        dificulty: dif,
        time: time,
        profile_id: Math.min(Math.floor(Math.random() * 2 + 1), 2),
    };
}
function createRecipieAsync() {
    return new Promise(async (res) => {
        let text = [
            "Lorem ipsum dolor sit amet, non eiusmod et nulla ea.",
            "Aute irure excepteur reprehenderit labore culpa ad duis.",
            "Proident exercitation reprehenderit ut commodo id id Lorem.",
            "Fugiat ullamco id aliquip occaecat ullamco adipisicing.",
            "Adipisicing velit consectetur incididunt aute qui voluptate irure excepteur dolor.",
            "Nostrud eu fugiat amet.",
            "Nulla ipsum labore nisi nisi nulla aliquip eiusmod aute officia.",
            "Incididunt laboris magna excepteur occaecat dolore exercitation",
            "dolor tempor cupidatat excepteur proident magna.",
            "Sunt et exercitation amet reprehenderit.",
            "Id officia ut ea et minim non ex qui nulla velit fugiat sunt non sunt voluptate ut nostrud.",
            "Proident veniam sunt nisi voluptate incididunt commodo cupidatat non amet",
            "Deserunt enim quis est laboris reprehenderit exercitation.",
            "Qui tempor ea velit esse excepteur reprehenderit velit esse eiusmod.",
            "Sint irure consectetur incididunt velit ut eiusmod incididunt excepteur laboris amet.",
            "Voluptate nulla proident nostrud id excepteur excepteur deserunt culpa Lorem elit veniam.",
            "Cupidatat nulla mollit quis aliquip ipsum ea mollit ea eu officia exercitation",
            "duis cupidatat pariatur fugiat elit sunt laborum veniam.",
            "Amet anim elit irure sunt cillum quis amet.",
            "Incididunt sit officia velit ipsum cillum.",
            "Lorem ipsum dolor sit amet, consectetur consequat occaecat labore",
            "Occaecat eu ea qui amet tempor exercitation id veniam deserunt elit irure voluptate exercitation nostrud.",
            "Velit tempor aliqua consectetur officia ullamco sunt dolore consectetur ea ea in eu.",
            "Dolore reprehenderit ut ea sunt quis eu exercitation cillum",
            "Exercitation id eiusmod amet laboris consectetur laboris ipsum culpa.",
            "Nostrud fugiat dolore mollit anim veniam exercitation laborum sit ea nostrud officia proident duis.",
            "In proident elit nostrud Anim voluptate id anim sunt labore eu sit proident voluptate.",
            "Dolore ex ullamco quis nulla exercitation nostrud.",
            "Occaecat consequat ut aliqua incididunt reprehenderit sit exercitation",
            "nisi veniam anim nisi aliquip cupidatat.",
            "Magna eu minim anim fugiat irure reprehenderit culpa dolore velit nostrud ad.",
            "Est laboris sunt sit nisi ut qui culpa incididunt nulla incididunt velit eu eiusmod.",
            "Voluptate nulla eiusmod amet et pariatur ipsum elit magna quis adipisicing",
            "eu esse sunt id excepteur ipsum qui irure ut.",
            "Ipsum cupidatat adipisicing exercitation sunt ut magna commodo qui et eu ea labore sint in.",
            "Tempor eu ullamco dolor id occaecat commodo pariatur et cillum aliquip officia.",
            "Magna cupidatat aliqua consequat mollit voluptate labore elit ut laboris non incididunt mollit voluptate esse irure.",
            "Dolore aliqua pariatur cillum aliqua ad nisi nulla dolor occaecat amet.",
            "Commodo consectetur consequat velit esse nostrud ex cupidatat reprehenderit",
            "aliqua eiusmod laboris enim aliqua officia enim sint enim mollit.",
            "Deserunt tempor eu anim Lorem dolor minim in quis ad dolor do consequat ex ullamco ",
            "veniam adipisicing exercitation consequat.",
            "Magna sint velit commodo in proident magna proident officia sit aliqua elit labore incididunt sunt incididunt.",
            "Ut laboris ad officia Fugiat magna irure laborum ea minim esse eiusmod ut ad deserunt mollit minim sint consectetur in aliqua.",
            "Consequat et sit duis irure sint laboris anim duis voluptate voluptate reprehenderit cillum quis commodo labore sint esse.",
            "Qui non proident sint ipsum commodo laboris dolore eiusmod mollit sunt mollit ex ut nostrud ipsum in.",
            "Occaecat eu excepteur ex sint qui anim reprehenderit culpa non.",
            "Adipisicing sit culpa nostrud esse laborum laboris cupidatat consequat deserunt cillum proident ",
            "aliquip non incididunt est dolore commodo tempor non.",
            "Excepteur reprehenderit laboris dolor consectetur adipisicing aute duis ipsum nostrud.",
        ];

        let descr = "";
        while (descr.length < 350) {
            let i = Math.floor(Math.random() * text.length);
            descr += text[i];
        }

        let instCount = Math.floor(Math.random() * (15 - 5) + 6);
        let instructions = [];
        for (let i = 0; i < instCount; i++) {
            let x = Math.floor(Math.random() * text.length);
            instructions.push(text[x]);
        }

        let name = "";
        let r = text[Math.floor(Math.random() * text.length)];
        let words = r.replace(/\.|\,/g, "").split(" ");
        let x = 0;
        while (name.length < 15 || x < 3) {
            x++;
            name += words[Math.floor(Math.random() * words.length)];
        }
        let ingredCount = Math.floor(Math.random() * (25 - 8) + 8);
        let ingreds = [];
        for (let i = 0; i < ingredCount; i++) {
            let ingred = ing[Math.floor(Math.random() * ing.length)];
            let units = ingred.unit.split(";");
            let temp = {
                id: "",
                name: ingred.name,
                amount: Math.floor(Math.random() * 20 - 5),
                unit: units[Math.floor(Math.random() * units.length)],
            };
            let id: any = { id: 1 };
            try {
                id = await Ingredient.findOne({
                    where: {
                        name: {
                            [iLike]: temp.name,
                        },
                    },
                });
            } catch (err) {
                console.log(temp.name);
                console.log("ING ERR");
            }

            temp.id = id.id;
            ingreds.push(temp);
        }

        let dif = Math.floor(Math.random() * 6 + 1);
        let time = Math.floor(Math.random() * (240 - 30 + 1 + 30));
        let uid = Math.floor(Math.random() * usr.length);

        res({
            name: name,
            description: descr,
            ingredients: ingreds,
            instructions: instructions,
            dificulty: dif,
            time: time,
            profile_id: Math.min(Math.floor(Math.random() * 2 + 1), 2),
        });
    });
}
async function drop2() {
    let ingredients = await database.getSequelize.query(
        "drop table ingredients cascade;",
    );
    let profiles = await database.getSequelize.query(
        "drop table profiles cascade;",
    );
    let recipieIngredients = await database.getSequelize.query(
        "drop table recipieIngredients cascade;",
    );
    let recipies = await database.getSequelize.query(
        "drop table recipies cascade;",
    );
    let roles = await database.getSequelize.query("drop table roles cascade;");
    let tokens = await database.getSequelize.query(
        "drop table tokens cascade;",
    );
    let userToken = await database.getSequelize.query(
        "drop table userToken cascade;",
    );
    let user_roles = await database.getSequelize.query(
        "drop table user_roles cascade;",
    );
    let users = await database.getSequelize.query("drop table users cascade;");

    await database.getSequelize.sync({
        force: true,
    });

    return [
        ingredients,
        profiles,
        recipieIngredients,
        recipies,
        roles,
        tokens,
        userToken,
        user_roles,
        users,
    ];
}

async function drop() {
    let ingredients: any,
        profiles: any,
        recipieIngredients: any,
        recipies: any,
        roles: any,
        tokens: any,
        userToken: any,
        user_roles: any,
        users: any;
    return new Promise((res) => {
        database.getSequelize
            .query("drop table ingredients cascade;")
            .then((res_ingredients) => {
                ingredients = res_ingredients;
            })
            .catch((err) => {
                console.log("ERROR", err);
            })
            .finally(() => {
                database.getSequelize
                    .query("drop table profiles cascade;")
                    .then((res_profiles: any) => {
                        profiles = res_profiles;
                    })
                    .catch((err) => {
                        console.log("ERROR", err);
                    })
                    .finally(() => {
                        database.getSequelize
                            .query('drop table "public"."recipieIngredients"')
                            .then((res_recipieIngredients: any) => {
                                recipieIngredients = res_recipieIngredients;
                            })
                            .catch((err) => {
                                console.log("ERROR", err);
                            })
                            .finally(() => {
                                database.getSequelize
                                    .query("drop table recipies cascade;")
                                    .then((res_recipies: any) => {
                                        recipies = res_recipies;
                                    })
                                    .catch((err) => {
                                        console.log("ERROR", err);
                                    })
                                    .finally(() => {
                                        database.getSequelize
                                            .query("drop table roles cascade;")
                                            .then((res_roles: any) => {
                                                roles = res_roles;
                                            })
                                            .catch((err) => {
                                                console.log("ERROR", err);
                                            })
                                            .finally(() => {
                                                database.getSequelize
                                                    .query(
                                                        "drop table tokens cascade;",
                                                    )
                                                    .then((res_tokens: any) => {
                                                        tokens = res_tokens;
                                                    })
                                                    .catch((err) => {
                                                        console.log(
                                                            "ERROR",
                                                            err,
                                                        );
                                                    })
                                                    .finally(() => {
                                                        database.getSequelize
                                                            .query(
                                                                'drop table "public"."userToken"',
                                                            )
                                                            .then(
                                                                (
                                                                    res_userToken: any,
                                                                ) => {
                                                                    userToken =
                                                                        res_userToken;
                                                                },
                                                            )
                                                            .catch((err) => {
                                                                console.log(
                                                                    "ERROR",
                                                                    err,
                                                                );
                                                            })
                                                            .finally(() => {
                                                                database.getSequelize
                                                                    .query(
                                                                        "drop table user_roles cascade;",
                                                                    )
                                                                    .then(
                                                                        (
                                                                            res_user_roles: any,
                                                                        ) => {
                                                                            user_roles =
                                                                                res_user_roles;
                                                                        },
                                                                    )
                                                                    .catch(
                                                                        (
                                                                            err,
                                                                        ) => {
                                                                            console.log(
                                                                                "ERROR",
                                                                                err,
                                                                            );
                                                                        },
                                                                    )
                                                                    .finally(
                                                                        () => {
                                                                            database.getSequelize
                                                                                .query(
                                                                                    "drop table users cascade;",
                                                                                )
                                                                                .then(
                                                                                    (
                                                                                        res_users: any,
                                                                                    ) => {
                                                                                        users =
                                                                                            res_users;
                                                                                    },
                                                                                )
                                                                                .catch(
                                                                                    (
                                                                                        err,
                                                                                    ) => {
                                                                                        console.log(
                                                                                            "ERROR",
                                                                                            err,
                                                                                        );
                                                                                    },
                                                                                )
                                                                                .finally(
                                                                                    async () => {
                                                                                        await database.getSequelize.sync(
                                                                                            {
                                                                                                force: true,
                                                                                            },
                                                                                        );
                                                                                        res(
                                                                                            [
                                                                                                ingredients,
                                                                                                profiles,
                                                                                                recipieIngredients,
                                                                                                recipies,
                                                                                                roles,
                                                                                                tokens,
                                                                                                userToken,
                                                                                                user_roles,
                                                                                                users,
                                                                                            ],
                                                                                        );
                                                                                    },
                                                                                );
                                                                        },
                                                                    );
                                                            });
                                                    });
                                            });
                                    });
                            });
                    });
            });
    });
}
("drop table ingredients cascade;");
("drop table profiles cascade;");
("drop table recipieIngredients cascade;");
("drop table recipies cascade;");
("drop table roles cascade;");
("drop table tokens cascade;");
("drop table userToken cascade;");
("drop table user_roles cascade;");
("drop table users cascade;");
async function drop3() {
    return new Promise((resolve, reject) => {
        database.getSequelize
            .query("drop table ingredients cascade;")
            .then(async (ing) => {
                database.getSequelize
                    .query("drop table recepie_ingredient cascade;")
                    .then(async (rec_ing) => {
                        database.getSequelize
                            .query("drop table recipies cascade;")
                            .then(async (recipies) => {
                                database.getSequelize
                                    .query("drop table roles cascade;")
                                    .then(async (roles) => {
                                        database.getSequelize
                                            .query(
                                                "drop table user_profiles cascade;",
                                            )
                                            .then(async (user_prof) => {
                                                database.getSequelize
                                                    .query(
                                                        "drop table user_roles cascade;",
                                                    )
                                                    .then(async (user_role) => {
                                                        database.getSequelize
                                                            .query(
                                                                "drop table user_tokens cascade;",
                                                            )
                                                            .then(
                                                                async (
                                                                    user_tok,
                                                                ) => {
                                                                    database.getSequelize
                                                                        .query(
                                                                            "drop table users cascade;",
                                                                        )
                                                                        .then(
                                                                            async (
                                                                                user,
                                                                            ) => {
                                                                                resolve(
                                                                                    [
                                                                                        ing,
                                                                                        recipies,
                                                                                        rec_ing,
                                                                                        roles,
                                                                                        user_prof,
                                                                                        user_role,
                                                                                        user_tok,
                                                                                        user,
                                                                                    ],
                                                                                );
                                                                            },
                                                                        );
                                                                },
                                                            );
                                                    });
                                            });
                                    });
                            });
                    });
            });
    });
}

let writeRole = async (role: any) => {
    return new Promise((res, rej) => {
        Role.create(role)
            .then((resault) => res(resault))
            .catch((error) => {
                console.log("Role ERROR");
                console.log(error);
                res(error);
            });
    });
};
let writeUser = async (user: any) => {
    return new Promise((res, rej) => {
        try {
            let userInfo = {
                username: user.username,
                email: user.email,
                password: hashSync(user.password, 8),
            };
            User.create(userInfo)
                .then(async (res_usr: any) => {
                    let profile = await res_usr.createProfile();
                    try {
                        if (user.role) {
                            let user_role = role_arr.filter(
                                (e) => e == user.role,
                            );

                            res_usr.setRoles(user_role).then(() => {
                                res(res_usr);
                            });
                        } else {
                            res_usr.setRoles([1]).then(() => {
                                res(res_usr);
                            });
                        }
                    } catch (err) {
                        console.log(user, res_usr);
                    }
                })
                .catch((err) => {
                    throw err;
                });
        } catch (error) {
            console.log("UserError");
            res(error);
        }
    });
};
let writeIngredient = async (ingredient: any) => {
    return new Promise((res, rej) => {
        Ingredient.create(ingredient)
            .then((data) => {
                res(data);
            })
            .catch((err) => {
                console.log("Ingred error");
                res(err);
            });
    });
};
let writeRecipie = async (recipie: any) => {
    console.log(recipie);
    return new Promise(async (res, rej) => {
        Recipie.create(recipie)
            .then(async (res_recipe: any) => {
                res(res_recipe);
            })
            .catch((err: any) => {
                console.log("Recepie ERROR", err);
                res(err);
            });
    });
};

async function write() {
    let recepies = [];
    await database.getSequelize.sync();
    while (recepies.length < 15) {
        recepies.push(createRecipie());
    }
    let rolePromise = [];
    for (let r of role_arr) {
        rolePromise.push(writeRole(r));
    }
    let roles = await Promise.all(rolePromise);

    let ingredPromise = [];
    for (let i of ing) {
        ingredPromise.push(writeIngredient(i));
    }
    let ingreds = await Promise.all(ingredPromise);
    return { roles, ingreds };
}
export default async (req: Request, res: Response) => {
    console.log("populare");
    if (req.query.drop) {
        let x = await drop();
        console.log("all dropped");
    }
    if (req.query.getrecipies) {
        let recepies = [];
        for (let i = 0; i < 15; i++) {
            let recepie = await createRecipieAsync();
            console.log(recepie);
            recepies.push(recepie);
        }

        return res.json(recepies);
    }
    let result = await write();
    res.json(result);
};
/*
x={
    id: {
        type: int,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: string,
        allowNull: false,
    },
    description: {
        type: string,
        allowNull: false,
    },
    image_url: {
        type: string,
        allowNull: true,
    },
    dificulty: {
        type: int,
        allowNull: true,
    },
    time: {
        type: int,
        allowNull: true,
    }
*/
