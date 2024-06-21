import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

const startServer = async () => {
  await connectDB(); // connect database
  const port = config.port || 5000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
startServer(); //calling the function to start the server
