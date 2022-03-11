import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let inMemoryUsersRepository : InMemoryUsersRepository;
let authenticateUserUseCase : AuthenticateUserUseCase;

describe ("Authenticate User", () =>{

  beforeEach(() => {
     inMemoryUsersRepository = new InMemoryUsersRepository();
     authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a authenticate for the user",  async () => {

    const passwordHash = await hash("123", 8);


     await inMemoryUsersRepository.create({
      email : "teste@testeme.com.br",
      name : "Tales Monteiro",
      password : passwordHash
    });

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: "teste@testeme.com.br",
      password: "123"
    });

    expect(authenticatedUser).toHaveProperty("token");

  })

  it("should not be able to create a authenticate with email not existent", async () => {
    expect(async () => {
      const passwordHash = await hash("1234", 8);

      await inMemoryUsersRepository.create({
        email : "teste@testeme2.com.br",
        name : "Tales Monteiro",
        password : passwordHash
      });

      await authenticateUserUseCase.execute({
        email: "teste@testeme3.com.br",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })



  it("should not be able to create a authenticate with invalid password", async () => {
    expect(async () => {
      const passwordHash = await hash("666", 8);

      await inMemoryUsersRepository.create({
        email : "teste@testeme2.com.br",
        name : "Tales Monteiro",
        password : passwordHash
      });

      await authenticateUserUseCase.execute({
        email: "teste@testeme2.com.br",
        password: "777"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })




})
