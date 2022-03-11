import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemorystatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;



describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemorystatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemorystatementsRepository, inMemoryUsersRepository);
  });

  it("should be able get balance", async () => {

    const createUser = await inMemoryUsersRepository.create({
      email: "teste@testeme2.com.br",
      name: "Tales Monteiro",
      password: "1234454"
    });

    const balance = await getBalanceUseCase.execute({ user_id: createUser.id });

    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");
  })

  it("should not be able get balance with non-existent user ", async () => {
    expect(async() => {
      await getBalanceUseCase.execute({ user_id: "5545454545454" });
    }).rejects.toBeInstanceOf(GetBalanceError) ;
  });



});
