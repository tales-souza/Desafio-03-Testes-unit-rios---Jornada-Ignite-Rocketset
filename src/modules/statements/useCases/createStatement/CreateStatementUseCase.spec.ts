import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemorystatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemorystatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemorystatementsRepository);


  });

  it("should be able create statement", async () => {
    const createUser = await inMemoryUsersRepository.create({
      email: "teste@testeme2.com.br",
      name: "Tales Monteiro",
      password: "1234454"
    });


    const createStatement = await createStatementUseCase.execute({ user_id: createUser.id, type: OperationType.DEPOSIT, amount: 555, description: "Testes Unitários" });

    expect(createStatement).toHaveProperty("id");

  });

  it("should not be able create create statement with Non-existent user ", async () => {
    expect(async () => {
      await createStatementUseCase.execute({ user_id: '1515151561651651651', type: OperationType.DEPOSIT, amount: 480, description: "Testes Unitários" });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to withdraw with insufficient balance", async () => {
    expect(async () => {
      const createUser = await inMemoryUsersRepository.create({
        email: "teste@testeme2.com.br",
        name: "Tales Monteiro",
        password: "1234454"
      });

      await createStatementUseCase.execute({ user_id: createUser.id, type: OperationType.DEPOSIT, amount: 250, description: "Depósito" });
      await createStatementUseCase.execute({ user_id: createUser.id, type: OperationType.WITHDRAW, amount: 280, description: "Saque" });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })

});
