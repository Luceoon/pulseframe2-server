import express from 'express';
import upload from './upload';
import type { UploadRequest } from './upload';
import type { Request, Response } from 'express';
import type { Anim, AnimData } from './model';
import * as service from './service';
import { stat } from 'fs';

const router = express.Router();

export default router;

interface AnimExport{
    filename: string;
    loop: boolean;
    duration: number;
}

router.get('/api/check', async (req: Request, res: Response) => {
    const checksum = await service.getChecksum();

    if (checksum.err.code != 200) {
        res.status(checksum.err.code).json(checksum.err);
        return;
    }


    res.json({
        status: 'OK',
        checksum: checksum.result
    });
});

router.get('/api/validate', async (req: Request, res: Response) => {

    const name = req.query.name as string;

    const result = await service.validate(name);

    res.status(200).json({
        status: 'OK',
        valid: result
    });
});


router.get('/api/update', async (req: Request, res: Response) => {

    let playlist = await service.getPlaylist();
    if (playlist.err.code != 200) {
        res.status(playlist.err.code).json(playlist.err);
        return;
    }

    let anims = Array<AnimExport>();

    if (playlist.result == null)
        return;

    for (let anim of playlist.result) {

        anims.push({
            filename: anim.filename,
            loop: anim.loop,
            duration: anim.duration
        });
    }

    res.status(200).json({
        status: 'OK',
        checksum: 1,
        anim: anims
    });
});

/// Get all anims
router.get('/api/anim', async (req: Request, res: Response) => {
    let anims = await service.getAllAnims();
    if (anims.err.code != 200) {
        res.status(anims.err.code).json(anims.err);
        return;
    }

    res.status(200).json(anims.result);
});

router.get('/api/anim/:id', async (req: Request, res: Response) => {
    let id = parseInt(req.params.id);
    let anim = await service.getAnim(id);
    if (anim.err.code != 200) {
        res.status(anim.err.code).json(anim.err);
        return;
    }

    res.status(200).json(anim.result);
});

router.post('/api/anim', upload.single('file'), async (req: Request, res: Response) => {
    
    console.log("Request body:", req.body);
    const filename = (req as UploadRequest).filename;
    const name = req.body.name;

    await service.createAnim({name: name, filename: filename, active: true, duration: 10, loop: true});

    res.status(200).json({
        status: 'OK'
    });
});

router.delete('/api/anim/:id', async (req: Request, res: Response) => {

    const result = await service.deleteAnim(parseInt(req.params.id));

    if (result.err.code != 200) {
        res.status(result.err.code).json(result.err);
    }
    else {
        res.status(200).json(result.result);
    }
});


router.put('/api/anim/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const data = req.body as AnimData;

    const result = await service.updateAnim(id, data);

    if (result.err.code != 200) {
        res.status(result.err.code).json(result.err);
    }
    else {
        res.status(200).json(result.result);
    }
    
});

