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
