import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const emailExist = await this.prisma.user.findUnique({
      where: { email },
    });

    if (emailExist) {
      throw new HttpException('Email already exist.', HttpStatus.CONFLICT);
    }

    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    const newUser = await this.prisma.user.create({
      data: { ...createUserDto, password: hashPassword },
      omit: { password: true },
    });

    return newUser;
  }

  async findAll() {
    return await this.prisma.user.findMany({
      omit: { password: true },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    return;
  }
}
