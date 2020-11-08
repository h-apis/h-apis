import express from 'express';
import HitomiCore from './core/hitomi'
import path from 'path';
import {FETCH_DATA_COUNT} from './core/hitomi/constants';

const PUBLIC_PATH = path.join(__dirname, '..', 'public');
const HITOMI_TARGET_PATH = path.join(__dirname, '..', 'downloads', 'hitomi');
const PORT = 3000;

const app = express();
const hitomiCore = new HitomiCore(HITOMI_TARGET_PATH);

app.use('/public', express.static(PUBLIC_PATH));
app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC_PATH, 'index.html'));
});
app.get('/download', async (req, res) => {
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

app.get('/inquiry', async (req, res) => {
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

app.get('/get', async (req, res) => {
    console.log(req.query);
    const fetchedDataList = await hitomiCore.fetchData(req.query);
    res.json({
        list: fetchedDataList,
        hasMore: fetchedDataList.length === FETCH_DATA_COUNT
    });
});

app.get('/:galleryNumber/thumbnail', async (req, res) => {
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


app.listen(PORT, () => {
    console.log(`Server listen on PORT:${PORT}`);
});
