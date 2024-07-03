import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookGenres } from './entities/book-genres.entity';
import { Book } from './entities/book.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(BookGenres)
    private bookGenresModel: typeof BookGenres,
    @InjectModel(Book)
    private bookModel: typeof Book,
    @InjectModel(Genre)
    private genreModel: typeof Genre,
    private readonly sequelize: Sequelize,
  ) { }

  async create(createBookDto: CreateBookDto) {
    const t = await this.sequelize.transaction();

    const book = await this.bookModel.create({ ...createBookDto }, { transaction: t })
    await this.joinGenresToBook(book.id, createBookDto.genres, t)
    await t.commit()

    const createdBook = await this.findOne(book.id)
    return createdBook;
  }

  async findAll() {
    const res = await this.bookModel.findAll({
      include: [this.genreModel]
    })
    return res;
  }

  async findOne(id: number) {
    const res = await this.bookModel.findByPk(id, {
      include: [this.genreModel]
    })
    return res;
  }

  private async joinGenresToBook(bookId: number, genres: string[], t: Transaction) {
    const genresPromises = genres.map(async name => {
      const [genre, created] = await this.genreModel.findOrCreate({
        where: { name },
        defaults: { name },
        transaction: t
      });
      return genre.id;
    });

    const genresIds = await Promise.all(genresPromises);

    const bookGenres = genresIds.map(genreId => ({
      bookId,
      genreId
    }));

    await this.bookGenresModel.bulkCreate(bookGenres, { transaction: t });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const t = await this.sequelize.transaction();

    try {

      const book = await this.bookModel.findByPk(id, { transaction: t });
      if (!book) {
        throw new NotFoundException('Book not found');
      }

      await book.update({ ...updateBookDto }, { transaction: t });

      await this.bookGenresModel.destroy({
        where: { bookId: book.id },
        transaction: t
      });

      await this.joinGenresToBook(id, updateBookDto.genres, t)
      await t.commit();

      const updatedBook = await this.findOne(book.id);
      return updatedBook;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async remove(id: number) {
    const exist = await this.bookModel.findByPk(id)
    if (!exist)
      throw new NotFoundException('Book not found')
    const res = await this.bookModel.destroy({ where: { id } })
    return !!res
  }
}
