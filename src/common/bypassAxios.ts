import axios from 'axios';
import tls from 'tls';
import https from 'https';

const agent = new https.Agent({
    rejectUnauthorized: true,
    // @ts-ignore
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    },
});

// @ts-ignore
agent.createConnection = function (options, callback) {
    options.servername = undefined;
    return tls.connect(options, callback);
};

export default axios.create({ httpsAgent: agent });
