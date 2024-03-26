import express from 'express';
import type { Request, Response } from 'express';

const router = express.Router();

router.get('/check', async (req: Request, res: Response) => {
    res.json({ message: 'OK' });
});


router.get('/update', async (req: Request, res: Response) => {
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




export default router;