import app from "./src/app";

const startServer = () => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
startServer(); //calling the function to start the server
