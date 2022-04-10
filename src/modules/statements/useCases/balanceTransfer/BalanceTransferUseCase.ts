import { inject, injectable } from "tsyringe"
import { OperationType } from "../../../Enums/OperationType"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { Statement } from "../../entities/Statement"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementError } from "../createStatement/CreateStatementError"

interface IRequest {
  user_sender_id: string,
  user_receiver_id : string,
  amount: number,
  description: string

}


@injectable()
class BalanceTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}


  async execute({ user_sender_id, user_receiver_id, amount, description}: IRequest) : Promise<Statement> {

    const userSender = await this.usersRepository.findById(user_sender_id);

    if(!userSender){
      throw new CreateStatementError.UserNotFound();
    }

    const userReceiver = await this.usersRepository.findById(user_receiver_id);

    if(!userReceiver){
      throw new CreateStatementError.UserNotFound();

    }

    /* Create Balance WithDraw Statement of user_sender_id  */
    const { balance } = await this.statementsRepository.getUserBalance({user_id : userSender.id })

    if(balance < amount){
      throw new CreateStatementError.InsufficientFunds()
    }


    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.WITHDRAW,
      user_id: userSender.id
    })

    /* Create Balance deposit Statement of user_receiver_id  */

    const statementOperation =  await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.TRANSFER,
      user_id: userReceiver.id
    });

    return statementOperation;
  }


}

export { BalanceTransferUseCase }
