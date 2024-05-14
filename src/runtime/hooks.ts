import { createContext, useContext } from 'react';
import { PageData } from 'shared/types';

export const DataContext = createContext({} as PageData);

export const usePageData = (): PageData => {
  return useContext(DataContext);
};
