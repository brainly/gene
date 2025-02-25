import { interfaces } from 'inversify';
import { Provider } from './react.ioc';

export function withIoc<Props extends Record<string, any>>(
  getContainer: (props?: Props) => interfaces.Container
) {
  return (Page: React.ComponentType<Props>) => {
    return (props: Props) => {
      const container = getContainer(props);

      return (
        <Provider container={container}>
          <Page {...props} />
        </Provider>
      );
    };
  };
}
