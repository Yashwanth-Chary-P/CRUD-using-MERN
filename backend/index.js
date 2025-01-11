import express from "express";
import { PORT, mongoURL } from "./config.js";
import mongoose from "mongoose";
import booksRoute from "./routes/booksRoute.js";
import cors from "cors";

const app = express();

app.use(express.json());

// Middleware for handling CORS POLICY
// Option 1: Allow All Origins with Default of cors(*)
app.use(cors());
// Option 2: Allow Custom Origins
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//   })
// );

app.use('/books', booksRoute);

mongoose
    .connect(mongoURL)
    .then(() => {
        console.log('App connected to MongoDB');

        app.listen(PORT , () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        })

    })
    .catch((error) => {
        console.log(error)
    })

