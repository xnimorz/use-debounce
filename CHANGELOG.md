## 10.0.5
- Fixed issue https://github.com/xnimorz/use-debounce/issues/192, where isPending remains true with leading: true configuration, thanks to [@elrion018](https://github.com/elrion018)

## 10.0.4
- Fix behaviour for strictMode react when leading is set to true and trailing is true

## 10.0.3
- Removed `peerDependency` part from `package.json` as NPM cannot correctly resolve `peerDependency` for beta and rc versions: see https://stackoverflow.com/questions/67934358/npm-including-all-range-of-pre-release-when-defining-peer-dependency for context

## 10.0.2

- Fixed: `isPending` does not reset the state if the tracked value hasn't changed.. See https://github.com/xnimorz/use-debounce/issues/178

## 10.0.1

- Fixed flush method return args, thanks to [@h](https://github.com/h)

## 10.0.0

- _Major breaking change_: replaced `index.modern.js` with `index.mjs`. Might require a little change in your build pipeline
- _Major breaking change_: New option `debounceOnServer`: if you put the option to true, it will run debouncing on server (via `setTimeout`). The new option can break your current server behaviour, as v9.x, it runs all the time and might cause unnessesary server CPU utilisation. Now, by default, debounced callbacks do not happen on server.
- _Minor breaking change_: Replaced `useState` for `useDebounce` with `useReducer`. It might lead to reduced amount of re-renders, as useState is known to have excess re-renders in some corner: https://stackoverflow.com/questions/57652176/react-hooks-usestate-setvalue-still-rerender-one-more-time-when-value-is-equal
- _Minor breaking change_: `useDebouncedCallback` now updates function to call asap. Meaning, if you re-called the hook and it should trigger immediately, it will trigger the newest function all the time.
- Lib size:
  914 B: index.js.gz
  851 B: index.js.br
  883 B: index.mjs.gz
  826 B: index.mjs.br
  938 B: index.module.js.gz
  873 B: index.module.js.br
  989 B: index.umd.js.gz
  919 B: index.umd.js.br
- [Internal] Replaced Enzyme with @testing-library
- [Internal] yarn classic => npm
- [Internal] Updated devDependencies

## 9.0.4

- Tweak exports, see [PR](https://github.com/xnimorz/use-debounce/pull/160), thanks to [@Andarist](https://github.com/Andarist)
- Changed types, see [PR](https://github.com/xnimorz/use-debounce/pull/158), thanks to [@wangcch](https://github.com/wangcch)

## 9.0.3

- Represent correct return type from useDebounce(), see [issue](https://github.com/xnimorz/use-debounce/pull/155), thanks to [@appden](https://github.com/appden)

## 9.0.2

- Reverted 9.0.0. We will revisit these changes later

## 9.0.0

- Moved use-debounce to support modules see [issue](https://github.com/xnimorz/use-debounce/issues/147) Thanks to [@matewilk](https://github.com/matewilk)
- _breaking change_ The path to `dist/index.js` is changed. Now it's `dist/index.cjs`.

## 8.0.4

- Changes types for `useDebouncedCallback` args: https://github.com/xnimorz/use-debounce/pull/140 Thanks to [@sarunast](https://github.com/sarunast)

## 8.0.3

- Added `types` to package json to mitigate https://github.com/microsoft/TypeScript/issues/49160. https://github.com/xnimorz/use-debounce/pull/138 Thanks to [@wuzzeb](https://github.com/wuzzeb)

## 8.0.2

- Added type exports. https://github.com/xnimorz/use-debounce/pull/136 Thanks to [@tryggvigy](https://github.com/tryggvigy)
- Improved code comments. https://github.com/xnimorz/use-debounce/pull/135 Thanks to [@tryggvigy](https://github.com/tryggvigy)

## 8.0.1

- update library exports section to make exports work correctly with jest@28

## 8.0.0

- _breaking change_ `useDebounce` changed its build system to microbundle. For now we have several entries:

`index.js` is for commonJS approach
`index.modern.js` for esnext module system
`index.umd.js` for UMD.
All the files are in `dist` folder.

If you have any paths which have `esm` or `lib`, please, replace them to `dist`:

Before:

```js
import useDebounceCallback from 'use-debounce/lib/useDebounceCallback';
```

After:

```js
import { useDebounceCallback } from 'use-debounce';
```

- Fixed issue with incorrect VSCode autocomplete https://github.com/xnimorz/use-debounce/issues/131 Thanks to [@c-ehrlich](https://github.com/c-ehrlich) for reporting
- Fixed `useDebounce` behaviour with react-devtools tab when devtools have a component with `useDebounce` or `useDebounceCallback` opened. https://github.com/xnimorz/use-debounce/issues/129 Thanks to [@alexniarchos](https://github.com/alexniarchos) for reporting
- Fixed issue with `leading: true` https://github.com/xnimorz/use-debounce/issues/124 Thanks to [@mntnoe](https://github.com/mntnoe) for reporting

## 7.0.1

- `debounced` object now is preserved for `use-debounce` between the renders. Thanks to [@msharifi99](https://github.com/msharifi99) for reporting.

## 7.0.0

- _breaking change_ `useDebounce` hook changed `isPending` behavior from `async` reacting to the sync. Now `isPending` returns `True` as soon as the new value is sent to the hook.
- Dev dependencies updated

## 6.0.1

- Fixed `useDebouncedCallback` return type. Closed https://github.com/xnimorz/use-debounce/issues/103 thanks to [@VanTanev](https://github.com/VanTanev)

## 6.0.0

- _breaking change_: removed `callback` field, instead of this `useDebouncedCallback` and `useThrottledCallback` returns a callable function:
  Old:

  ```js
  const { callback, pending } = useDebouncedCallback(/*...*/);
  // ...
  debounced.callback();
  ```

  New:

  ```js
  const debounced = useDebouncedCallback(/*...*/);
  // ...
  debounced();
  /**
   * Also debounced has fields:
   * {
   *   cancel: () => void
   *   flush: () => void
   *   isPending: () => boolean
   * }
   * So you can call debounced.cancel(), debounced.flush(), debounced.isPending()
   */
  ```

  It makes easier to understand which cancel \ flush or isPending is called in case you have several debounced functions in your component

- _breaking change_: Now `useDebounce`, `useDebouncedCallback` and `useThrottledCallback` has `isPending` method instead of `pending`

  Old:

  ```js
  const { callback, pending } = useDebouncedCallback(/*...*/);
  ```

  New:

  ```js
  const { isPending } = useDebouncedCallback(/*...*/);
  /**
   * {
   *   cancel: () => void
   *   flush: () => void
   *   isPending: () => boolean
   * }
   */
  ```

- get rid of `useCallback` calls

- improve internal typing

- decrease the amount of functions to initialize each `useDebouncedCallback` call

- reduce library size:

  Whole library: from 946 B to 899 B === 47 B
  useDebounce: from 844 to 791 === 53 B
  useDebouncedCallback: from 680 to 623 === 57 B
  useThrottledCallback: from 736 to 680 === 56 B

## 5.2.1

- prevent having ininite setTimeout setup when component gets unmounted https://github.com/xnimorz/use-debounce/issues/97
- function type works correctly with `useDebounce` now. https://github.com/xnimorz/use-debounce/pull/95 Thanks to [@csu-feizao](https://github.com/csu-feizao)

## 5.2.0

- Added `useThrottledCallback`

## 5.1.0

— `wait` param is optional. If you don't provide a wait argument, use-debounce will postpone a callback with requestAnimationFrame if it's in browser environment, or through setTimeout(..., 0) otherwise.

## 5.0.4

- Add an export for React Native

## 5.0.3

- Fix the export map (https://github.com/xnimorz/use-debounce/issues/84);

## 5.0.2

- Add size-limit and configure it for esm modules. Now the size of the whole library is limited within 1 KB (thanks to [@omgovich](https://github.com/omgovich))

- Add an [export map](https://docs.skypack.dev/package-authors/package-checks#export-map) to your package.json. (thanks to [@omgovich](https://github.com/omgovich))

- Reduce bundle size (thanks to [@omgovich](https://github.com/omgovich)):
  Before:

  ```
  esm/index.js
  Size:       908 B with all dependencies, minified and gzipped

  esm/index.js
  Size:       873 B with all dependencies, minified and gzipped

  esm/index.js
  Size:       755 B with all dependencies, minified and gzipped
  ```

  Now:

  ```
  esm/index.js
  Size:       826 B with all dependencies, minified and gzipped

  esm/index.js
  Size:       790 B with all dependencies, minified and gzipped

  esm/index.js
  Size:       675 B with all dependencies, minified and gzipped
  ```

- Add notes about returned value from `debounced.callback` and its subsequent calls: https://github.com/xnimorz/use-debounce#returned-value-from-debouncedcallback

- Add project logo (thanks to [@omgovich](https://github.com/omgovich)):
  <img src="logo.png" width="500" alt="use-debounce" />

## 5.0.1

- Fix typing to infer correct callback type (thanks to [@lytc](https://github.com/lytc))

## 5.0.0

- _breaking change_: Now `useDebouncedCallback` returns an object instead of array:

  Old:

  ```js
  const [debouncedCallback, cancelDebouncedCallback, callPending] =
    useDebouncedCallback(/*...*/);
  ```

  New:

  ```js
  const debounced = useDebouncedCallback(/*...*/);
  /**
   * debounced: {
   *   callback: (...args: T) => unknown, which is debouncedCallback
   *   cancel: () => void, which is cancelDebouncedCallback
   *   flush: () => void, which is callPending
   *   pending: () => boolean, which is a new function
   * }
   */
  ```

- _breaking change_: Now `useDebounce` returns an array of 2 fields instead of a plain array:
  Old:

  ```js
  const [value, cancel, callPending] = useDebounce(/*...*/);
  ```

  New:

  ```js
  const [value, fn] = useDebounce(/*...*/);
  /**
   * value is just a value without changes
   * But fn now is an object: {
   *   cancel: () => void, which is cancel
   *   flush: () => void, which is callPending
   *   pending: () => boolean, which is a new function
   * }
   */
  ```

- Added `pending` function to both `useDebounce` and `useDebouncedCallback` which shows whether component has pending callbacks
  Example:

  ```js
  function Component({ text }) {
    const debounced = useDebouncedCallback(
      useCallback(() => {}, []),
      500
    );

    expect(debounced.pending()).toBeFalsy();
    debounced.callback();
    expect(debounced.pending()).toBeTruthy();
    debounced.flush();
    expect(debounced.pending()).toBeFalsy();

    return <span>{text}</span>;
  }
  ```

For more details of these major changes you could check this commit https://github.com/xnimorz/use-debounce/commit/1b4ac0432f7074248faafcfe6248df0be4bb4af0 and this issue https://github.com/xnimorz/use-debounce/issues/61

- Fixed security alerts

## 4.0.0

- _breaking change_: Support lodash style throttling options for trailing+maxWidth. Thanks to [@tryggvigy](https://github.com/tryggvigy)
  Example:

```js
useDebouncedCallback(callback, 300, {
  leading: true,
  trailing: false,
  maxWait: 300,
});
```

Where the trailing edge is turned off. Let's say the function is called twice in the first 300ms. Now debounced function to have been called _once_.

_how to migrate_: Please, check your `traling: false` params with `maxWait` option

- _breaking change_: Now in case delay option is unset, it will be `requestAnimationFrame` delay

- _breaking change_: Now `debouncedCallback` from `useDebouncedCallback` returns a value. In v3 it used to return `undefined`:

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

  return (
    <input
      defaultValue={defaultValue}
      onChange={(e) => debouncedFunction(e.target.value)}
    />
  );
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
