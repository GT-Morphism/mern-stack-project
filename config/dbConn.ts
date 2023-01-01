import { connect, set } from "mongoose";

set("strictQuery", false);

const connectDB = async () => {
  try {
    // @ts-ignore
    await connect(process.env.DATABASE_URI);
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;
