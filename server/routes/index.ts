import {Router} from 'express';
import HitomiCore from '../core/hitomi';
import path from 'path';
import {FETCH_DATA_COUNT} from '../core/hitomi/constants';

const HITOMI_TARGET_PATH = path.join(__dirname, '..', '..', 'downloads', 'hitomi');
const hitomiCore = new HitomiCore(HITOMI_TARGET_PATH);

const router = Router();

router.get('/list', async (req, res) => {
    console.log(req.query);
    const fetchedDataList = await hitomiCore.fetchData(req.query);
    res.json({
        list: fetchedDataList,
        hasMore: fetchedDataList.length === FETCH_DATA_COUNT
    });
});

router.get('/download', async (req, res) => {
    try {
        const {id} = req.query

        if (!id) {
            return res.status(400).send('parameter insufficient');
        }

        await hitomiCore.download(parseInt(id as string));
        res.sendStatus(200);
    } catch (e) {
        res.status(500).send('앙 에러띠');
    }
});

router.get('/inquiry', async (req, res) => {
    try {
        const {id} = req.query;
        const galleryNumber = parseInt(id as string);
        if (!galleryNumber) {
            return res.status(400).send('parameter insufficient');
        }
        res.json(await hitomiCore.inquiryDataFrom(galleryNumber));
    } catch (e) {
        if (e?.response?.status) {
            const status = e.response.status;
            if (status === 404) {
                res.status(200).json(undefined);
            } else {
                res.sendStatus(e.response.status);
            }
        } else {
            console.error(e);
            res.sendStatus(500);
        }
    }
});

router.get('/item/:galleryNumber/thumbnail', async (req, res) => {
    const {galleryNumber} = req.params;
    const id = parseInt(galleryNumber);
    if (id) {
        const readStream = await hitomiCore.getThumbnailImage(id);
        if (readStream) {
            // cache store on browser on 1 year
            res.set('Cache-Control', 'public, max-age=31557600');
            readStream.pipe(res);
        } else {
            res.sendStatus(500).send('Server Error');
        }
    } else {
        res.sendStatus(400).send('GalleryNumber Required');
    }
});

router.get('/item/:galleryNumber/image/:index', async (req, res) => {
    const {galleryNumber, index} = req.params;
    const id = parseInt(galleryNumber);
    const numberIndex = parseInt(index);

    const readStream = await hitomiCore.getImage(id, numberIndex);
    if (readStream) {
        res.set('Cache-Control', 'public, max-age=31557600');
        readStream.pipe(res);
    } else {
        res.sendStatus(404);
    }
});

export default router;
