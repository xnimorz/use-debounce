import Enzyme from 'enzyme';
import React from 'react';
import useDebounce from '../src/cache';
import { act } from 'react-dom/test-utils';

jest.useFakeTimers();

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

  it('will cancel value when cancel method is called', () => {
    function Component({ text }) {
      const [value, cancelValue] = useDebounce(text, 1000);
      setTimeout(cancelValue, 500);
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
      const [value, cancel] = useDebounce(text, 500, { maxWait: 600 });
      if (text === 'Right value') {
        cancel();
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

    // timeout shouldn't have called yet
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
});
