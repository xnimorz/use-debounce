import * as Enzyme from 'enzyme';
import * as React from 'react';
import useDebounce from '../src/useDebounce';
import { act } from 'react-dom/test-utils';

jest.useFakeTimers('modern');

describe('useDebounce', () => {
  it('put initialized value in first render', () => {
    function Component() {
      const [value] = useDebounce('Hello world', 1000);
      return <div>{value}</div>;
    }
    const tree = Enzyme.mount(<Component />);
    expect(tree.text()).toBe('Hello world');
  });

  it('will update value when timer is called', () => {
    function Component({ text }) {
      const [value] = useDebounce(text, 1000);
      return <div>{value}</div>;
    }
    const tree = Enzyme.mount(<Component text={'Hello'} />);

    // check inited value
    expect(tree.text()).toBe('Hello');

    act(() => {
      tree.setProps({ text: 'Hello world' });
    });
    // timeout shouldn't have called yet
    expect(tree.text()).toBe('Hello');

    act(() => {
      jest.runAllTimers();
    });
    // after runAllTimer text should be updated
    expect(tree.text()).toBe('Hello world');
  });

  it('will update value immediately if leading is set to true', () => {
    function Component({ text }) {
      const [value] = useDebounce(text, 1000, { leading: true });
      return <div>{value}</div>;
    }
    const tree = Enzyme.mount(<Component text={'Hello'} />);

    // check inited value
    expect(tree.text()).toBe('Hello');

    act(() => {
      tree.setProps({ text: 'Hello world' });
    });

    // value should be set immediately by first leading call
    expect(tree.text()).toBe('Hello world');

    act(() => {
      tree.setProps({ text: 'Hello again, world' });
    });

    // timeout shouldn't have been called yet after leading call was executed
    expect(tree.text()).toBe('Hello world');

    act(() => {
      jest.runAllTimers();
    });
    // final value should update as per last timeout
    expect(tree.text()).toBe('Hello again, world');
  });

  it('will cancel value when cancel method is called', () => {
    function Component({ text }) {
      const [value, fn] = useDebounce(text, 1000);
      setTimeout(fn.cancel, 500);
      return <div>{value}</div>;
    }
    const tree = Enzyme.mount(<Component text={'Hello'} />);

    // check inited value
    expect(tree.text()).toBe('Hello');

    act(() => {
      tree.setProps({ text: 'Hello world' });
    });
    // timeout shouldn't have called yet
    expect(tree.text()).toBe('Hello');

    act(() => {
      jest.runAllTimers();
    });
    // after runAllTimer text should not be updated as debounce was cancelled
    expect(tree.text()).toBe('Hello');
  });

  it('should apply the latest value', () => {
    function Component({ text }) {
      const [value] = useDebounce(text, 1000);
      return <div>{value}</div>;
    }
    const tree = Enzyme.mount(<Component text={'Hello'} />);

    // check inited value
    expect(tree.text()).toBe('Hello');

    act(() => {
      // this value shouldn't be applied, as we'll set up another one
      tree.setProps({ text: 'Wrong value' });
    });
    // timeout shouldn't have called yet
    expect(tree.text()).toBe('Hello');

    tree.setProps({ text: 'Right value' });

    act(() => {
      jest.runAllTimers();
    });
    // after runAllTimer text should be updated
    expect(tree.text()).toBe('Right value');
  });

  it('should cancel maxWait callback', () => {
    function Component({ text }) {
      const [value, fn] = useDebounce(text, 500, { maxWait: 600 });
      if (text === 'Right value') {
        fn.cancel();
      }
      return <div>{value}</div>;
    }
    const tree = Enzyme.mount(<Component text={'Hello'} />);

    // check inited value
    expect(tree.text()).toBe('Hello');

    act(() => {
      // this value shouldn't be applied, as we'll set up another one
      tree.setProps({ text: 'Wrong value' });
    });

    act(() => {
      jest.runTimersToTime(400);
    });

    // timeout shouldn't have called yet
    expect(tree.text()).toBe('Hello');

    act(() => {
      tree.setProps({ text: 'Right value' });
    });

    act(() => {
      jest.runTimersToTime(400);
    });

    expect(tree.text()).toBe('Hello');
  });

  it('should apply the latest value if maxWait timeout is called', () => {
    function Component({ text }) {
      const [value] = useDebounce(text, 500, { maxWait: 600 });
      return <div>{value}</div>;
    }
    const tree = Enzyme.mount(<Component text={'Hello'} />);

    // check inited value
    expect(tree.text()).toBe('Hello');

    act(() => {
      // this value shouldn't be applied, as we'll set up another one
      tree.setProps({ text: 'Wrong value' });
    });

    act(() => {
      jest.runTimersToTime(400);
    });

    // timeout shouldn't have been called yet
    expect(tree.text()).toBe('Hello');

    act(() => {
      tree.setProps({ text: 'Right value' });
    });

    act(() => {
      jest.runTimersToTime(400);
    });
    // after runAllTimer text should be updated
    expect(tree.text()).toBe('Right value');
  });

  it("shouldn't apply the previous value if it was changed to started one", () => {
    function Component({ text }) {
      const [value] = useDebounce(text, 500);
      return <div>{value}</div>;
    }

    const tree = Enzyme.mount(<Component text={'Hello'} />);

    act(() => {
      // this value shouldn't be applied, as we'll set up another one
      tree.setProps({ text: 'new value' });
    });

    // timeout shouldn't have been called yet
    expect(tree.text()).toBe('Hello');

    act(() => {
      tree.setProps({ text: 'Hello' });
    });

    act(() => {
      jest.runTimersToTime(500);
    });

    // Value shouldn't be changed, as we rerender Component with text prop === 'Hello'
    expect(tree.text()).toBe('Hello');
  });

  it("shouldn't rerender component for the first time", () => {
    function Component({ text }) {
      const [value] = useDebounce(text, 1000, { maxWait: 500 });
      const rerenderCounter = React.useRef(0);
      rerenderCounter.current += 1;
      return <div>{rerenderCounter.current}</div>;
    }

    const tree = Enzyme.mount(<Component text={'Hello'} />);

    expect(tree.text()).toBe('1');

    act(() => {
      // We wait for the half of maxWait Timeout,
      jest.runTimersToTime(250);
    });

    act(() => {
      tree.setProps({ text: 'Test' });
    });

    expect(tree.text()).toBe('2');

    act(() => {
      // We wait for the maxWait Timeout,
      jest.runTimersToTime(250);
    });

    // If maxWait wasn't started at the first render of the component, we shouldn't receive the new value
    expect(tree.text()).toBe('2');
  });

  it('should use equality function if supplied', () => {
    // Use equality function that always returns true
    const eq = jest.fn((left: string, right: string): boolean => {
      return true;
    });

    function Component({ text }) {
      const [value] = useDebounce(text, 1000, { equalityFn: eq });
      return <div>{value}</div>;
    }

    const tree = Enzyme.mount(<Component text={'Hello'} />);

    expect(eq).toHaveBeenCalledTimes(1);

    act(() => {
      tree.setProps({ text: 'Test' });
    });

    expect(eq).toHaveBeenCalledTimes(2);
    expect(eq).toHaveBeenCalledWith('Hello', 'Test');
    // Since the equality function always returns true, expect the value to stay the same
    expect(tree.text()).toBe('Hello');
  });

  it('should setup new value immediately if callPending is called', () => {
    let callPending;
    function Component({ text }) {
      const [value, fn] = useDebounce(text, 1000);
      callPending = fn.flush;

      return <div>{value}</div>;
    }

    const tree = Enzyme.mount(<Component text={'Hello'} />);

    expect(tree.text()).toBe('Hello');

    act(() => {
      tree.setProps({ text: 'Test' });
    });

    // We don't call neither runTimers no callPending.
    expect(tree.text()).toBe('Hello');

    act(() => {
      callPending();
    });

    expect(tree.text()).toBe('Test');
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
      return <div>{value}</div>;
    }
    const tree = Enzyme.mount(<Component text={'Hello'} />);

    // check inited value
    expect(tree.text()).toBe('Hello');

    act(() => {
      tree.setProps({ text: 'Hello world' });
    });
    // timeout shouldn't have called yet
    expect(tree.text()).toBe('Hello');

    act(() => {
      jest.runAllTimers();
    });
    // after runAllTimer text should be updated
    expect(tree.text()).toBe('Hello world');
  });

  it('should change debounced.isPending to true as soon as the function is called in a sync way', () => {
    function Component({ text }) {
      const [value, { isPending }] = useDebounce(text, 1000);
      if (value === text) {
        expect(isPending()).toBeFalsy();
      } else {
        expect(isPending()).toBeTruthy();
      }
      return <div>{value}</div>;
    }
    const tree = Enzyme.mount(<Component text={'Hello'} />);

    // check inited value
    expect(tree.text()).toBe('Hello');

    act(() => {
      tree.setProps({ text: 'Hello world' });
    });
    // timeout shouldn't have called yet
    expect(tree.text()).toBe('Hello');

    act(() => {
      jest.runAllTimers();
    });
    // after runAllTimer text should be updated
    expect(tree.text()).toBe('Hello world');
  });
});
