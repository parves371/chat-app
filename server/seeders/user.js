import { Chat } from "../models/chat.models.js";
import { Message } from "../models/massages.model.js";
import { User } from "../models/user.models.js";
import { faker, SimpleFaker, simpleFaker } from "@faker-js/faker";
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

const sinlglechat = async (numuser) => {
  try {
    const users = await User.find().select("_id");
    const chatPromises = [];
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        chatPromises.push(
          Chat.create({
            name: faker.lorem.sentence(10),
            members: [users[i], users[j]],
          })
        );
      }
    }

    await Promise.all(chatPromises);
    console.log("singal chat created", numuser);
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createSamllChat = async (numChat) => {
  try {
    const users = await User.find().select("_id");
    const chatPromises = [];
    for (let i = 0; i < numChat; i++) {
      const nummembers = SimpleFaker.number.int({ min: 3, max: users.length });
      const members = [];
      for (j = 0; j < nummembers; j++) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];

        // insure that no member is repeated
        if (!members.includes(users[randomUser])) {
          members.push(users[randomIndex]);
        }
      }
      const chat = Chat.create({
        name: faker.lorem.words(1),
        members,
        groupChat: true,
        creator: members[0],
      });

      chatPromises.push(chat);
    }

    await Promise.all(chatPromises);
    console.log("chat created", numChat);
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createMassage = async (numMassage) => {
  try {
    const chats = await Chat.find().select("_id");
    const user = await User.find().select("_id");
    const massagePromises = [];
    for (let i = 0; i < numMassage; i++) {
      const randomChat = chats[Math.floor(Math.random() * chats.length)];
      const randomUser = user[Math.floor(Math.random() * user.length)];
      const massage = Message.create({
        chat: randomChat,
        sender: randomUser,
        content: faker.lorem.sentence(),
      });
      massagePromises.push(massage);
    }

    await Promise.all(massagePromises);
    console.log("massage created", numMassage);
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createMessageInAChat = async (chatId, numMassage) => {
  try {
    const user = await User.find().select("_id");
    const messagePromises = [];
    for (let i = 0; i < numMassage; i++) {
      const randomUser = user[Math.floor(Math.random() * user.length)];
      messagePromises.push(
        Message.create({
          chatId,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }
    await Promise.all(messagePromises);
    console.log("massage created", numMassage);
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
export {
  userCreate,
  sinlglechat,
  createSamllChat,
  createMassage,
  createMessageInAChat,
};
