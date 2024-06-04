import { useRoutes } from 'react-router-dom';
import { routes } from 'rpress:routes';

/**
 * <Routes>
 *  ...
 * <Routes />
 * @returns
 */
export const Content = () => {
  const routeElement = useRoutes(routes);
  return routeElement;
};
