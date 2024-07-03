import {
    Table,
    Column,
    Model,
    AllowNull,
    BelongsTo,
    ForeignKey,
    PrimaryKey,
  } from 'sequelize-typescript';
import { Book } from './book.entity';
import { Genre } from 'src/genre/entities/genre.entity';
  
  @Table
  export class BookGenres extends Model {
    @Column({
      primaryKey: true,
      autoIncrement: true,
    })
    id: number;
  
    @BelongsTo(() => Book)
    book: Book;
  
    @ForeignKey(() => Book)
    @PrimaryKey
    @AllowNull(false)
    @Column
    bookId: number;
  

    @BelongsTo(() => Genre)
    genre: Genre;
  
    @ForeignKey(() => Genre)
    @PrimaryKey
    @AllowNull(false)
    @Column
    genreId: number;
  }
  