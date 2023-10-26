db.createCollection("users");
db.createCollection("services");

db.users.insertOne({
    username: "admin",
    password: "pw"
});

db.createUser(
    {
        user: "user",
        pwd: "user",
        roles: [
            {
                role: "readWrite",
                db: "nextjs_example"
            }
        ]
    }
)