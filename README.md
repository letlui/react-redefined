# React-redefined

react-redefined allows you to override react component, class, and function by applying decorator
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

Use @redefine first you want a function to act as an action:

```javascript
@action
@redefined('fooOverride')
foo () {
   ...
}
```

Magic of action goes away, if you don't register your function as an action:

```javascript
@redefined('fooOverride') 
@action
foo (param) { 
    ...
}

registerOverride('fooOverride', action(function (param) {
    ...
}))
```

## Using with Typescript
Decorator implementation in Babel and Typescript are different.

Typescript decorators doesn't have initializer property which is called during object construction time.

In Typescript set accessor will be called instead. After first 'set' call new property will be created with the redefined value.

That is the reason why tests are different for Babel and Typescript.
 
## Contributing
Pull requests are welcome. 

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
