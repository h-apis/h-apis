/**
 * [workaround]
 *
 * common.js 파일을 그대로 붙여넣는다. reader 에서는 url_from_url_from_hash 함수를 엔트리로 이미지 파일을 가져오기 때문에,
 * 해당 로직을 동작시키는 용도로 사용한다.
 * 히토미측에서 데이터가 변경되면 이곳을 바꿔주어야 한다.
 *
 * - var domain 을 ltn.hitomi.la 로
 * - $(document).ready 로직 삭제
 * - 맨 아래 export function 확인
 *
 * common.js 에서..
 * url_from_url_from_hash -> url_from_url -> subdomain_from_url -> subdomain_from_galleryid
 * @param galleryNumber
 */

var loading_timer;
var domain = 'ltn' + '.hitomi.la';
var galleryblockextension = '.html';
var galleryblockdir = 'galleryblock';
var nozomiextension = '.nozomi';

function subdomain_from_galleryid(g, number_of_frontends) {
    var o = g % number_of_frontends;

    return String.fromCharCode(97 + o);
}

function subdomain_from_url(url, base) {
    var retval = 'b';
    if (base) {
        retval = base;
    }

    var number_of_frontends = 3;
    var b = 16;

    var r = /\/[0-9a-f]\/([0-9a-f]{2})\//;
    var m = r.exec(url);
    if (!m) {
        return 'a';
    }

    var g = parseInt(m[1], b);
    if (!isNaN(g)) {
        if (g < 0x30) {
            number_of_frontends = 2;
        }
        if (g < 0x09) {
            g = 1;
        }
        retval = subdomain_from_galleryid(g, number_of_frontends) + retval;
    }

    return retval;
}

function url_from_url(url, base) {
    return url.replace(/\/\/..?\.hitomi\.la\//, '//'+subdomain_from_url(url, base)+'.hitomi.la/');
}


function full_path_from_hash(hash) {
    if (hash.length < 3) {
        return hash;
    }
    return hash.replace(/^.*(..)(.)$/, '$2/$1/'+hash);
}


function url_from_hash(galleryid, image, dir, ext) {
    ext = ext || dir || image.name.split('.').pop();
    dir = dir || 'images';

    return 'https://a.hitomi.la/'+dir+'/'+full_path_from_hash(image.hash)+'.'+ext;
}

function url_from_url_from_hash(galleryid, image, dir, ext, base) {
    return url_from_url(url_from_hash(galleryid, image, dir, ext), base);
}


function show_loading() {
    return vate_loading(true);
}

function hide_loading() {
    stop_loading_timer();
    return vate_loading(false);
}

function vate_loading(bool) {
    var el = $('#loader-content');
    if (!el) return;

    if (bool) {
        el.show();
    } else {
        el.hide();
    }
}


function start_loading_timer() {
    hide_loading();
    loading_timer = setTimeout(show_loading, 500);
}

function stop_loading_timer() {
    clearTimeout(loading_timer);
}



function scroll_to_top() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}


function localDates() {
    $(".date").each(function() {
        //2007-02-06 20:02:00-06
        //2016-03-27 13:37:33.612-05
        var r = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(?:\.\d+)?([+-]\d{2})/;
        var m = r.exec($(this).html());
        if (!m) {
            return;
        }

        //2007-02-06T20:02:00-06:00
        $(this).html(new Date(m[1]+'-'+m[2]+'-'+m[3]+'T'+m[4]+':'+m[5]+':'+m[6]+m[7]+':00').toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })); //Feb 6, 2007, 8:02 PM
    });
}

//https://stackoverflow.com/a/51332115/272601
function retry(fn, retries, err) {
    retries = typeof retries !== 'undefined' ? retries : 3;
    err = typeof err !== 'undefined' ? err : null;

    if (!retries) {
        return Promise.reject(err);
    }
    return fn().catch(function(err) {
        //console.warn(`retry ${3 - retries}, err ${err}`);
        return retry(fn, (retries - 1), err);
    });
}

///////////////////////////////////////////////////////////////////////////
/**
 *
 * @param galleryNumber{number|string}
 * @param imageData{Object}
 */
module.exports = function getImageUrl(galleryNumber, imageData) {
    return url_from_url_from_hash(galleryNumber, imageData)
}
