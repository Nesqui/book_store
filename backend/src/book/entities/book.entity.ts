import {
    Table,
    Column,
    Model,
    BelongsToMany
} from 'sequelize-typescript';
import { Genre } from 'src/genre/entities/genre.entity';
import { BookGenres } from './book-genres.entity';

@Table
export class Book extends Model {
    @Column({
      primaryKey: true,
      autoIncrement: true,
    })
    id: number;
  
    @Column
    title: string

    @Column
    author: string

    @Column
    publicationDate: string

    @BelongsToMany(() => Genre, () => BookGenres)
    genres: Genre[];
}

