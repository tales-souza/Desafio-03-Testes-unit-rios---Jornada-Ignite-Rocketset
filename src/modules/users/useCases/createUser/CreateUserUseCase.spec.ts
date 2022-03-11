import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create User", () => {

  beforeEach(() => {

    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

  })


  it("shoud be able to create a new user", async () => {

    const user = await createUserUseCase.execute(
      { email: "teste@testeme.com",
        name: "Tales Monteiro",
        password: "123" }
      )

      expect(user).toHaveProperty("id");

  })

  it("shoud not be able to create user with existing email",  () => {
    expect( async () => {

      await createUserUseCase.execute(
        { email: "teste2@testeme.com",
          name: "Tales Monteiro",
          password: "123" }
        )

        await createUserUseCase.execute(
          { email: "teste2@testeme.com",
            name: "Tales Monteiro",
            password: "123" }
          )
    } ).rejects.toBeInstanceOf(CreateUserError)
  });


})

