import styles from './index.module.scss';
// 逻辑部分待补充
import { toggle } from '../../logic/toggleAppearance';
import { ReactNode } from 'react';

interface SwitchProps {
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  id?: string;
}

export function Switch(props: SwitchProps) {
  return (
    <button
      className={`${styles.switch} ${props.className ? props.className : ''}`}
      id={props.id ?? ''}
      type="button"
      role="switch"
      {...(props.onClick ? { onClick: props.onClick } : {})}
    >
      <span className={styles.check}>
        <span className={styles.icon}>{props.children}</span>
      </span>
    </button>
  );
}

/**
 * 主题切换
 * @returns
 */
export function SwitchAppearance() {
  return (
    <Switch onClick={toggle}>
      <div className={styles.sun}>
        {/* <div className="i-carbon-sun" w="full" h="full"></div> */}
        <div className="i-line-md:moon-filled-to-sunny-filled-loop-transition w-full h-full"></div>
      </div>
      <div className={styles.moon}>
        {/* <div className="i-carbon-moon" w="full" h="full"></div> */}
        <div className="i-line-md:sunny-filled-loop-to-moon-alt-filled-loop-transition w-full h-full"></div>
      </div>
    </Switch>
  );
}
