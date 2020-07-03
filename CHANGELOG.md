## 3.4.3

- Fix use-debounce so that it works correctly with react-native and next.js (as both of them use fast-refresh).

## 3.4.2

- Clear cache in build directory. Thanks to [@wangcch](https://github.com/wangcch)

## 3.4.1

- update types, so that they are more convinient. Thanks to [@astj](https://github.com/astj)

## 3.4.0

- Now `callPendings` wrapped with useCallback hook, so that the reference to the function would be the same. Thanks to [@jfschwarz](https://github.com/jfschwarz)

## 3.3.0

- `useDebouncedCallback` and `useDebounce` now can configure both `leading` and `trailing` options. They are fully compatible with `lodash.debounce` function https://lodash.com/docs/4.17.15#debounce. `leading` by default is false, trailing by default is true.
  Examples: https://codesandbox.io/s/vigilant-bush-zrbzg
  https://github.com/xnimorz/use-debounce/blob/master/test/useDebouncedCallback.test.tsx#L29-L180

## 3.2.0

- `useDebounce` has `callPending` method. See https://github.com/xnimorz/use-debounce/blob/master/test/useDebounce.test.tsx#L276-L302 unit test for examples.

## 3.1.0

- Now package includes only nessesary files. Thanks to [@vkrol](https://github.com/vkrol)
- Added optional `equalityFn` to `options` object for `useDebounce` so that you can provide a custom equality function to the hook. Thanks to [@seruco](https://github.com/seruco)

## 3.0.1

- Added missed `esm` directory (thanks for reporting [@FredyC](https://github.com/FredyC))
- Fixed import name (thanks for PR [@neoromantic](https://github.com/neoromantic))
- Updated `eslint-utils` lib version due to security issue

## 3.0.0

- **breaking change** now, `cache` file renamed to `useDebounce` and `callback` file renamed to `useDebouncedCallback`.
  If you used to import file by its path:

```js
import useDebounce from 'use-debounce/lib/cache';
import useDebouncedCallback from 'use-debounce/lib/callback';
```

it should be renamed to

```js
import useDebounce from 'use-debounce/lib/useDebounce';
import useDebouncedCallback from 'use-debounce/lib/useDebouncedCallback';
```

It helps us to keep more descriptive names. Thanks to [@vkrol](https://github.com/vkrol)
https://github.com/xnimorz/use-debounce/pull/33

- **breaking change** now, `useDebouncedCallback` executes the latest callback, which was sent to the hook (thanks for the report [@alexandr-bbm](https://github.com/alexandr-bbm) https://github.com/xnimorz/use-debounce/issues/35)
  https://github.com/xnimorz/use-debounce/commit/eca14cc25b1f14bdd337a555127fd98c54ab7a5c

- code shipped in ESM format. Thanks to [@vkrol](https://github.com/vkrol)
  https://github.com/xnimorz/use-debounce/pull/34

## 2.2.1

— Added `types` field in package.json. Thanks to [@nmussy](https://github.com/nmussy)

## 2.2.0

- Added leading calls param https://github.com/xnimorz/use-debounce#leading-calls thanks to [@Pringels](https://github.com/Pringels)
- Updated dev-dependencies

## 2.1.0

- Rewrite to typescript

## 2.0.1

- Fix the issue https://github.com/xnimorz/use-debounce/issues/23. Thanks to [@anilanar](https://github.com/anilanar) for reporting it.
- Add eslint to the project

## 2.0.0

- **breaking changes** now, `useDebouncedCallback` doesn't have `deps` argument. If you want to cache your callback it's better to use:

```js
const myCallback = useDebouncedCallback(
  useCallback(() => {
    /* do some stuff */
  }, [value]),
  500
);
```

- added `size-limit` to the project.
- Reduce size of the library from 705 bytes to 352 bytes (50%)

## 1.1.3

- remove `react-dom` from peerDependencies (as you can use this library with react native).

## 1.1.2

- `useCallback` now memoize returned callback

## 1.1.0

- add `callPending` callback to `useDebouncedCallback` method. It allows to call the callback manually if it hasn't fired yet. This method is handy to use when the user takes an action that would cause the component to unmount, but you need to execute the callback.

```javascript
import React, { useState, useCallback } from 'react';
import useDebouncedCallback from 'use-debounce/lib/callback';

function InputWhichFetchesSomeData({ defaultValue, asyncFetchData }) {
  const [debouncedFunction, cancel, callPending] = useDebouncedCallback(
    (value) => {
      asyncFetchData;
    },
    500,
    [],
    { maxWait: 2000 }
  );

  // When the component goes to be unmounted, we will fetch data if the input has changed.
  useEffect(
    () => () => {
      callPending();
    },
    []
  );

  return <input defaultValue={defaultValue} onChange={(e) => debouncedFunction(e.target.value)} />;
}
```

More examples are available here: https://github.com/xnimorz/use-debounce/commit/989d6c0efb4eef080ed78330233186d7b0c249e3#diff-c7e0cfdec8acc174d3301ff43b986264R196

## 1.0.0

The example with all features you can see here: https://codesandbox.io/s/4wvmp1xlw4

- add maxWait option. The maximum time func is allowed to be delayed before it's invoked:

```javascript
import { useDebounce, useDebouncedCallback } from 'use-debounce';

...
const debouncedValue = useDebounce(value, 300, {maxWait: 1000});
const debouncedCallback = useDebouncedCallback(() => {...}, 300, [], {maxWait: 1000});
```

- add cancel callback (thanks to [@thibaultboursier](https://github.com/thibaultboursier) for contributing). Cancel callback removes func from the queue (even maxWait):

```javascript
import { useDebounce, useDebouncedCallback } from 'use-debounce';

...
const [ debouncedValue, cancelValueDebouncingCycle ] = useDebounce(value, 1000);
const [ debouncedCallback, cancelCallback ] = useDebouncedCallback(() => {...}, 1000);
```

- [BREAKING] change the contact of use-debounce callback and value hooks:

**Old:**

```javascript
import { useDebounce, useDebouncedCallback } from 'use-debounce';

...
const debouncedValue = useDebounce(value, 1000);
const debouncedCallback = useDebouncedCallback(() => {...}, 1000);
```

**New:**

```javascript
import { useDebounce, useDebouncedCallback } from 'use-debounce';

...
const [ debouncedValue, cancelValueDebouncingCycle ] = useDebounce(value, 1000);
const [ debouncedCallback, cancelCallback ] = useDebouncedCallback(() => {...}, 1000);
```

You still can use only value and callback:

```javascript
import { useDebounce, useDebouncedCallback } from 'use-debounce';

...
const [ debouncedValue ] = useDebounce(value, 1000);
const [ debouncedCallback ] = useDebouncedCallback(() => {...}, 1000);
```

## 0.0.x

- add use-debounce callback and use-debounce value. First one is useful for debouncing callbacks e.g. event handlers, second one is handy for debouncing a value such as search fields etc.
