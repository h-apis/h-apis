import {GALLERY_BLOCK_URL} from '../constants';
import bypassAxios from '../../../common/bypassAxios';
import cheerio from 'cheerio';

type HitomiGalleryMetadata = {
    galleryNumber: string;
    tags: string[];
    language: string;
    title: string;
    artists: string[];
    type: string;
    series: string[]
    urls: {
        href: string;
        reader: string;
        thumbnail: string;
    }
}

const textMapper = (_: number, element: cheerio.Element) => element.firstChild.data;

/**
 * [workaround] 이 부분은 사이트의 구조에 굉장히 민감한 코드로, 쉽게 바뀔 수 있다.
 */
function parseGalleryBlock(galleryNumber: number, html: string) {
    const $ = cheerio.load(html);
    const mainDiv = $('div:nth-child(1)');
    const thumbDiv = mainDiv.find('.dj-img-cont');
    const artistsDiv = mainDiv.find('.artist-list');
    const contentsDiv = mainDiv.find('.dj-content table');

    //TODO characters
    const type = contentsDiv.find('td:contains("Type")').parent().find('a').first().text();
    const language = contentsDiv.find('td:contains("Language")').parent().find('a').first().text();
    const title = mainDiv.find('h1 a').attr('title')
    const href = `https://hitomi.la${mainDiv.find('a:nth-child(1)').attr('href')}`;
    const thumbnail = `https:${thumbDiv.find('.dj-img1 img').attr('src')}`;
    const artists = artistsDiv.find('li a').map(textMapper).toArray()
    const series = contentsDiv.find('td:contains("Series")').parent().find('td:nth-child(2)').find('li a').map(textMapper).toArray();
    const tags = contentsDiv.find('.relatedtags li a').map(textMapper).toArray();

    return {
        galleryNumber, tags, language, title, artists, type, series,
        urls: {
            href,
            reader: `https://hitomi.la/reader/${galleryNumber}.html`,
            thumbnail
        }
    };
}

export default async function getMetadataFromGallery(galleryNumber = 644511) {
    const url = `${GALLERY_BLOCK_URL}/${galleryNumber}.html`;
    const result = await bypassAxios.get<string>(url);
    return parseGalleryBlock(galleryNumber, result.data);
}
