import {beforeEach, describe, expect, it} from "@jest/globals";
import {clearOverrides, registerOverride} from "../src";
import {
    ClassOverride,
    ClassOverrideOriginal,
    ConstructorFieldOverride,
    FieldFunctionOverride,
    FieldOverride, FieldSet,
    FunctionOverride
} from "./setup/mocks";
import {ComponentChildrenOverride, ComponentOriginal, ComponentOverride} from "./setup/react-mocks";
import * as React from "react";
import {mount, shallow} from "enzyme";

beforeEach(() => {
    clearOverrides();
})

describe('@redefined', () => {
    describe('Class', () => {
        it('overrides class', () => {
            registerOverride('testClass', ClassOverride)

            const instance = new ClassOverrideOriginal();

            expect(instance.firstName).toBe('John')
            expect(instance.lastName).toBe('Smith')
        })
    })

    describe('Function', () => {
        it('overrides class function', () => {
            registerOverride('getName', function () {
                return this.lastName
            })

            const instance = new FunctionOverride('John', 'Smith')

            expect(instance.getName()).toBe('Smith')
        })

        it('executes original function', () => {
            const instance = new FunctionOverride('John', 'Smith')

            expect(instance.getName()).toBe('John')
        })
    });


    describe('Function field', () => {
        it('overrides function field', () => {
            registerOverride('fullName', function (separator) {
                return this.firstName + separator + this.lastName
            })

            const instance = new FieldFunctionOverride('John', 'Smith')

            expect(instance.fullName(':')).toBe('John:Smith')
        })

        it('executes original function field', () => {
            const instance = new FieldFunctionOverride('John', 'Smith')

            expect(instance.fullName(':')).toBe('JohnSmith')
        })
    });

    describe('Field', () => {
        it('sets class field', () => {
            registerOverride('firstName', 'Alan')

            const instance = new FieldSet('John', 'Smith')

            expect(instance.firstName).toBe('Alan')
        })

        it('overrides class field', () => {
            registerOverride('firstName', 'Alan')

            const instance = new FieldOverride('John', 'Smith')

            expect(instance.firstName).toBe('Alan')
        })

        it('sets original field', () => {
            const instance = new FieldOverride('John', 'Smith')

            expect(instance.firstName).toBe(undefined)
        })

        it('replaces redefined field', () => {
            registerOverride('firstName', 'Alan');

            const instance = new FieldOverride('John', 'Smith');

            instance.firstName = 'Kevin';

            expect(instance.firstName).toBe('Kevin');
        });

        it('class field set in constructor overrides redefined value', () => {
            registerOverride('firstName', 'Alan');

            const instance = new ConstructorFieldOverride('John', 'Smith');

            expect(instance.firstName).toBe('John');
        });
    });

    describe('React Component', () => {
        it('replaces component', () => {
            registerOverride('componentOverride', ComponentOverride);

            const wrapper = mount(React.createElement(ComponentOriginal, {text: 'text'}));

            expect(wrapper.find('ComponentOverride')).toHaveLength(1);
            expect(wrapper.find('ComponentOverride').find('strong').text()).toEqual('0 text');
        });

        it('renders original component', () => {
            const wrapper = mount(React.createElement(ComponentOriginal, {text: 'text'}));

            expect(wrapper.find('ComponentOriginal')).toHaveLength(1);
            expect(wrapper.find('ComponentOriginal').find('strong').text()).toEqual('text 0');
        });

        it('replaces component with children', () => {
            registerOverride('componentOverride', ComponentChildrenOverride);

            const wrapper = mount(
                React.createElement(ComponentOriginal, {text: 'text'},
                    React.createElement('span', {
                        className: 'child-element'
                    }))
            );

            expect(wrapper.find('ComponentChildrenOverride').find('span')).toHaveLength(1);
        });
    });


});

