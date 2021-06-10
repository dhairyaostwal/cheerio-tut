const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs')
const json2csv = require('json2csv').Parser;


const movies = ['https://www.imdb.com/title/tt0242519/', 'https://www.imdb.com/title/tt1187043/?ref_=ttls_li_tt', 'https://www.imdb.com/title/tt6484982/?ref_=ttls_li_tt', 'https://www.imdb.com/title/tt4832640/?ref_=ttls_li_tt', 'https://www.imdb.com/title/tt5764096/?ref_=ttls_li_tt'];
(async () => {
    let imdbData = []

    for (let movie of movies) {
        const response = await request({
            uri: movie,
            headers: {
                "accept": "image / avif, image/ webp, image/ apng, image / svg + xml, image/*,*/ *; q = 0.8",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-GB, en-US; q = 0.9, en; q = 0.8"
            },
            gzip: true,
        });

        let $ = cheerio.load(response)
        let title = $('div[class="title_wrapper"]> h1').text().trim()
        let rating = $('div[class="ratingValue"]>strong>span').text()
        let summary = $('div[class="summary_text"]').text().trim()
        let releaseDate = $('a[title="See more release dates"]').text().trim()

        imdbData.push({
            title, releaseDate, rating, summary
        });
    }

    const j2cp = new json2csv();
    const csv = j2cp.parse(imdbData);

    fs.writeFileSync("./imdb.csv", csv, "utf-8");
}

)();