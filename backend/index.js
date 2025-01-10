import express from "express";
import { PORT, mongoURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    console.log(req); // Log the request object
    return res.status(234).send("Welcome to MERN stack tutorial"); // Use `res` instead of `response`
});

app.get('/books', async (request, response) => {
    try {
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books
        })
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: "error.message" });
    }
});

app.get('/books/:id', async (request, response) => {
    try {

        const { id } = request.params;

        const book = await Book.findById(id);

        return response.status(200).json(book)
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: "error.message" });
    }
});

app.put('/books/:id', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({ message: "Please provide all fields" });
        }

        const { id } = request.params;

        const result = await Book.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).json({ message: 'Book not found' })
        } 
        
        return response.status(200).json({ message: "Book updated successfully", result: result });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

app.post('/books', async(request, response) => {
    try{
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        } 
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };

        const book = await Book.create(newBook);
        return response.status(201).send({ message: 'Book created successfully', book });


    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

app.delete('/books/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        } 

        return response.status(200).send({ message: 'Book deleted successfully' });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

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

