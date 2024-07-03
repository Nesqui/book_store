import { Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { jwtConstants } from 'src/constants';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
      global: true,
    }),
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, EmailService, Logger],
})
export class UserModule { }
