import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase;


describe("Show User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })


  it("should be able show user profile", async () => {

    const passwordHash = await hash("1234", 8);
    const createUser = await inMemoryUsersRepository.create({
      email: "teste@testeme2.com.br",
      name: "Tales Monteiro",
      password: passwordHash
    });

    const userResponse = await showUserProfileUseCase.execute(createUser.id);
    expect(userResponse).toHaveProperty("email");

  })

  it("should not be able show a Non-existent user profile", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('123456546');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
