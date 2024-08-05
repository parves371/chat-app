import { User } from "../models/user.models.js";
import { faker } from "@faker-js/faker";
const userCreate = async (numuser) => {
  try {
    const userPromises = [];
    for (let i = 0; i < numuser; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        bio: faker.lorem.sentence(10),
        password: "password",
        avatar: {
          public_id: faker.system.fileName(),
          url: faker.image.avatar(),
        },
      });
      userPromises.push(tempUser);
    }

    await Promise.all(userPromises);
    console.log("user created", numuser);
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export { userCreate };
