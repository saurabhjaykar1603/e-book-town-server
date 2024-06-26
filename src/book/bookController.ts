import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "fs";
import { AuthRequest } from "../middlewares/authMiddleware";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  // Validate title and genre
  if (!title || typeof title !== "string") {
    return next(createHttpError(400, "Invalid or missing title"));
  }

  if (!genre || typeof genre !== "string") {
    return next(createHttpError(400, "Invalid or missing genre"));
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (!files || !files.coverImage || !files.coverImage[0]) {
    return next(createHttpError(400, "Missing cover image"));
  }

  if (!files || !files.file || !files.file[0]) {
    return next(createHttpError(400, "Missing book PDF"));
  }

  const coverImageFileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    coverImageFileName
  );
  const coverImageMineType = files.coverImage[0].mimetype.split("/").at(-1);
  /////////////////////////
  const bookPdfFileName = files.file[0].filename;
  const bookPdfPath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    bookPdfFileName
  );
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: coverImageFileName,
      folder: "book-covers",
      format: coverImageMineType,
    });

    const uploadBookPdfFileResult = await cloudinary.uploader.upload(
      bookPdfPath,
      {
        resource_type: "raw",
        filename_override: bookPdfFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );
    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      author: _req.userId,
      genre,
      coverImage: uploadResult.secure_url,
      file: uploadBookPdfFileResult.secure_url,
    });
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookPdfPath);
    return res.status(201).json({
      message: "Book created successfully",
      data: newBook._id,
    });
    // console.log("upload book pdf result", uploadBookPdfFileResult);
    // console.log("upload result", uploadResult);
  } catch (error) {
    const err = createHttpError(500, "Error while uploading file");
    console.log(error);

    return next(err);
  }
};

export { createBook };
