import { Request, Response } from "express";
import { container } from "tsyringe";
import { BalanceTransferUseCase } from "./BalanceTransferUseCase";

class BalanceTransferController {

  async handle(request: Request, response: Response) : Promise<Response>{

    const balanceTransferUseCase = container.resolve(BalanceTransferUseCase)

    const { amount, description } = request.body;
    const { user_receiver_id } = request.params;
    const user_sender_id = request.user.id;

    const statementOperation = await balanceTransferUseCase.execute({
      amount,
      description,
      user_receiver_id,
      user_sender_id
    });

    return response.status(201).json(statementOperation);

  }


}

export { BalanceTransferController }
