import { BelongsToMany, Column, Model, Table } from "sequelize-typescript";
import { BookGenres } from "src/book/entities/book-genres.entity";
import { Book } from "src/book/entities/book.entity";

@Table
export class Genre extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column
  name: string

  @BelongsToMany(() => Book, () => BookGenres)
  genres: Book[];
}
