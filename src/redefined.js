import * as React from 'react';
import {getOverride} from "./storage";
import {error, invariant} from "./notifications";
import {createElement, forwardRef} from "react";

export function redefined(id, original) {
    invariant(!Boolean(id), 'id must be set')

    if (typeof original === 'function') {
        return functionDecorator(id, original)
    }

    if (isPrimitive(original)) {
        return primitiveField(id, original)
    }

    return function (target, key, descriptor) {
        // if (!target[key] && key && descriptor && descriptor.enumerable) {
        //     throw Error(MESSAGE_PREFIX + 'override decorator can\'t be used with enumerable class field')
        // }

        // for Babel
        if (target[key] && typeof target[key] === 'function') {
            return functionDecorator(id, descriptor)
        }

        if (key && descriptor && descriptor.initializer === undefined) {
            return functionFieldDecorator(id, original);
        }

        if (key && (!descriptor || descriptor.initializer !== undefined)) {
            return fieldDecorator(target, key, id, descriptor);
        }

        if (target.prototype) {
            return classDecorator(target, key, id)

        }

    }
}

function functionDecorator(id, descriptor) {
    //for TS
    if (descriptor.value) {
        return {
            value: createExtensionFn(id, descriptor.value),
            enumerable: false,
            configurable: true,
            writable: true
        };
    }

    //For Babel
    return {
        enumerable: false,
        configurable: true,
        writable: true,
        initializer: function () {
            return createExtensionFn(id, descriptor.initializer);
        }
    };

}

function createExtensionFn(id, originalFn) {
    return function () {
        const extension = getOverride(id);

        if (extension && extension.value) {
            return extension.value.apply(this, arguments);
        }

        return originalFn.apply(this, arguments);
    }
}

function functionFieldDecorator(id, original) {
    let memoizedFunction;

    return function (props) {
        if (memoizedFunction) {
            return memoizedFunction(props);
        }

        const fn = memoizedFunction = getOverride(id) || original

        return fn(props)
    }
}

function fieldDecorator(target, key, id, descriptorArg) {
    let descriptors = Object.getOwnPropertyDescriptors(target);
    let descriptor = descriptors[key];
    let descriptorSetter = null;
    let isFirstGetterCall = true;
    let isFirstSetterCall = true;

    if (descriptor) {
        descriptorSetter = descriptor.set;
    }

    if (descriptorArg) {
        return {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: function () {
                const originalValue = descriptorArg.initializer ? descriptorArg.initializer.call(this) : undefined;

                if (isPrimitive(originalValue) || !originalValue) { // if original value not set, assume that
                    const override = getOverride(id);

                    if (!override) {
                        return originalValue
                    }

                    return override.value;

                }

                return function () {
                    const override = getOverride(id);
                    //ToDo поддержка филдов
                    if (override && override.value) {
                        return override.value.call(this, ...arguments)
                    } else {
                        return originalValue.call(this, ...arguments);
                    }
                }

            }
        }
    } else {
        Object.defineProperty(target, key, {
            configurable: true,
            enumerable: true,
            get: function () { // for empty field
                if (isFirstGetterCall) {
                    const extension = getOverride(id);

                    if (extension) {
                        isFirstGetterCall = false;
                        return extension.value
                    } else {
                        return undefined;
                    }
                } else {
                    return undefined;
                }
            },
            set: function (value) { // for already set field
                if (!isFirstSetterCall) {
                    return value;
                }

                isFirstSetterCall = false

                const extension = getOverride(id);

                let propValue = extension ? extension.value : value

                if (descriptorSetter) {
                    return descriptorSetter.call(this, propValue)
                }

                Object.defineProperty(target, key, {
                    enumerable: true,
                    writable: true,
                    configurable: true,
                    value: propValue
                });
            }
        });

    }

}

function classDecorator(target, key, id) {
    if (target.prototype.isReactComponent) {
        return createReactComponent(target, key, id)

    } else {
        return function () {
            let extension = getOverride(id);

            if (extension) {
                return new extension.value(...arguments)
            } else {
                return new target(...arguments)
            }

        }
    }
}

function primitiveField(id, original) {
    let extension = getOverride(id);

    if (extension) {
        return extension.value
    }

    return original;
}

function isPrimitive(value) {
    return value && value !== Object(value)
}

function getReactClass(target, id) {
    return class RedefComponent extends React.Component {
        render() {
            let extension = getOverride(id);

            if (extension) {
                return React.createElement(extension.value, this.props)
            } else {
                return React.createElement(target, this.props);
            }
        }
    }
}

function createReactComponent (target, key, id) {
    // ToDo make it work
    // if (reactForwardRefSymbol() && target["$$typeof"] === reactForwardRefSymbol()) {
    //     let baseRender = target["render"];
    //
    //     if (typeof baseRender !== "function") {
    //         error('render property of ForwardRef is not a function');
    //     }
    //
    //     return forwardRef(function RedefinedForwardRef() {
    //         let args = arguments;
    //
    //         return createElement(getReactClass(id), null, function () {
    //             return baseRender.apply(undefined, args);
    //         });
    //     })
    // }

    return getReactClass(target, id);
}


function reactForwardRefSymbol() {
    let symbolExists = typeof Symbol === "function" && Symbol.for

    return symbolExists ?
        Symbol.for("react.forward_ref") : typeof forwardRef === "function" &&
        forwardRef(function (props) {
            return null;
        })["$$typeof"];
}



