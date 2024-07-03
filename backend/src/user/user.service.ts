import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { generateHash, generateRndHash } from 'src/utils';
import { Op } from 'sequelize';
import { EmailService } from 'src/email/email.service';
import { Sequelize } from 'sequelize-typescript';
import { AcceptUserDto } from './dto/accept-user.dto';
import * as Handlebars from 'handlebars';
import { promises as fs } from 'fs';
import * as path from 'path';
import { LoginUserDto } from './dto/login-user.dto';
import { compare } from 'bcryptjs';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly sequelize: Sequelize,
    private readonly logger: Logger,
    @InjectModel(User)
    private userModel: typeof User,
  ) { }


  async login(user: LoginUserDto) {

    const foundUser = await this.userModel.findOne({
      where: {
        username: user.username,
      },
      attributes: {
        exclude: ['confirmationHash']
      }
    })

    if (!foundUser) throw new NotFoundException('User not found')
    const password = await compare(user.password, foundUser.password)
    if (!password) throw new NotFoundException('Username or password is incorrect')

    delete foundUser.dataValues.password
    return await this.jwtService.signAsync(foundUser.dataValues)
  }

  async accept(acceptUserDto: AcceptUserDto) {
    const existingUser = await this.userModel.findOne({
      where: {
        username: acceptUserDto.username,
        confirmationHash: acceptUserDto.confirmationHash
      }
    });

    if (!existingUser) {
      const templatePath = path.resolve(__dirname, '../templates', 'user-not-found.template.hbs');
      const templateSource = await fs.readFile(templatePath, 'utf8');
      const template = Handlebars.compile(templateSource);
      const htmlMessage = template({});
      return htmlMessage
    }
    const transaction = await this.sequelize.transaction();

    try {
      await this.emailService.onSuccessConfirmation(existingUser.email)
      existingUser.confirmationHash = null
      existingUser.active = true
      await existingUser.save({ transaction })
      const templatePath = path.resolve(__dirname, '../templates', 'confirmed.template.hbs');
      const templateSource = await fs.readFile(templatePath, 'utf8');
      const template = Handlebars.compile(templateSource);
      const htmlMessage = template({});
      await transaction.commit()
      return htmlMessage
    } catch (error) {
      this.logger.error(error)
      transaction.rollback()
      throw error
    }
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      where: {
        [Op.or]: [
          { username: createUserDto.username },
          { email: createUserDto.email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('User with same nickname already exists');
      }
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('User with same email already exists');
      }
    }
    const transaction = await this.sequelize.transaction();
    try {
      const password = await generateHash(createUserDto.password)
      const confirmationHash = generateRndHash()
      const user = await this.userModel.create({ ...createUserDto, password, confirmationHash, role: 1 }, { transaction })
      delete user.dataValues.password
      delete user.dataValues.confirmationHash
      await this.emailService.askConfirmation(user.email, confirmationHash, user.username)
      await transaction.commit()
      return user.dataValues;
    } catch (error) {
      await transaction.rollback();
      throw error
    }
  }

  async findOne(id: number) {
    return await this.userModel.findByPk(id, { attributes: { exclude: ['password', 'confirmationHash'] } });
  }

  async updateRole(id: string, updateUserRoleDto: UpdateUserRoleDto) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = updateUserRoleDto.role;
    await user.save();

    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
