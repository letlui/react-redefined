# React-redefined

react-redefined allows you to override react-component, class, function or variable by applying decorator
@redefined

## Installation

Using npm

```bash
npm I react-redefined
```

## Usage

Before the start of your application you should register overrides of existing modules (i.e classes, functions, variables) like this:
```javascript
registerOverride('example-override', OverrideComponent);
```
Then you need to add decorator and pass registered override id.

```javascript
import * as React from 'react';
import {redefined} from 'react-redefined';

@redefined('example-override')
export class Example extends React.Component {
    render () {
        return (
            <div>
                ...
            </div>
        );
    }
}
```
Decorator @redefined takes one parameter as module id. This parameter should be unique, otherwise it will be overridden by last added component with same id.

## Using with Redux
If you using your component with connect function, wrap your component with the redefined function first:
```javascript
export default (connect()(redefined('addToDo', AddTodo)))
```

## Using with Mobx
If you using Mobx
```javascript
export default (connect()(redefined('addToDo', AddTodo)))
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
