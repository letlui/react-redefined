# React-redefined

react-redefined allows you to override react-component, class, function or variable by applying decorator
@redefined

## Installation

Using npm

```bash
npm i react-redefined
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
If you want to combine @redefined with mobx decorators you should follow these simple rules:

#### Using with @observer
@observer decorator should always be applied first
```javascript
@observer
@redefined('example-override')
export class Example extends React.Component {
  ...
}
```

#### Using with @observable
Combination with @observable decorator haven't been tested yet, but will be tested and supported in future releases 

#### Using with @action
You can combine @redefined and @action as you please. 
Combination depends on whether you want redefine
 original function or function that already exists as action

```javascript
@action
@redefined('fooOverride') // action will always be applied to override
foo () {
   ...
}
```

```javascript
@redefined('fooOverride') // you need to register override as action if you want it to be an action
@action
foo (param) {
    ...
}

registerOverride('fooOverride', action(function (param) {
    ...
}))
```

## Contributing
Pull requests are welcome. 

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
