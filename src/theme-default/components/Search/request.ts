export interface Iprops {
  algoliasearchUrl: string;
  __rpress: any;
}

export interface IsearchFetchDataApi {
  fileName: string;
  fileRoute: string;
  zip_code: string;
  objectID: string;
}

export interface IsearchFetchApi {
  code: number;
  data: Array<IsearchFetchDataApi> | null;
  msg: string | null;
}

let controller = new AbortController();

const fetchApi = async (url: string, val: string): Promise<IsearchFetchApi> => {
  const resp = await fetch(url + `?searchQuery=${val}`, {
    method: 'get',
    signal: controller.signal,
    // body: JSON.stringify({
    //   searchQuery: val
    // }),
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return resp.json();
};

export const fetchValue = (val: string, url: string, setList, cb) => {
  controller && controller.abort();
  controller = new AbortController();
  return fetchApi(url, val)
    .then(({ code, data }) => {
      if (code === 201) return;
      if (code === 500) return;
      if (code === 200) {
        setList(
          data.map((it) => ({
            fileName: it.fileName,
            fileRoute: it.fileRoute,
            zipCode: it.zip_code.replaceAll(
              `${val}`,
              `<span style='color: var(--rpress-c-blue-lighter);font-weight: bold;'>${val}</span>`
            ),
            key: it.objectID
          }))
        );
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      cb();
    });
};
