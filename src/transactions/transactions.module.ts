import { Module } from '@nestjs/common';
import { TransactionController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionsService, UsersService],
})
export class TransactionModule {}
