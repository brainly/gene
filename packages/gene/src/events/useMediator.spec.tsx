import * as React from 'react';

import {useMediator} from './useMediator';
import {dispatch} from './dispatchBubbleEvent';
import {render, screen, fireEvent} from '@testing-library/react';

function DummyComponent() {
  function handleClick(e: any) {
    dispatch(e.target, ['ON_CLICK', {foo: 'bar'}]);
  }

  return <a onClick={handleClick}>Click me</a>;
}

function DummyMediator({handler}: any) {
  const ref = React.useRef(null);

  useMediator('ON_CLICK', handler, ref);

  return (
    <div ref={ref}>
      <DummyComponent />
    </div>
  );
}

function HandlerChangeMediatorWrapper({handler}: any) {
  const [answer, setAnswer] = React.useState(42);

  function increment() {
    setAnswer(a => a + 1);
  }

  function modifiedHandler({type, payload}: any) {
    handler({
      type,
      payload: {
        ...payload,
        answer,
      },
    });
  }

  return (
    <>
      <a onClick={increment}>Increment</a>
      <DummyMediator handler={modifiedHandler} />
    </>
  );
}

describe('useMediator()', () => {
  it('mediates events', () => {
    const mockHandler = jest.fn();

    render(<DummyMediator handler={mockHandler} />);

    fireEvent.click(screen.getByText('Click me'));

    expect(mockHandler).toBeCalledTimes(1);
    expect(mockHandler).toBeCalledWith({
      type: 'ON_CLICK',
      payload: {foo: 'bar'},
    });
  });

  it('prevents event propagation', () => {
    const mockHandler = jest.fn();
    const windowSpy = jest.fn();

    render(<DummyMediator handler={mockHandler} />);

    window.addEventListener('ON_CLICK', windowSpy);

    fireEvent.click(screen.getByText('Click me'));

    expect(windowSpy).toBeCalledTimes(0);
  });

  it('respects handler change', () => {
    const mockHandler = jest.fn();

    render(<HandlerChangeMediatorWrapper handler={mockHandler} />);

    fireEvent.click(screen.getByText('Click me'));

    expect(mockHandler).toBeCalledTimes(1);
    expect(mockHandler).toHaveBeenLastCalledWith({
      type: 'ON_CLICK',
      payload: {answer: 42, foo: 'bar'},
    });

    fireEvent.click(screen.getByText('Increment'));
    fireEvent.click(screen.getByText('Click me'));

    expect(mockHandler).toBeCalledTimes(2);
    expect(mockHandler).toHaveBeenLastCalledWith({
      type: 'ON_CLICK',
      payload: {answer: 43, foo: 'bar'},
    });
  });
});
