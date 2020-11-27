import * as Enzyme from 'enzyme';
import { useEffect, useCallback, useRef } from 'react';
import * as React from 'react';
import useDebouncedCallback from '../src/useDebouncedCallback';
import { act } from 'react-dom/test-utils';

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
  });
  it('will call callback when timeout is called', () => {
    const callback = jest.fn();
    const Time = () => {
      const debounced = useDebouncedCallback(() => {
        callback();
        console.log('test');
      }, 500);

      return <button onClick={debounced.callback} />;
    };

    const tree = Enzyme.mount(<Time />);
    tree
      .find('button')
      .props()
      .onClick({} as any);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(1);
  });
});
