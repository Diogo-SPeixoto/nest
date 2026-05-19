import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionModule } from 'src/transactions/transactions.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
