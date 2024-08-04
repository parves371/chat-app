import mongoose from "mongoose";

const connectDB = (url) => {
  mongoose
    .connect(url, { dbName: "talk-wave" })
    .then((data) =>
      console.log(`Connected to MongoDB at ${data.connection.host}`)
    )
    .catch((err) => {
      throw err;
    });
};

const disconnectDB = () => {
  mongoose.connection.close();
};

export { connectDB };
