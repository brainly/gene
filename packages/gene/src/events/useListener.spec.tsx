import React from 'react';

import {dispatch} from './dispatchBubbleEvent';
import {render, screen, fireEvent} from '@testing-library/react';
import {useListener} from './useListener';

function DummyComponent() {
  function handleClick(e: any) {
    dispatch(e.target, ['ON_CLICK', {foo: 'bar'}]);
  }

  return <a onClick={handleClick}>Click me</a>;
}

function DummyListener({handler}: any) {
  const ref = React.useRef(null);

  useListener('ON_CLICK', handler, ref);

  return (
    <div ref={ref}>
      <DummyComponent />
    </div>
  );
}

function HandlerChangeListenerWrapper({handler}: any) {
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
      <DummyListener handler={modifiedHandler} />
    </>
  );
}

describe('useMediator()', () => {
  it('listens to events', () => {
    const mockHandler = jest.fn();

    render(<DummyListener handler={mockHandler} />);

    fireEvent.click(screen.getByText('Click me'));

    expect(mockHandler).toBeCalledTimes(1);
    expect(mockHandler).toBeCalledWith({
      type: 'ON_CLICK',
      payload: {foo: 'bar'},
    });
  });

  it('does not prevent event propagation', () => {
    const mockHandler = jest.fn();
    const windowSpy = jest.fn();

    render(<DummyListener handler={mockHandler} />);

    window.addEventListener('ON_CLICK', windowSpy);

    fireEvent.click(screen.getByText('Click me'));

    expect(windowSpy).toBeCalledTimes(1);
  });

  it('respects handler change', () => {
    const mockHandler = jest.fn();

    render(<HandlerChangeListenerWrapper handler={mockHandler} />);

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
