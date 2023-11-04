import { render, screen, act } from '@testing-library/react';
import * as React from 'react';
import useDebounce from '../src/useDebounce';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  it('put initialized value in first render', () => {
    function Component() {
      const [value] = useDebounce('Hello world', 1000);
      return <div role="test">{value}</div>;
    }
    render(<Component />);
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello world');
  });

  it('will update value when timer is called', () => {
    function Component({ text }) {
      const [value] = useDebounce(text, 1000);
      return <div role="test">{value}</div>;
    }
    const { rerender } = render(<Component text={'Hello'} />);

    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    rerender(<Component text={'Hello world'} />);

    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      jest.runAllTimers();
    });
    // after runAllTimer text should be updated
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello world');
  });

  it('will update value immediately if leading is set to true', () => {
    function Component({ text }) {
      const [value] = useDebounce(text, 1000, { leading: true });
      return <div role="test">{value}</div>;
    }
    const tree = render(<Component text={'Hello'} />);

    // check inited value
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      tree.rerender(<Component text={'Hello world'} />);
    });

    // value should be set immediately by first leading call
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello world');

    act(() => {
      tree.rerender(<Component text={'Hello again'} />);
    });

    // timeout shouldn't have been called yet after leading call was executed
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello world');

    act(() => {
      jest.runAllTimers();
    });
    // final value should update as per last timeout
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello again');
  });

  it('will cancel value when cancel method is called', () => {
    function Component({ text }) {
      const [value, fn] = useDebounce(text, 1000);
      setTimeout(fn.cancel, 500);
      return <div role="test">{value}</div>;
    }
    const tree = render(<Component text={'Hello'} />);

    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      tree.rerender(<Component text={'Hello again'} />);
    });
    // timeout shouldn't have called yet
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      jest.runAllTimers();
    });
    // after runAllTimer text should not be updated as debounce was cancelled
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');
  });

  it('should apply the latest value', () => {
    function Component({ text }) {
      const [value] = useDebounce(text, 1000);
      return <div role="test">{value}</div>;
    }
    const tree = render(<Component text={'Hello'} />);

    // check inited value
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      // this value shouldn't be applied, as we'll set up another one
      tree.rerender(<Component text="Wrong value" />);
    });
    // timeout shouldn't have called yet
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    tree.rerender(<Component text="Right value" />);

    act(() => {
      jest.runAllTimers();
    });
    // after runAllTimer text should be updated
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Right value');
  });

  it('should cancel maxWait callback', () => {
    function Component({ text }) {
      const [value, fn] = useDebounce(text, 500, { maxWait: 600 });
      if (text === 'Right value') {
        fn.cancel();
      }
      return <div role="test">{value}</div>;
    }
    const tree = render(<Component text={'Hello'} />);

    // check inited value
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      // this value shouldn't be applied, as we'll set up another one
      tree.rerender(<Component text="Wrong value" />);
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    // timeout shouldn't have called yet
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      tree.rerender(<Component text="Right value" />);
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');
  });

  it('should apply the latest value if maxWait timeout is called', () => {
    function Component({ text }) {
      const [value] = useDebounce(text, 500, { maxWait: 600 });
      return <div role="test">{value}</div>;
    }
    const tree = render(<Component text={'Hello'} />);

    // check inited value
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      // this value shouldn't be applied, as we'll set up another one
      tree.rerender(<Component text="Wrong value" />);
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    // timeout shouldn't have been called yet
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      tree.rerender(<Component text="Right value" />);
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });
    // after runAllTimer text should be updated
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Right value');
  });

  it("shouldn't apply the previous value if it was changed to started one", () => {
    function Component({ text }) {
      const [value] = useDebounce(text, 500);
      return <div role="test">{value}</div>;
    }

    const tree = render(<Component text={'Hello'} />);

    act(() => {
      // this value shouldn't be applied, as we'll set up another one
      tree.rerender(<Component text="new value" />);
    });

    // timeout shouldn't have been called yet
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      tree.rerender(<Component text="Hello" />);
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value shouldn't be changed, as we rerender Component with text prop === 'Hello'
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');
  });

  it("shouldn't rerender component for the first time", () => {
    function Component({ text }) {
      const [value] = useDebounce(text, 1000, { maxWait: 500 });
      const rerenderCounter = React.useRef(0);
      rerenderCounter.current += 1;
      return <div role="test">{rerenderCounter.current}</div>;
    }

    const tree = render(<Component text={'Hello'} />);

    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('1');

    act(() => {
      // We wait for the half of maxWait Timeout,
      jest.advanceTimersByTime(250);
    });

    act(() => {
      tree.rerender(<Component text="Test" />);
    });

    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('2');

    act(() => {
      // We wait for the maxWait Timeout,
      jest.advanceTimersByTime(250);
    });

    // If maxWait wasn't started at the first render of the component, we shouldn't receive the new value
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('2');
  });

  it('should use equality function if supplied', () => {
    // Use equality function that always returns true
    const eq = jest.fn((left: string, right: string): boolean => {
      return true;
    });

    function Component({ text }) {
      const [value] = useDebounce(text, 1000, { equalityFn: eq });
      return <div role="test">{value}</div>;
    }

    const tree = render(<Component text={'Hello'} />);

    expect(eq).toHaveBeenCalledTimes(1);

    act(() => {
      tree.rerender(<Component text="Test" />);
    });

    expect(eq).toHaveBeenCalledTimes(2);
    expect(eq).toHaveBeenCalledWith('Hello', 'Test');
    // Since the equality function always returns true, expect the value to stay the same
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');
  });

  it('should setup new value immediately if callPending is called', () => {
    let callPending;
    function Component({ text }) {
      const [value, fn] = useDebounce(text, 1000);
      callPending = fn.flush;

      return <div role="test">{value}</div>;
    }

    const tree = render(<Component text={'Hello'} />);

    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      tree.rerender(<Component text="Test" />);
    });

    // We don't call neither runTimers no callPending.
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      callPending();
    });

    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Test');
  });

  it('should preserve debounced object between re-renders', () => {
    let cachedDebounced: unknown = null;
    function Component({ text }) {
      const [value, debounced] = useDebounce(text, 1000);
      if (cachedDebounced == null) {
        cachedDebounced = debounced;
      } else {
        expect(cachedDebounced).toBe(debounced);
      }
      return <div role="test">{value}</div>;
    }
    const tree = render(<Component text={'Hello'} />);

    // check inited value
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      tree.rerender(<Component text="Hello world" />);
    });
    // timeout shouldn't have called yet
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      jest.runAllTimers();
    });
    // after runAllTimer text should be updated
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello world');
  });

  it('should change debounced.isPending to true as soon as the function is called in a sync way', () => {
    function Component({ text }) {
      const [value, { isPending }] = useDebounce(text, 1000);
      if (value === text) {
        expect(isPending()).toBeFalsy();
      } else {
        expect(isPending()).toBeTruthy();
      }
      return <div role="test">{value}</div>;
    }
    const tree = render(<Component text={'Hello'} />);

    // check inited value
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      tree.rerender(<Component text="Hello world" />);
    });
    // timeout shouldn't have called yet
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello');

    act(() => {
      jest.runAllTimers();
    });
    // after runAllTimer text should be updated
    // @ts-ignore
    expect(screen.getByRole('test')).toHaveTextContent('Hello world');
  });
});
