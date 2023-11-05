import { render, screen, act, fireEvent } from '@testing-library/react';
import { useEffect, useCallback, useRef } from 'react';
import * as React from 'react';
import useDebouncedCallback from '../src/useDebouncedCallback';
import { describe, it, expect, jest, beforeEach, test } from '@jest/globals';

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  it('will call callback when timeout is called', () => {
    const callback = jest.fn();

    function Component() {
      const debounced = useDebouncedCallback(callback, 1000);
      debounced();
      return null;
    }
    render(<Component />);

    expect(callback.mock.calls.length).toBe(0);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will call leading callback immediately (but only once, as trailing is set to false)', () => {
    const callback = jest.fn();

    function Component() {
      const debounced = useDebouncedCallback(callback, 1000, {
        leading: true,
        trailing: false,
      });
      debounced();
      return null;
    }
    render(<Component />);

    expect(callback.mock.calls.length).toBe(1);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will call leading callback as well as next debounced call', () => {
    const callback = jest.fn();

    function Component() {
      const debounced = useDebouncedCallback(callback, 1000, { leading: true });
      debounced();
      debounced();
      return null;
    }
    render(<Component />);

    expect(callback.mock.calls.length).toBe(1);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(2);
  });

  it('will call three callbacks if no debounced callbacks are pending', () => {
    const callback = jest.fn();

    function Component() {
      const debounced = useDebouncedCallback(callback, 1000, { leading: true });
      debounced();
      debounced();
      setTimeout(() => {
        debounced();
      }, 1001);
      return null;
    }
    render(<Component />);

    expect(callback.mock.calls.length).toBe(1);

    act(() => {
      jest.advanceTimersByTime(1001);
    });

    expect(callback.mock.calls.length).toBe(3);
  });

  it('Subsequent calls to the debounced function `debounced.callback` return the result of the last func invocation.', () => {
    const callback = jest.fn(() => 42);

    let callbackCache;
    function Component() {
      const debounced = useDebouncedCallback(callback, 1000);
      callbackCache = debounced;
      return null;
    }
    render(<Component />);

    const result = callbackCache();
    expect(callback.mock.calls.length).toBe(0);
    expect(result).toBeUndefined();

    act(() => {
      jest.runAllTimers();
    });
    expect(callback.mock.calls.length).toBe(1);
    const subsequentResult = callbackCache();

    expect(callback.mock.calls.length).toBe(1);
    expect(subsequentResult).toBe(42);
  });

  it('will call a second leading callback if no debounced callbacks are pending with trailing false', () => {
    const callback = jest.fn();

    function Component() {
      const debounced = useDebouncedCallback(callback, 1000, {
        leading: true,
        trailing: false,
      });
      debounced();
      setTimeout(() => {
        debounced();
      }, 1001);
      return null;
    }
    render(<Component />);

    expect(callback.mock.calls.length).toBe(1);

    act(() => {
      jest.advanceTimersByTime(1001);
    });

    expect(callback.mock.calls.length).toBe(2);
  });

  it("won't call both on the leading edge and on the trailing edge if leading and trailing are set up to true and function call is only once", () => {
    const callback = jest.fn();

    function Component() {
      // trailing is true by default
      const debounced = useDebouncedCallback(callback, 1000, { leading: true });

      debounced();
      return null;
    }
    render(<Component />);

    expect(callback.mock.calls.length).toBe(1);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will call both on the leading edge and on the trailing edge if leading and trailing are set up to true and there are more than 1 function call', () => {
    const callback = jest.fn();

    function Component() {
      // trailing is true by default
      const debounced = useDebouncedCallback(callback, 1000, { leading: true });
      debounced();
      debounced();
      return null;
    }
    render(<Component />);

    expect(callback.mock.calls.length).toBe(1);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(2);
  });

  test.each`
    options                                              | _0   | _190 | _200 | _210 | _500
    ${{ leading: true, trailing: true }}                 | ${1} | ${1} | ${1} | ${1} | ${2}
    ${{ leading: true, trailing: false }}                | ${1} | ${1} | ${1} | ${1} | ${1}
    ${{ leading: false, trailing: true }}                | ${0} | ${0} | ${0} | ${0} | ${1}
    ${{ leading: false, trailing: false }}               | ${0} | ${0} | ${0} | ${0} | ${0}
    ${{ leading: true, trailing: true, maxWait: 190 }}   | ${1} | ${1} | ${2} | ${2} | ${3}
    ${{ leading: true, trailing: false, maxWait: 190 }}  | ${1} | ${1} | ${1} | ${2} | ${2}
    ${{ leading: false, trailing: true, maxWait: 190 }}  | ${0} | ${0} | ${1} | ${1} | ${2}
    ${{ leading: true, trailing: true, maxWait: 200 }}   | ${1} | ${1} | ${2} | ${2} | ${3}
    ${{ leading: true, trailing: false, maxWait: 200 }}  | ${1} | ${1} | ${1} | ${2} | ${2}
    ${{ leading: false, trailing: true, maxWait: 200 }}  | ${0} | ${0} | ${1} | ${1} | ${2}
    ${{ leading: false, trailing: false, maxWait: 200 }} | ${0} | ${0} | ${0} | ${0} | ${0}
    ${{ leading: true, trailing: true, maxWait: 210 }}   | ${1} | ${1} | ${1} | ${2} | ${3}
    ${{ leading: true, trailing: false, maxWait: 210 }}  | ${1} | ${1} | ${1} | ${1} | ${2}
    ${{ leading: false, trailing: true, maxWait: 210 }}  | ${0} | ${0} | ${0} | ${1} | ${2}
  `('options=$options', ({ options, _0, _190, _200, _210, _500 }) => {
    const callback = jest.fn();

    function Component() {
      // @ts-ignore
      const debounced = useDebouncedCallback(callback, 200, options);

      debounced();
      expect(callback.mock.calls.length).toBe(_0);

      setTimeout(() => {
        expect(callback.mock.calls.length).toBe(_190);
        debounced();
      }, 191);

      setTimeout(() => {
        expect(callback.mock.calls.length).toBe(_200);
        debounced();
      }, 201);

      setTimeout(() => {
        expect(callback.mock.calls.length).toBe(_210);
        debounced();
      }, 211);

      setTimeout(() => {
        expect(callback.mock.calls.length).toBe(_500);
      }, 500);

      return null;
    }
    render(<Component />);

    act(() => {
      jest.runAllTimers();
    });
  });

  it('will call callback only with the latest params', () => {
    const callback = jest.fn((param) => {
      expect(param).toBe('Right param');
    });

    function Component() {
      const debounced = useDebouncedCallback(callback, 1000);
      debounced('Wrong param');
      setTimeout(() => {
        debounced('Right param');
      }, 500);
      return null;
    }
    render(<Component />);

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(callback.mock.calls.length).toBe(0);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will cancel delayed callback when cancel method is called', () => {
    const callback = jest.fn();

    function Component() {
      const debounced = useDebouncedCallback(callback, 1000);
      debounced();
      setTimeout(debounced.cancel, 500);
      return null;
    }
    render(<Component />);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(0);
  });

  it('will change callback function, if params from dependencies has changed', () => {
    function Component({ text }) {
      const debounced = useDebouncedCallback(
        useCallback(
          jest.fn(() => {
            expect(text).toBe('Right param');
          }),
          [text]
        ),
        1000
      );
      return <button role="click" onClick={debounced} />;
    }
    const tree = render(<Component text="Wrong param" />);

    tree.rerender(<Component text="Right param" />);

    act(() => {
      fireEvent.click(screen.getByRole('click'));
    });

    act(() => {
      jest.runAllTimers();
    });
  });

  it("won't change callback function, if params from dependencies hasn't changed", () => {
    function Component({ text }) {
      const debounced = useDebouncedCallback(
        useCallback(
          jest.fn(() => {
            expect(text).toBe('Right param');
          }),
          []
        ),
        1000
      );
      return <button role="click" onClick={debounced} />;
    }
    const tree = render(<Component text="Right param" />);

    tree.rerender(<Component text="Wrong param" />);

    fireEvent.click(screen.getByRole('click'));

    act(() => {
      jest.runAllTimers();
    });
  });

  it('call callback with the latest value if maxWait time exceed', () => {
    const callback = (value) => expect(value).toBe('Right value');

    function Component({ text }) {
      const debounced = useDebouncedCallback(callback, 500, { maxWait: 600 });
      debounced(text);
      return <span>{text}</span>;
    }
    const tree = render(<Component text="Wrong Value" />);

    act(() => {
      jest.advanceTimersByTime(400);
      tree.rerender(<Component text="Right value" />);
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });
  });

  it('will call callback if maxWait time exceed', () => {
    const callback = jest.fn();

    function Component({ text }) {
      const debounced = useDebouncedCallback(callback, 500, { maxWait: 600 });
      debounced();
      return <span role="test">{text}</span>;
    }
    const tree = render(<Component text="one" />);

    expect(callback.mock.calls.length).toBe(0);
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('one');

    act(() => {
      jest.advanceTimersByTime(400);
      tree.rerender(<Component text="test" />);
    });

    expect(callback.mock.calls.length).toBe(0);
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('test');

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will cancel callback if maxWait time exceed and cancel method was invoked', () => {
    const callback = jest.fn();

    function Component({ text }) {
      const debounced = useDebouncedCallback(callback, 500, { maxWait: 600 });
      debounced();
      if (text === 'test') {
        debounced.cancel();
      }
      return <span role="test">{text}</span>;
    }
    const tree = render(<Component text="one" />);

    expect(callback.mock.calls.length).toBe(0);
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('one');

    act(() => {
      jest.advanceTimersByTime(400);
      // @ts-ignore
      expect(screen.getByRole('test')).toHaveTextContent('one');
    });

    expect(callback.mock.calls.length).toBe(0);
    tree.rerender(<Component text="test" />);

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(callback.mock.calls.length).toBe(0);
  });

  it('will call pending callback if callPending function is called', () => {
    const callback = jest.fn();

    function Component({ text }) {
      const debounced = useDebouncedCallback(callback, 500);
      debounced();
      if (text === 'test') {
        debounced.flush();
      }
      return <span role="test">{text}</span>;
    }
    const tree = render(<Component text="one" />);

    expect(callback.mock.calls.length).toBe(0);
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('one');

    act(() => {
      tree.rerender(<Component text="test" />);
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('won\t call pending callback if callPending function is called and there are no items in queue', () => {
    const callback = jest.fn();

    function Component({ text }) {
      const debounced = useDebouncedCallback(callback, 500);
      if (text === 'test') {
        debounced.flush();
      }
      return <span role="test">{text}</span>;
    }
    const tree = render(<Component text="one" />);

    expect(callback.mock.calls.length).toBe(0);
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('one');

    act(() => {
      tree.rerender(<Component text="test" />);
    });

    expect(callback.mock.calls.length).toBe(0);
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('test');
  });

  it('won\t call pending callback if callPending function is called and cancel method is also executed', () => {
    const callback = jest.fn();

    function Component({ text }) {
      const debounced = useDebouncedCallback(callback, 500);
      debounced();
      if (text === 'test') {
        debounced.cancel();
        debounced.flush();
      }
      return <span role="test">{text}</span>;
    }
    const tree = render(<Component text="one" />);

    expect(callback.mock.calls.length).toBe(0);
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('one');

    act(() => {
      tree.rerender(<Component text="test" />);
    });

    expect(callback.mock.calls.length).toBe(0);
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('test');
  });

  it('will call pending callback if callPending function is called on component unmount', () => {
    const callback = jest.fn();

    function Component({ text }) {
      const debounced = useDebouncedCallback(callback, 500);

      debounced();
      useEffect(() => {
        return debounced.flush;
      }, []);
      return <span role="test">{text}</span>;
    }
    const tree = render(<Component text="one" />);

    expect(callback.mock.calls.length).toBe(0);
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('one');

    act(() => {
      tree.unmount();
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will memoize debouncedCallback', () => {
    let debouncedCallbackCached: any = null;

    function Component({ text }) {
      const debounced = useDebouncedCallback(
        useCallback(() => {}, []),
        500
      );

      if (debouncedCallbackCached) {
        expect(debounced).toBe(debouncedCallbackCached);
      }
      debouncedCallbackCached = debounced;

      return <span role="test">{text}</span>;
    }
    const tree = render(<Component text="one" />);

    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('one');

    act(() => {
      tree.rerender(<Component text="two" />);
    });
  });

  it('will change reference to debouncedCallback timeout is changed', () => {
    expect.assertions(3);
    let debouncedCallbackCached: any = null;
    let timeoutCached = null;

    function Component({ text, timeout }) {
      const debounced = useDebouncedCallback(
        useCallback(() => {}, [text]),
        timeout
      );

      if (debouncedCallbackCached) {
        if (timeoutCached === timeout) {
          expect(debounced).toBe(debouncedCallbackCached);
        } else {
          expect(debounced).not.toBe(debouncedCallbackCached);
        }
      }
      debouncedCallbackCached = debounced;
      timeoutCached = timeout;

      return <span role="test">{text}</span>;
    }
    const tree = render(<Component timeout={500} text="one" />);

    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('one');

    act(() => {
      tree.rerender(<Component text="one" timeout={500} />);
    });

    act(() => {
      tree.rerender(<Component text="1000" timeout={1000} />);
    });
  });

  it('will call the latest callback', () => {
    expect.assertions(1);

    function Component({ callback }) {
      const debounced = useDebouncedCallback(callback, 500);
      const counter = useRef(1);

      useEffect(() => {
        // this useEffect should be called only once
        debounced(counter.current);

        counter.current = counter.current + 1;
      }, [debounced]);

      return null;
    }
    const tree = render(
      <Component
        callback={() => {
          throw new Error("This callback shouldn't be executed");
        }}
      />
    );

    act(() => {
      tree.rerender(
        <Component
          callback={(counter) => {
            // This callback should be called with counter === 1
            expect(counter).toBe(1);
          }}
        />
      );
    });

    jest.advanceTimersByTime(500);
  });

  it('will change reference to debouncedCallback if maxWait or delay option is changed', () => {
    expect.assertions(5);
    let debouncedCallbackCached: any = null;
    let cachedObj: any = null;

    function Component({ text, maxWait = 1000, delay = 500 }) {
      const debounced = useDebouncedCallback(
        useCallback(() => {}, []),
        delay,
        { maxWait }
      );

      if (debouncedCallbackCached) {
        if (cachedObj.delay === delay && cachedObj.maxWait === maxWait) {
          expect(debounced).toBe(debouncedCallbackCached);
        } else {
          expect(debounced).not.toBe(debouncedCallbackCached);
        }
      }
      debouncedCallbackCached = debounced;
      cachedObj = { text, maxWait, delay };

      return <span role="test">{text}</span>;
    }
    const tree = render(<Component text="one" />);

    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('one');

    act(() => {
      tree.rerender(<Component text="one" />);
    });

    act(() => {
      tree.rerender(<Component text="two" />);
    });

    act(() => {
      tree.rerender(<Component text="two" delay={1} />);
    });

    act(() => {
      tree.rerender(<Component maxWait={2} text="two" />);
    });
  });

  it('will memoize callPending', () => {
    let callPendingCached: any = null;

    function Component({ text }) {
      const debounced = useDebouncedCallback(
        useCallback(() => {}, []),
        500
      );

      if (callPendingCached) {
        expect(debounced.flush).toBe(callPendingCached);
      }
      callPendingCached = debounced.flush;

      return <span role="test">{text}</span>;
    }
    const tree = render(<Component text="one" />);

    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('one');

    act(() => {
      tree.rerender(<Component text="two" />);
    });
  });

  it('will memoize debounced object', () => {
    let cached: any = null;

    function Component({ text }) {
      const debounced = useDebouncedCallback(
        useCallback(() => {}, []),
        500
      );

      if (cached) {
        expect(debounced).toBe(cached);
      }
      cached = debounced;

      return <span role="test">{text}</span>;
    }
    const tree = render(<Component text="one" />);

    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('one');

    act(() => {
      tree.rerender(<Component text="two" />);
    });
  });

  it('pending indicates whether we have pending callbacks', () => {
    function Component({ text }) {
      const debounced = useDebouncedCallback(
        useCallback(() => {}, []),
        500
      );

      expect(debounced.isPending()).toBeFalsy();
      debounced();
      expect(debounced.isPending()).toBeTruthy();
      debounced.flush();
      expect(debounced.isPending()).toBeFalsy();

      return <span>{text}</span>;
    }
    render(<Component text="one" />);
  });
});
