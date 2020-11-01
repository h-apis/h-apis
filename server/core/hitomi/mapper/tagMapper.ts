import {HitomiReaderTag, HitomiTag} from '../types';

export default {
    fromReader(tagData: HitomiReaderTag): HitomiTag {
        return {
            name: tagData.tag,
            type: tagData.female === '1' ? 'female' : tagData.male === '1' ? 'male' : 'none'
        }
    },
    fromGallery(tagString: string): HitomiTag {
        if (tagString.indexOf('♂') > -1) {
            return {
                name: tagString.replace(' ♂', ''),
                type: 'male'
            }
        } else if (tagString.indexOf('♀') > -1) {
            return {
                name: tagString.replace(' ♀', ''),
                type: 'female'
            }
        } else {
            return {
                name: tagString,
                type: 'none'
            }
        }
    }
}
