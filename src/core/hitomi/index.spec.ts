import HitomiCore from './index';
import path from 'path';
import { assert } from 'chai';

describe('hitomi core', function () {
    const hitomiCore = new HitomiCore(path.join(__dirname, '..', '..', '..', 'test'))

    it('download document', async function () {
        try {
            await hitomiCore.download(644511);
        } catch (e) {
            assert.fail(e);
        }
    });
})
