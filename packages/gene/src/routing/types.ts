import type { Observable } from 'zen-observable-ts';

export interface NavigateOptions {
  /**
   * @description
   * Says whether scroll to top after navigation
   * @default
   * true
   */
  scroll: boolean;
  /**
   * @description
   * Says whether prevent to run server function again,
   * i.e getServerSideProps in next.js applications
   * @default
   * false
   */
  shallow: boolean;
  /**
   * @description
   * Says whether mask the url
   * @default
   * undefined
   */
  as?: string;
}

export interface UrlObject {
  pathname: string;
  query?: Record<string, string | number>;
}

export interface RouterEvent {
  type: 'routeChangeStart' | 'routeChangeComplete' | 'routeChangeError';
  payload: {
    path: string;
    options?: NavigateOptions;
  };
}

export interface Router {
  pathname: string | undefined;
  query: Record<string, string>;
  basePath: string | undefined;
  asPath: string;
  navigate: (path: string | UrlObject, options?: NavigateOptions) => void;
  replace: (path: string | UrlObject, options?: NavigateOptions) => void;
  assign: (url: string) => void;
  reload: () => void;
  openInNewTab: (path: string) => void;
  generate: (route: string) => string;
  $routeChanged: Observable<RouterEvent>;
  back: () => void;
}

export interface RouterAppContextType {
  originUrl?: URL;
}
