import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './entities/book.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { BookGenres } from './entities/book-genres.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, SequelizeModule.forFeature([Book, Genre, BookGenres])],
  controllers: [BookController],
  providers: [BookService, JwtService],
})
export class BookModule { }
