import { Types } from "mongoose";

export interface Book {
  _id: string;
  title: string;
  author: Types.ObjectId;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
  //   description: string;
  //   rating: number;
}
