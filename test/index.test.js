import Enzyme from 'enzyme';
import React from 'react';
import { useDebounce } from '../src';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('put initialized value in first render', () => {
    function Component() {
      const debouncedText = useDebounce('Hello world', 1000);
      return <div>{debouncedText}</div>;
    }
    const tree = Enzyme.mount(<Component />);
    expect(tree.text()).toBe('Hello world');
  });

  it('will update value when timer is called', () => {
    function Component({ text }) {
      const debouncedText = useDebounce(text, 1000);
      return <div>{debouncedText}</div>;
    }
    const tree = Enzyme.mount(<Component text={'Hello'} />);

    // check inited value
    expect(tree.text()).toBe('Hello');

    tree.setProps({ text: 'Hello world' });
    // timeout shouldn't have called yet
    expect(tree.text()).toBe('Hello');

    jest.runAllTimers();
    // after runAllTimer text should be updated
    expect(tree.text()).toBe('Hello world');
  });

  it('should apply the latest value', () => {
    function Component({ text }) {
      const debouncedText = useDebounce(text, 1000);
      return <div>{debouncedText}</div>;
    }
    const tree = Enzyme.mount(<Component text={'Hello'} />);

    // check inited value
    expect(tree.text()).toBe('Hello');

    // this value shouldn't be applied, as we'll set up another one
    tree.setProps({ text: 'Wrong value' });
    // timeout shouldn't have called yet
    expect(tree.text()).toBe('Hello');

    tree.setProps({ text: 'Right value' });
    jest.runAllTimers();
    // after runAllTimer text should be updated
    expect(tree.text()).toBe('Right value');
  });
});
