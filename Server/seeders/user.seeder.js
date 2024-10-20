import { User } from "../models/user.Model.js";

const createUser = async(numberUser) => {
    try {
        const userPromise= [];
        for(let i=0;i<numberUser;i++)
        {
            const tempUser=User.create({
                name:faker.person.fullName(),
                username:faker.internet.userName(),
                bio:faker.lorem.sentence(10),
                password:"password",
                avatar:{
                    url:faker.image.avatar(),
                    public_id:faker.system.fileName(),

                }
            });
            userPromise.push(tempUser);
        }

        await Promise.all(userPromise);
        console.log("Users Created : ",numberUser);
        process.exit(1);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};


export { createUser };
