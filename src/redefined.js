import * as React from 'react';
import {getOverride} from './storage';
import {invariant, warn} from './notifications';

export function redefined(id, original) {
  invariant(!id, 'id must be set');

  invariant(isPrimitive(original), 'redefined function can\'t be called with primitive type');

  if (typeof original === 'function') {
    return functionDecorator(id, original);
  }

  return function(target, key, descriptor) {
    // for Babel
    if (target[key] && typeof target[key] === 'function') {
      return functionDecorator(id, descriptor);
    }

    if (key && descriptor && descriptor.initializer === undefined) {
      return functionFieldDecorator(id, original);
    }

    if (key && (!descriptor || descriptor.initializer !== undefined)) {
      return fieldDecorator(target, key, id, descriptor);
    }

    if (target.prototype) {
      return classDecorator(target, key, id);
    }
  };
}

function functionDecorator(id, descriptor) {
  // for TS
  if (descriptor.value) {
    return {
      value: createExtensionFn(id, descriptor.value),
      enumerable: false,
      configurable: true,
      writable: true,
    };
  }

  // For Babel
  return {
    enumerable: false,
    configurable: true,
    writable: true,
    initializer() {
      return createExtensionFn(id, descriptor.initializer);
    },
  };
}

function createExtensionFn(id, originalFn) {
  return function() {
    const extension = getOverride(id);

    if (extension && extension.value) {
      return extension.value.apply(this, arguments);
    }

    return originalFn.apply(this, arguments);
  };
}

// For Babel
function functionFieldDecorator(id, original) {
  let memoizedFunction;

  return function(props) {
    if (memoizedFunction) {
      return memoizedFunction(props);
    }

    const fn = memoizedFunction = getOverride(id) || original;

    return fn(props);
  };
}

function warnFunctionRequired(value) {
  warn(`Only functions are supported to redefine, found ${typeof value} instead`);
}


function fieldDecorator(target, key, id, descriptorArg) {
  const descriptors = Object.getOwnPropertyDescriptors(target);
  const descriptor = descriptors[key];
  let descriptorSetter = null;

  if (descriptor) {
    descriptorSetter = descriptor.set;
  }

  // for Babel
  if (descriptorArg) {
    return {
      configurable: true,
      enumerable: true,
      writable: true,
      initializer() {
        const initializedValue = descriptorArg.initializer ? descriptorArg.initializer.call(this) : undefined;

        if (!isFunction(initializedValue)) {
          return initializedValue;
        }

        if (initializedValue) {
          const override = getOverride(id);

          if (!override) {
            return initializedValue;
          }

          if (!isFunction(override.value)) {
            warnFunctionRequired(override.value);

            return initializedValue;
          }

          return override.value;
        }

        return function() {
          const override = getOverride(id);

          if (!override) {
            return initializedValue.call(this, ...arguments);
          }

          if (!isFunction(override.value)) {
            warnFunctionRequired(override.value);

            return initializedValue.call(this, ...arguments);
          }

          return override.value.call(this, ...arguments);
        };
      },
    };
  }

  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    get() {
      return undefined;
    },
    set(originalValue) {
      const override = getOverride(id);
      const overrideIsValid = override && isFunction(override.value);

      let value = originalValue;

      if (overrideIsValid) {
        value = override.value;
      }

      if (override && !isFunction(override.value)) {
        warnFunctionRequired(override.value);
      }

      if (descriptorSetter) {
        return descriptorSetter.call(this, value); // if descriptor already exists, use it
      }

      Object.defineProperty(target, key, {
        enumerable: true,
        writable: true,
        configurable: true,
        value: value,
      });
    },
  });
}

function classDecorator(target, key, id) {
  if (target.prototype.isReactComponent) {
    return createReactComponent(target, key, id);
  }
  return function(...args) {
    const extension = getOverride(id);

    if (extension) {
      return new extension.value(...args);
    }
    return new target(...args);
  };
}

function isPrimitive(value) {
  return value && value !== Object(value);
}

function isFunction(variableToCheck) {
  return variableToCheck instanceof Function;
}

function getReactClass(target, id) {
  return class RedefComponent extends React.PureComponent {
    render() {
      const extension = getOverride(id);

      if (extension) {
        return React.createElement(extension.value, this.props);
      }
      return React.createElement(target, this.props);
    }
  };
}

function createReactComponent(target, key, id) {
  return getReactClass(target, id);
}
