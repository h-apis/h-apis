import HitomiCore from './index';
import path from 'path';
import fse from 'fs-extra';
import { assert } from 'chai';

describe('hitomi core', function () {
    const dummyTargetDirectory = path.join(__dirname, '..', '..', '..', 'test');
    const hitomiCore = new HitomiCore(dummyTargetDirectory)

    it('download document', async function () {
        this.timeout(30000);
        try {
            await hitomiCore.download(644511);
        } catch (e) {
            assert.fail(e);
        }
    });

    after(() => {
        fse.removeSync(dummyTargetDirectory);
    });
})
