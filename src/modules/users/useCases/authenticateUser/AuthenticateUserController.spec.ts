import { app } from "../../../../app";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { Connection, createConnection } from "typeorm";
import { hash } from "bcryptjs";


let connection : Connection;

describe("Create Authenticate Controller", () => {


  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();

    const password = await hash("admin", 8);

    await connection.query(`
      INSERT INTO USERS(id, name, email, password, created_at )
         values('${id}', 'admin', 'admin@finapi.com.br', '${password}', 'now()')
      `);

  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new Authenticate for user", async () => {
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "admin@finapi.com.br", password: "admin" });

    expect(response.status).toBe(200);

  });


});
