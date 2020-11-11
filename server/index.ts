import express from 'express';
import path from 'path';
import router from './routes';

const PUBLIC_PATH = path.join(__dirname, '..', 'public');
const PORT = 3000;

const app = express();

app.use('/public', express.static(PUBLIC_PATH));
app.use('/api', router);
app.get('/*', (req, res) => {
    res.sendFile(path.join(PUBLIC_PATH, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listen on PORT:${PORT}`);
});
