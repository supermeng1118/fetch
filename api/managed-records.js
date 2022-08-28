import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";
const DefaultLimit = 10;
const DefaultPage = 1;
const DefaultColors = ['brown', 'yellow', 'red', 'blue', 'green'];
const PrimaryColors = ['red', 'blue', 'yellow'];

// Your retrieve function plus any additional functions go here ...
async function retrieve({ page = DefaultPage, colors = DefaultColors } = {}) {
    const url = URI(window.path).query({
        limit: DefaultLimit,
        offset: (page - 1) * DefaultLimit,
        'color[]': colors
    }).toString();

    const response = await fetch(url).then((res) => {
        if (res.status >= 400 && res.status < 600) {
          throw new Error("Bad response from server");
        }
        return res;
    }).catch((error) => {
      console.log(error);
    });

    if (!response) {
        return null;
    }

    const data = await response.json();
    const output = {
        previousPage: page === 1 ? null : page - 1,
        nextPage: page * DefaultLimit < 500 && data.length > 0 ? page + 1 : null,
        ids: data.map((x) => x.id),
        open: data.filter((x) => x.disposition === 'open').map((x) => ({
            ...x,
            isPrimary: PrimaryColors.includes(x.color)
        })),
        closedPrimaryCount: data.filter((x) => x.disposition === 'closed').filter((x) => PrimaryColors.includes(x.color)).length
    };
    
    return output
}

export default retrieve;
