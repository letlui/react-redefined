import {beforeEach, describe, expect, it} from "@jest/globals";
import {clearOverrides, getOverride, registerOverride, removeOverride} from "../src";
import {ClassOverride} from "./setup/mocks";

beforeEach(() => {
    clearOverrides();
})

describe('storage', () => {
    it('adds override', () => {
        registerOverride('testClass', ClassOverride)

        expect(getOverride('testClass')).toEqual({value: ClassOverride})
    })

    it('removes override', () => {
        registerOverride('testClass', ClassOverride)
        removeOverride('testClass')

        expect(getOverride('testClass')).toEqual(undefined)
    })

    it('clears all overrides', () => {
        registerOverride('class', ClassOverride)
        registerOverride('string', 'hello')
        registerOverride('number', 2)

        clearOverrides();

        expect(getOverride('class')).toEqual(undefined)
        expect(getOverride('string')).toEqual(undefined)
        expect(getOverride('number')).toEqual(undefined)
    })
});
