import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "fs";
import { AuthRequest } from "../middlewares/authMiddleware";

const extractPublicId = (url: string) => {
  const parts = url.split("/");
  const fileNameWithExtension = parts[parts.length - 1];
  const folderPath = parts
    .slice(parts.length - 3, parts.length - 1)
    .filter((part) => !part.startsWith("v"))
    .join("/");
  const publicId =
    folderPath +
    "/" +
    (fileNameWithExtension.split(".")[1] === "pdf"
      ? fileNameWithExtension
      : fileNameWithExtension.split(".")[0]);
  return publicId;
};

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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const { bookId } = req.params;

  if (!genre || typeof genre !== "string") {
    return next(createHttpError(400, "Invalid or missing genre"));
  }
  if (!title || typeof title !== "string") {
    return next(createHttpError(400, "Invalid or missing title"));
  }

  try {
    const book = await bookModel.findById({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId.toString()) {
      return next(
        createHttpError(403, "You are not authorized to update this book")
      );
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let completeCoverImage = book.coverImage;
    let completeFileName = book.file;

    if (files?.coverImage) {
      const coverImageFile = files.coverImage[0];
      const coverImageMineType = coverImageFile.mimetype.split("/").at(-1);
      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads/" + coverImageFile.filename
      );
      // Delete the previous cover image from Cloudinary
      if (book.coverImage) {
        const coverImagePublicId = extractPublicId(book.coverImage);
        console.log("pdf file coverImagePublicId id==>", coverImagePublicId);

        await cloudinary.uploader.destroy(coverImagePublicId);
      }
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: coverImageFile.filename,
        folder: "book-covers",
        format: coverImageMineType,
      });

      completeCoverImage = uploadResult.secure_url;
      await fs.promises.unlink(filePath);
    }

    if (files?.file) {
      const file = files.file[0];
      const fileMineType = file.mimetype.split("/").at(-1);
      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads/" + file.filename
      );
      // Delete the previous file from Cloudinary
      if (book.file) {
        const filePublicId = extractPublicId(book.file);
        console.log("pdf file public id==>", filePublicId);

        await cloudinary.uploader.destroy(filePublicId, {
          resource_type: "raw",
        });
      }

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: file.filename,
        folder: "book-pdfs",
        format: fileMineType,
        resource_type: "raw",
      });

      completeFileName = uploadResult.secure_url;
      await fs.promises.unlink(filePath);
    }

    const updatedBook = await bookModel.findByIdAndUpdate(
      { _id: bookId },
      {
        title,
        genre,
        coverImage: completeCoverImage,
        file: completeFileName,
      },
      { new: true }
    );

    return res.status(200).json({
      status: "ok",
      data: updatedBook,
    });
  } catch (error) {
    console.error(error);
    return next(
      createHttpError(500, "An error occurred while updating the book")
    );
  }
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: "ok",
      data: books,
    });
  } catch (error) {
    const Error = createHttpError(500, "Error While getting a books");
    next(Error);
  }
};
const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }
    return res.status(200).json({
      status: "ok",
      data: book,
    });
  } catch (error) {
    const Error = createHttpError(500, "Error While getting a book");
    next(Error);
  }
};

export { createBook, updateBook, listBooks, getSingleBook };
