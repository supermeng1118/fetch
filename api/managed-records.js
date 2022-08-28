import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";
const DefaultLimit = 10;
const DefaultPage = 1;
const DefaultColors = ['brown', 'yellow', 'red', 'blue', 'green'];
const PrimaryColors = ['red', 'blue', 'yellow'];

// Your retrieve function plus any additional functions go here ...
async function retrieve({ page = DefaultPage, colors=[] } = {}) {
    // const params = {
    //     limit,
    //     offset,
    //     color: color.map((obj) => {
    //         return `color[]=${obj}`
    //     })
    // }

    const url = URI(window.path).query({
        limit: DefaultLimit,
        offset: (page - 1) * DefaultLimit,
        color: colors
    }).toString();

    console.log('url', url);

    const response = await fetch(url);
    const data = await response.json();
    const output = {
        previousPage: page === 1 ? null : page - 1,
        nextPage: page * DefaultLimit >= 500 ? null : page + 1,
        ids: data.map((x) => x.id),
        open: data.filter((x) => x.disposition === 'open').map((x) => ({
            ...x,
            isPrimary: PrimaryColors.includes(x.color)
        })),
        closedPrimaryCount: data.filter((x) => x.disposition === 'closed').filter((x) => PrimaryColors.includes(x.color)).length
    };
    
    console.log('output open', output.open);

    return output

    // url.URLSearchParams(params);
}

export default retrieve;
