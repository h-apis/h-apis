import {GALLERY_BLOCK_URL} from '../constants';
import bypassAxios from '../../../common/bypassAxios';
import cheerio from 'cheerio';
import {compact} from 'lodash';
import {HitomiGalleryData} from '../types';
import tagMapper from '../mapper/tagMapper';

const textMapper = (element: cheerio.Element) => {
    return element.firstChild.data;
};

/**
 * [workaround] 이 부분은 사이트의 구조에 굉장히 민감한 코드로, 쉽게 바뀔 수 있다.
 */
function parseGalleryBlock(galleryNumber: number, html: string): HitomiGalleryData {
    const $ = cheerio.load(html);
    const mainDiv = $('div:nth-child(1)');
    const thumbDiv = mainDiv.find('.dj-img-cont');
    const artistsDiv = mainDiv.find('.artist-list');
    const contentsDiv = mainDiv.find('.dj-content table');

    //TODO characters
    const type = contentsDiv.find('td:contains("Type")').parent().find('a').first().text();
    const language = contentsDiv.find('td:contains("Language")').parent().find('a').first().text();
    const titleElement = mainDiv.find('h1 a');
    const title = titleElement.attr('title') || titleElement.first().text() || 'notitle';
    const thumbnail = `https:${thumbDiv.find('div[class*="-img1"] img').attr('src')}`;
    const artists = compact(artistsDiv.find('li a').toArray().map(textMapper));
    const series = compact(
        contentsDiv
            .find('td:contains("Series")').parent()
            .find('td:nth-child(2)')
            .find('li a').toArray().map(textMapper));
    const tags =
        compact(contentsDiv.find('.relatedtags li a').toArray().map(textMapper)).map(tagMapper.fromGallery);

    return {
        id: galleryNumber,
        artists,
        language,
        type,
        series,
        tags,
        thumbnail: {
            imageUrl: thumbnail
        },
        title
    };
}

export default async function getMetadataFromGallery(galleryNumber = 644511) {
    const url = `${GALLERY_BLOCK_URL}/${galleryNumber}.html`;
    const result = await bypassAxios.get<string>(url);
    return parseGalleryBlock(galleryNumber, result.data);
}
