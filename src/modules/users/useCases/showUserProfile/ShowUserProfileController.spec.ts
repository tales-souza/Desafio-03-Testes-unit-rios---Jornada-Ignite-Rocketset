import { app } from "../../../../app";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { Connection, createConnection } from "typeorm";
import { hash } from "bcryptjs";

let connection : Connection;

describe("Create Show User Profile Controller", () => {


  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();

    const password = await hash("admin", 8);

    await connection.query(`
      INSERT INTO USERS(id, name, email, password, created_at )
         values('${id}', 'admin2', 'admin2@finapi.com', '${password}', 'now()')
      `);

  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able show user profile", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "admin2@finapi.com", password: "admin" });

      const { token } = responseToken.body;

      const response = await request(app)
      .get("api/v1/users")
      .set({
        Authorization: `Bearer ${token}`
      });

      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("email");

  });
});
