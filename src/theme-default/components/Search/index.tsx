import { useState } from 'react';
import Hit, { HitProps } from './Hit';
import styles from './index.module.scss';

let controller = new AbortController();

export default function Search() {
  const [isHitsShow, setIsHitsShow] = useState(false);
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(null);
  const [list, setList] = useState([]);

  const fetchValue = (val: string) => {
    controller && controller.abort();
    controller = new AbortController();
    return fetch('http://127.0.0.1:5008/searchFile', {
      method: 'post',
      signal: controller.signal,
      body: JSON.stringify({
        searchQuery: val
      }),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
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
      });
  };

  return (
    <>
      <div
        className={
          styles.box +
          ' rounded-lg flex w-152px h-40px relative transition duration-300'
        }
        style={{ backgroundColor: 'var(--rpress-searchBox-bg)' }}
      >
        <div
          className="i-carbon:search-advanced w-20px h-20px transition duration-300 mt--5px ml-5px mr-5px self-center"
          style={{ color: 'var(--rpress-searchBox-icon)' }}
        ></div>
        <input
          type="text"
          placeholder="Search"
          className="text-lg w-100px"
          value={value}
          onInput={(e) => {
            setValue(e.target.value);
            !isHitsShow && setIsHitsShow(true);
            if (timer) clearTimeout(timer);
            const tmp = setTimeout(() => {
              fetchValue(e.target.value);
            }, 400);
            setTimer(tmp);
          }}
          onClick={() => {
            !isHitsShow && setIsHitsShow(true);
          }}
        />
        {isHitsShow ? (
          <div
            className={
              styles.scrollBox +
              ' absolute top-40px left--204px w-570px max-h-700px rounded-lg overflow-y-scroll'
            }
            style={{ backgroundColor: 'var(--rpress-searchBox-bg)' }}
          >
            <div
              className="i-carbon:close-outline w-23px h-23px transition duration-300 ml-530px mt-10px cursor-pointer"
              style={{ color: 'var(--rpress-searchBox-icon)' }}
              onClick={() => setIsHitsShow(false)}
            ></div>
            {list.map((it: HitProps) => (
              <Hit
                fileName={it.fileName}
                fileRoute={it.fileRoute}
                zipCode={it.zipCode}
                key={it.key}
              />
            ))}
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
