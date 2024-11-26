export type GeneImagePropsType = Omit<
  JSX.IntrinsicElements['img'],
  'src' | 'srcSet' | 'ref' | 'width' | 'height' | 'loading'
> & {
  src: string;
  alt: string;
  width?: number | undefined;
  height?: number | undefined;
  className?: string | undefined;
  loading?: 'lazy' | 'eager' | undefined;
  priority?: boolean | undefined;
  quality?: number;
  fill?: boolean | undefined;
};
