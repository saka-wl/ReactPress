import styles from './index.module.scss';

import { memo } from 'react';

export interface HitProps {
  fileName: string;
  fileRoute: string;
  zipCode: string;
  key: string;
}

function Hit({ fileName, fileRoute, zipCode }: HitProps) {
  return (
    <a href={fileRoute}>
      <div
        className={
          styles.hit +
          ' h-65px w-510px ml-20px mt-8px mb-8px rounded-lg bg-#f3f4f6 dark-bg-#1e293b hover:bg-#646cff transition duration-300 cursor-pointer text-gray-400 hover:text-black dark:hover:text-white'
        }
      >
        <div className="h-25px w-480px flex pl-10px">
          <div className="w-200px overflow-hidden">{fileName}</div>
          <div className="w-200px overflow-hidden">{fileRoute}</div>
        </div>
        <div
          className="h-25px w-480px overflow-hidden pl-10px"
          dangerouslySetInnerHTML={{ __html: zipCode }}
        ></div>
      </div>
    </a>
  );
}

export default memo(Hit);
