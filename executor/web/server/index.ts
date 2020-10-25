import express from 'express';
import HitomiCore from '../../../src/core/hitomi'
import path from 'path';

const PUBLIC_PATH = path.join(__dirname, '..', 'public');
const HITOMI_TARGET_PATH = path.join(__dirname, '..', '..', '..', 'hitomi');
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
})


app.listen(PORT, () => {
    console.log(`Server listen on PORT:${PORT}`);
});
