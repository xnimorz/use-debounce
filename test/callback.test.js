import Enzyme from 'enzyme';
import React, { useEffect } from 'react';
import useDebouncedCallback from '../src/callback';
import { act } from 'react-dom/test-utils';

jest.useFakeTimers();

describe('useDebouncedCallback', () => {
  it('will call callback when timeout is called', () => {
    const callback = jest.fn();

    function Component() {
      const [debouncedCallback] = useDebouncedCallback(callback, 1000, []);
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

  it('will call callback only with the latest params', () => {
    const callback = jest.fn((param) => {
      expect(param).toBe('Right param');
    });

    function Component() {
      const [debouncedCallback] = useDebouncedCallback(callback, 1000, []);
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
      const [debouncedCallback, cancelDebouncedCallback] = useDebouncedCallback(callback, 1000, []);
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
        jest.fn(() => {
          expect(text).toBe('Right param');
        }),
        1000,
        [text]
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
        jest.fn(() => {
          expect(text).toBe('Right param');
        }),
        1000,
        []
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
      const [debouncedCallback] = useDebouncedCallback(callback, 500, [], { maxWait: 600 });
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
      const [debouncedCallback] = useDebouncedCallback(callback, 500, [], { maxWait: 600 });
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
      const [debouncedCallback, cancel] = useDebouncedCallback(callback, 500, [], { maxWait: 600 });
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
      const [debouncedCallback, , callPending] = useDebouncedCallback(callback, 500, []);
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
      const [debouncedCallback, , callPending] = useDebouncedCallback(callback, 500, []);
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
      const [debouncedCallback, cancel, callPending] = useDebouncedCallback(callback, 500, []);
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
      const [debouncedCallback, , callPending] = useDebouncedCallback(callback, 500, []);

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
});
