import Enzyme from 'enzyme';
import React from 'react';
import useDebouncedCallback from '../src/callback';
import { act } from 'react-dom/test-utils';

jest.useFakeTimers();

describe('useDebouncedCallback', () => {
  it('will call callback when timeout is called', () => {
    const callback = jest.fn();

    function Component() {
      const debouncedCallback = useDebouncedCallback(callback, 1000, []);
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

  it('will cancel delayed callback when cancel method is called', () => {
    const callback = jest.fn();

    function Component() {
      const debouncedCallback = useDebouncedCallback(callback, 1000, []);
      debouncedCallback();
      setTimeout(debouncedCallback.cancel, 500);
      return null;
    }
    Enzyme.mount(<Component />);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(0);
  });

  it('will call callback only with the latest params', () => {
    const callback = jest.fn((param) => {
      expect(param).toBe('Right param');
    });

    function Component() {
      const debouncedCallback = useDebouncedCallback(callback, 1000, []);
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

  it('will change callback function, if params from dependencies has changed', () => {
    function Component({ text }) {
      const debouncedCallback = useDebouncedCallback(
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
      const debouncedCallback = useDebouncedCallback(
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
});
