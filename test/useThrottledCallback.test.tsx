import * as Enzyme from 'enzyme';
import * as React from 'react';
import useThrottledCallback from '../src/useThrottledCallback';
import { act } from 'react-dom/test-utils';

describe('useThrottledCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
  });
  it('will call callback when timeout is called', () => {
    const callback = jest.fn();

    function Component() {
      const debounced = useThrottledCallback(callback, 1000, { leading: false, trailing: true });
      debounced();
      return null;
    }
    Enzyme.mount(<Component />);

    expect(callback.mock.calls.length).toBe(0);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will call leading callback immediately (but only once, as trailing is set to false)', () => {
    const callback = jest.fn();

    function Component() {
      const debounced = useThrottledCallback(callback, 1000, { leading: true, trailing: false });
      debounced();
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
      const debounced = useThrottledCallback(callback, 1000, { leading: true });
      debounced();
      debounced();
      return null;
    }
    Enzyme.mount(<Component />);

    expect(callback.mock.calls.length).toBe(1);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(2);
  });

  it('will call three callbacks if no debounced callbacks are pending', () => {
    const callback = jest.fn();

    function Component() {
      const debounced = useThrottledCallback(callback, 1000, { leading: true });
      debounced();
      debounced();
      setTimeout(() => {
        debounced();
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
});
