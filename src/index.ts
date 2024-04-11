import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import router from './router';

dotenv.config();

if (!process.env.PORT) {
    console.log(`PORT must to be set!`);
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);


const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'files' folder
app.use('/files', express.static('data/files'));
app.use(router);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});