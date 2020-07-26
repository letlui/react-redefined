import {redefined} from "../../src";

@redefined('testClass')
class ClassOverrideOriginal {
    firstName = 'Michael'
    lastName = 'White'
}

class ClassOverride {
    firstName = 'John';
    lastName = 'Smith';
}

class FunctionOverride {
    constructor(firstName, lastName) {
        this.firstName = firstName
        this.lastName = lastName
    }

    @redefined('getName')
    getName () {
        return this.firstName
    }
}

class FieldFunctionOverride {
    constructor(firstName, lastName) {
        this.firstName = firstName
        this.lastName = lastName
    }

    @redefined('fullName')
    fullName = (separator) => {
        return this.firstName + this.lastName
    }
}

class FieldSet {
    @redefined('firstName')
    firstName = 'Rick'

    constructor(firstName, lastName) {
        this.lastName = lastName
    }
}

class FieldOverride {
    @redefined('firstName')
    firstName

    constructor(firstName, lastName) {
        this.lastName = lastName
    }
}

class ConstructorFieldOverride {
    @redefined('firstName')
    firstName

    constructor(firstName, lastName) {
        this.firstName = firstName
        this.lastName = lastName
    }
}

export {ClassOverrideOriginal,
    ClassOverride,
    FunctionOverride,
    FieldFunctionOverride,
    FieldSet,
    FieldOverride,
    ConstructorFieldOverride
}
