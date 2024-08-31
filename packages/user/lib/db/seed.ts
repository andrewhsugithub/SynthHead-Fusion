import { db } from "./db.js";
import { users, type UserType } from "./schema/user.js";
import { faker } from "@faker-js/faker";

const insertUser = async (user: UserType) => {
  return db.insert(users).values(user);
};

const seedUsers = async (count: number) => {
  for (let i = 0; i < count; i++) {
    const randomName = faker.person.fullName();
    const newUser: UserType = { name: randomName };
    const res = await insertUser(newUser);
    console.log(res);
  }
};

await seedUsers(10);
