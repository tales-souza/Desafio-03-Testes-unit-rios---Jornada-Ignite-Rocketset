import { app } from "../../../../app";
import request from "supertest";
import { Connection, createConnection } from "typeorm";


let connection : Connection;

describe("Create User Controller", () => {


  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({ name: "Tales Monteiro", email: "tales.monteiro@hotmail.com", password: "123" });

    expect(response.status).toBe(201);

  });





});
