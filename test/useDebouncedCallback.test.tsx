import * as Enzyme from 'enzyme';
import { useEffect, useCallback } from 'react';
import * as React from 'react';
import useDebouncedCallback from '../src/useDebouncedCallback';
import { act } from 'react-dom/test-utils';

jest.useFakeTimers();

describe('useDebouncedCallback', () => {
  it('will call callback when timeout is called', () => {
    const callback = jest.fn();

    function Component() {
      const [debouncedCallback] = useDebouncedCallback(callback, 1000);
      debouncedCallback();
      return null;
    }
    Enzyme.mount(<Component />);

    expect(callback.mock.calls.length).toBe(0);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will call leading callback immediately (but only once)', () => {
    const callback = jest.fn();

    function Component() {
      const [debouncedCallback] = useDebouncedCallback(callback, 1000, {leading: true});
      debouncedCallback();
      return null;
    }
    Enzyme.mount(<Component />);

    expect(callback.mock.calls.length).toBe(1);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will call leading callback as well as next debounced call', () => {
    const callback = jest.fn();

    function Component() {
      const [debouncedCallback] = useDebouncedCallback(callback, 1000, {leading: true});
      debouncedCallback();
      debouncedCallback();
      return null;
    }
    Enzyme.mount(<Component />);

    expect(callback.mock.calls.length).toBe(1);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(2);
  });
  
  it('will call a second leading callback if no debounced callbacks are pending', () => {
    const callback = jest.fn();

    function Component() {
      const [debouncedCallback] = useDebouncedCallback(callback, 1000, {leading: true});
      debouncedCallback();
      debouncedCallback();
      setTimeout(() => {
        debouncedCallback();
      }, 1001);
      return null;
    }
    Enzyme.mount(<Component />);

    expect(callback.mock.calls.length).toBe(1);

    act(() => {
      jest.runTimersToTime(1001);
    });

    expect(callback.mock.calls.length).toBe(3);
  });

  it('will call callback only with the latest params', () => {
    const callback = jest.fn((param) => {
      expect(param).toBe('Right param');
    });

    function Component() {
      const [debouncedCallback] = useDebouncedCallback(callback, 1000);
      debouncedCallback('Wrong param');
      setTimeout(() => {
        debouncedCallback('Right param');
      }, 500);
      return null;
    }
    Enzyme.mount(<Component />);

    act(() => {
      jest.runTimersToTime(500);
    });
    expect(callback.mock.calls.length).toBe(0);

    act(() => {
      jest.runTimersToTime(1000);
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will cancel delayed callback when cancel method is called', () => {
    const callback = jest.fn();

    function Component() {
      const [debouncedCallback, cancelDebouncedCallback] = useDebouncedCallback(callback, 1000);
      debouncedCallback();
      setTimeout(cancelDebouncedCallback, 500);
      return null;
    }
    Enzyme.mount(<Component />);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(0);
  });

  it('will change callback function, if params from dependencies has changed', () => {
    function Component({ text }) {
      const [debouncedCallback] = useDebouncedCallback(
        useCallback(
          jest.fn(() => {
            expect(text).toBe('Right param');
          }),
          [text]
        ),
        1000
      );
      return <button onClick={debouncedCallback} />;
    }
    const tree = Enzyme.mount(<Component text="Wrong param" />);

    tree.setProps({ text: 'Right param' });

    tree.find('button').simulate('click');

    act(() => {
      jest.runAllTimers();
    });
  });

  it("won't change callback function, if params from dependencies hasn't changed", () => {
    function Component({ text }) {
      const [debouncedCallback] = useDebouncedCallback(
        useCallback(
          jest.fn(() => {
            expect(text).toBe('Right param');
          }),
          []
        ),
        1000
      );
      return <button onClick={debouncedCallback} />;
    }
    const tree = Enzyme.mount(<Component text="Right param" />);

    tree.setProps({ text: 'Wrong param' });

    tree.find('button').simulate('click');

    act(() => {
      jest.runAllTimers();
    });
  });

  it('call callback with the latest value if maxWait time exceed', () => {
    const callback = (value) => expect(value).toBe('Right value');

    function Component({ text }) {
      const [debouncedCallback] = useDebouncedCallback(callback, 500, { maxWait: 600 });
      debouncedCallback(text);
      return <span>{text}</span>;
    }
    const tree = Enzyme.mount(<Component text="Wrong Value" />);

    act(() => {
      jest.runTimersToTime(400);
      tree.setProps({ text: 'Right value' });
    });

    act(() => {
      jest.runTimersToTime(400);
    });
  });

  it('will call callback if maxWait time exceed', () => {
    const callback = jest.fn();

    function Component({ text }) {
      const [debouncedCallback] = useDebouncedCallback(callback, 500, { maxWait: 600 });
      debouncedCallback();
      return <span>{text}</span>;
    }
    const tree = Enzyme.mount(<Component text="one" />);

    expect(callback.mock.calls.length).toBe(0);
    expect(tree.text()).toBe('one');

    act(() => {
      jest.runTimersToTime(400);
      tree.setProps({ text: 'test' });
    });

    expect(callback.mock.calls.length).toBe(0);
    expect(tree.text()).toBe('test');

    act(() => {
      jest.runTimersToTime(400);
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will cancel callback if maxWait time exceed and cancel method was invoked', () => {
    const callback = jest.fn();

    function Component({ text }) {
      const [debouncedCallback, cancel] = useDebouncedCallback(callback, 500, { maxWait: 600 });
      debouncedCallback();
      if (text === 'test') {
        cancel();
      }
      return <span>{text}</span>;
    }
    const tree = Enzyme.mount(<Component text="one" />);

    expect(callback.mock.calls.length).toBe(0);
    expect(tree.text()).toBe('one');

    act(() => {
      jest.runTimersToTime(400);
      tree.setProps({ text: 'test' });
    });

    expect(callback.mock.calls.length).toBe(0);
    expect(tree.text()).toBe('test');

    act(() => {
      jest.runTimersToTime(400);
    });

    expect(callback.mock.calls.length).toBe(0);
  });

  it('will call pending callback if callPending function is called', () => {
    const callback = jest.fn();

    function Component({ text }) {
      const [debouncedCallback, , callPending] = useDebouncedCallback(callback, 500);
      debouncedCallback();
      if (text === 'test') {
        callPending();
      }
      return <span>{text}</span>;
    }
    const tree = Enzyme.mount(<Component text="one" />);

    expect(callback.mock.calls.length).toBe(0);
    expect(tree.text()).toBe('one');

    act(() => {
      tree.setProps({ text: 'test' });
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('won\t call pending callback if callPending function is called and there are no items in queue', () => {
    const callback = jest.fn();

    function Component({ text }) {
      const [debouncedCallback, , callPending] = useDebouncedCallback(callback, 500);
      if (text === 'test') {
        callPending();
      }
      return <span>{text}</span>;
    }
    const tree = Enzyme.mount(<Component text="one" />);

    expect(callback.mock.calls.length).toBe(0);
    expect(tree.text()).toBe('one');

    act(() => {
      tree.setProps({ text: 'test' });
    });

    expect(callback.mock.calls.length).toBe(0);
    expect(tree.text()).toBe('test');
  });

  it('won\t call pending callback if callPending function is called and cancel method is also executed', () => {
    const callback = jest.fn();

    function Component({ text }) {
      const [debouncedCallback, cancel, callPending] = useDebouncedCallback(callback, 500);
      debouncedCallback();
      if (text === 'test') {
        cancel();
        callPending();
      }
      return <span>{text}</span>;
    }
    const tree = Enzyme.mount(<Component text="one" />);

    expect(callback.mock.calls.length).toBe(0);
    expect(tree.text()).toBe('one');

    act(() => {
      tree.setProps({ text: 'test' });
    });

    expect(callback.mock.calls.length).toBe(0);
    expect(tree.text()).toBe('test');
  });

  it('will call pending callback if callPending function is called on component unmount', () => {
    const callback = jest.fn();

    function Component({ text }) {
      const [debouncedCallback, , callPending] = useDebouncedCallback(callback, 500);

      debouncedCallback();
      useEffect(
        () => () => {
          callPending();
        },
        []
      );
      return <span>{text}</span>;
    }
    const tree = Enzyme.mount(<Component text="one" />);

    expect(callback.mock.calls.length).toBe(0);
    expect(tree.text()).toBe('one');

    act(() => {
      tree.unmount();
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will memoize debouncedCallback', () => {
    let debouncedCallbackCached = null;

    function Component({ text }) {
      const [debouncedCallback] = useDebouncedCallback(useCallback(() => {}, []), 500);

      if (debouncedCallbackCached) {
        expect(debouncedCallback).toBe(debouncedCallbackCached);
      }
      debouncedCallbackCached = debouncedCallback;

      return <span>{text}</span>;
    }
    const tree = Enzyme.mount(<Component text="one" />);

    expect(tree.text()).toBe('one');

    act(() => {
      tree.setProps({ text: 'two' });
    });
  });

  it('will change reference to debouncedCallback if dependency from deps array is changed', () => {
    expect.assertions(3);
    let debouncedCallbackCached = null;
    let textCached = null;

    function Component({ text }) {
      const [debouncedCallback] = useDebouncedCallback(useCallback(() => {}, [text]), 500);

      if (debouncedCallbackCached) {
        if (textCached === text) {
          expect(debouncedCallback).toBe(debouncedCallbackCached);
        } else {
          expect(debouncedCallback).not.toBe(debouncedCallbackCached);
        }
      }
      debouncedCallbackCached = debouncedCallback;
      textCached = text;

      return <span>{text}</span>;
    }
    const tree = Enzyme.mount(<Component text="one" />);

    expect(tree.text()).toBe('one');

    act(() => {
      tree.setProps({ text: 'one' });
    });

    act(() => {
      tree.setProps({ text: 'two' });
    });
  });

  it('will change reference to debouncedCallback if maxWait or delay option is changed', () => {
    expect.assertions(5);
    let debouncedCallbackCached = null;
    let cachedObj = null;

    function Component({ text, maxWait = 1000, delay = 500 }) {
      const [debouncedCallback] = useDebouncedCallback(useCallback(() => {}, []), delay, { maxWait });

      if (debouncedCallbackCached) {
        if (cachedObj.delay === delay && cachedObj.maxWait === maxWait) {
          expect(debouncedCallback).toBe(debouncedCallbackCached);
        } else {
          expect(debouncedCallback).not.toBe(debouncedCallbackCached);
        }
      }
      debouncedCallbackCached = debouncedCallback;
      cachedObj = { text, maxWait, delay };

      return <span>{text}</span>;
    }
    const tree = Enzyme.mount(<Component text="one" />);

    expect(tree.text()).toBe('one');

    act(() => {
      tree.setProps({ text: 'one' });
    });

    act(() => {
      tree.setProps({ text: 'two' });
    });

    act(() => {
      tree.setProps({ delay: 1 });
    });

    act(() => {
      tree.setProps({ maxWait: 2 });
    });
  });
});
