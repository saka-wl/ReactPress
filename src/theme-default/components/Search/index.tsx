import { useState, useRef } from 'react';
import Hit, { HitProps } from './Hit';
import styles from './index.module.scss';
import { Iprops, fetchValue } from './request';

export function Search(props: Iprops) {
  const [isHitsShow, setIsHitsShow] = useState(false);
  const [value, setValue] = useState('');
  // const [timer, setTimer] = useState(null);
  const timer = useRef(null);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const HitBox = (
    <div
      className={
        styles.hitBgColor +
        ' fixed top-56px left-0px h-full w-full flex justify-center'
      }
      onClick={(e) => {
        setIsHitsShow(false);
      }}
    >
      <div
        className={
          styles.scrollBox +
          ' absolute w-550px max-h-400px min-h-50px rounded-lg overflow-y-scroll z-1000 bg-white mt-100px dark:bg-#0f172a'
        }
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {isLoading ? (
          <div className="i-line-md:loading-loop w-32px h-32px dark-text-white text-black"></div>
        ) : (
          list.map((it: HitProps) => (
            <Hit
              fileName={it.fileName}
              fileRoute={it.fileRoute}
              zipCode={it.zipCode}
              key={it.key}
            />
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        className={
          styles.box + ' rounded-lg flex w-152px h-40px transition duration-300'
        }
        style={{ backgroundColor: 'var(--rpress-searchBox-bg)' }}
      >
        <div
          className="i-line-md:search w-19px h-19px transition duration-300 ml-5px mr-5px self-center"
          style={{ color: 'var(--rpress-searchBox-icon)' }}
        ></div>
        {/* <div
          className="i-carbon:search-advanced w-20px h-20px transition duration-300 mt--5px ml-5px mr-5px self-center"
          style={{ color: 'var(--rpress-searchBox-icon)' }}
        ></div> */}
        <input
          type="text"
          placeholder="Search"
          className="text-lg w-100px"
          value={value}
          onInput={(e) => {
            setValue(e.target.value);
            !isHitsShow && setIsHitsShow(true);
            if (timer.current) clearTimeout(timer.current);
            const tmp = setTimeout(() => {
              !isLoading && setIsLoading(true);
              fetchValue(
                e.target.value,
                props.algoliasearchUrl,
                setList,
                () => {
                  setIsLoading(false);
                }
              );
            }, 400);
            timer.current = tmp;
          }}
          onClick={() => {
            !isHitsShow && setIsHitsShow(true);
          }}
        />

        {isHitsShow ? HitBox : ''}
      </div>
    </>
  );
}
