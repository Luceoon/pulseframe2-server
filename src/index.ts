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
app.use(cors());
app.use(express.json());

// Serve static files from the 'files' folder
app.use('/files', express.static('data/files'));
app.use(router);


app.get('/update', (req, res) => {

    res.json({
        id: 1,
        anim: [
        {
            file: "led_matrices_blobbo.gif",
            loop: true,
            duration: 5000
        },
        {
            file: "led_matrices_sine_tube.gif",
            loop: true,
            duration: 10000
        },
    ]});
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});