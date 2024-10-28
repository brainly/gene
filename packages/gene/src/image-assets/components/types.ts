export type GeneImagePropsType =  Omit<JSX.IntrinsicElements['img'], 'src' | 'srcSet' | 'ref' | 'width' | 'height' | 'loading'> & {
  src: string;
  alt: string;
  width?: (number | string) | undefined;
  height?: (number | string) | undefined;
  className?: string | undefined;
  loading?: 'lazy' | 'eager' | undefined;
  priority?: boolean | undefined;
  quality?: number | string;
  fill?: boolean | undefined;
};
