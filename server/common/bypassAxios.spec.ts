import bypassAxios from './bypassAxios';
import axios from 'axios';
import {assert} from 'chai';

const BANNED_HOST = 'https://hitomi.la';

describe('bypassAxios', () => {
    it('정상동작 테스트', async () => {
        const result = await bypassAxios.get(BANNED_HOST);

        assert.equal(result.status, 200);
    });

    it('원래의 라이브러리 사용시 동작불가능', async () => {
        try {
            await axios.get(BANNED_HOST);
            assert.fail('성공하면 안되는데');
        } catch (e) {
            assert.equal(e.code, 'ECONNRESET');
        }
    })
});
