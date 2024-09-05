import { db } from "./db.js";
import { users, type NewUserType } from "./schema/user.js";
import { faker } from "@faker-js/faker";

const insertUser = async (user: NewUserType) => {
  return db.insert(users).values(user);
};

const seedUsers = async (count: number) => {
  for (let i = 0; i < count; i++) {
    const randomName = faker.person.fullName();
    const randomPassword = faker.internet.password();
    const newUser: NewUserType = {
      username: randomName,
      password: randomPassword,
    };
    const res = await insertUser(newUser);
    console.log(res);
  }
};

await seedUsers(10);
