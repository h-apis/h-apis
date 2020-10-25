import express from 'express';
import HitomiCore from '../../core/hitomi'
import path from 'path';

const app = express();
const hitomiCore = new HitomiCore(path.join(__dirname, '..', '..', '..', 'hitomi'));
const PORT = 3000;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
