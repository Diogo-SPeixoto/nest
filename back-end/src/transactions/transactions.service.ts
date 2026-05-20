import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    await this.updateBalances(createTransactionDto);

    const { payerId, receiverId, value } = createTransactionDto;

    const transaction = await this.prisma.transaction.create({
      data: {
        status: 'success',
        value,
        payerId,
        receiverId,
      },
    });

    return transaction;
  }

  async findAll() {
    return await this.prisma.transaction.findMany();
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new HttpException('Transaction not found.', HttpStatus.NOT_FOUND);
    }

    return transaction;
  }

  private async updateBalances(createTransactionDto: CreateTransactionDto) {
    const { payerId, receiverId, value } = createTransactionDto;

    const payerUser = await this.userService.findOne(payerId);

    if (value > payerUser.balance) {
      throw new HttpException(
        'Insufficient funds.',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    const receiverUser = await this.userService.findOne(receiverId);

    const newPayerBalance = payerUser.balance - value;
    const newReceiverBalance = receiverUser.balance + value;

    await this.prisma.user.update({
      where: { id: payerId },
      data: { balance: newPayerBalance },
    });

    await this.prisma.user.update({
      where: { id: receiverId },
      data: { balance: newReceiverBalance },
    });

    return;
  }
}
