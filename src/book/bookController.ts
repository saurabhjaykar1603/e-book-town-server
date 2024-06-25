import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  res.json({});
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  console.log("hi");

  const coverImageFileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    coverImageFileName
  );
  const coverImageMineType = files.coverImage[0].mimetype.split("/").at(-1);

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
    console.log("upload book pdf result", uploadBookPdfFileResult);
    console.log("upload result", uploadResult);
  } catch (error) {
    const err = createHttpError(500, "Error while uploading file");
    return next(err);
  }
};

export { createBook };
