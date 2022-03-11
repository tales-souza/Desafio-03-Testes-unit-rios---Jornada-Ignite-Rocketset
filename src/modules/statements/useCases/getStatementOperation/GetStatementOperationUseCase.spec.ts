import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemorystatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe("Get statement operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemorystatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemorystatementsRepository);
  });

  it("should be able get statement operation", async () => {

    const createUser = await inMemoryUsersRepository.create({
      email: "teste@testeme2.com.br",
      name: "Tales Monteiro",
      password: "1234454"
    });

    const createStatment = await inMemorystatementsRepository.create(
      {
        user_id: createUser.id,
        amount: 147.58,
        description: "teste",
        type: OperationType.DEPOSIT
      });

      const getStatementOperation = await getStatementOperationUseCase.execute({ user_id: createUser.id,statement_id: createStatment.id});

      expect(getStatementOperation).toHaveProperty("description");

  });

  it("should not be able get statement operation with non-existent user", async () => {
    expect( async() => {
      const createUser = await inMemoryUsersRepository.create({
        email: "teste@testeme2.com.br",
        name: "Tales Monteiro",
        password: "1234454"
      });

      const createStatment = await inMemorystatementsRepository.create(
        {
          user_id: createUser.id,
          amount: 147.58,
          description: "teste",
          type: OperationType.DEPOSIT
        });

        const getStatementOperation = await getStatementOperationUseCase.execute({ user_id: '5454545454545454',statement_id: createStatment.id});
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound) ;

  });

  it("should not be able get statement operation with non-existent statement ", async () => {
    expect( async() => {
      const createUser = await inMemoryUsersRepository.create({
        email: "teste@testeme2.com.br",
        name: "Tales Monteiro",
        password: "1234454"
      });

       await inMemorystatementsRepository.create(
        {
          user_id: createUser.id,
          amount: 147.58,
          description: "teste",
          type: OperationType.DEPOSIT
        });

         await getStatementOperationUseCase.execute({ user_id: createUser.id  ,statement_id: '454554564564564654'});
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound) ;

  });

});
