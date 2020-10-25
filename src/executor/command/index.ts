import HitomiCore from '../../core/hitomi';
import path from 'path';
import inquirer, {Question} from 'inquirer';

const hitomiCore = new HitomiCore(path.join(__dirname, '..', '..', '..', 'hitomi'));

const galleryNumberQuestion: Question = {
    name: 'galleryNumber',
    message: 'input galleryNumber',
    type: 'number',
    default: 644511,
}

inquirer.prompt([galleryNumberQuestion]).then(async (value) => {
    const {galleryNumber} = value;
    console.log(`download ${galleryNumber} from hitomi..`);
    try {
        await hitomiCore.download(galleryNumber);
        console.log('download complete');
    } catch (e) {
        console.warn('download failed. sorry :)');
        console.error(e);
    }
})
