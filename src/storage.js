class OverrideStorage {
    overrides = new Map();

    getOverride (id) {
        debugger
        return this.overrides.get(id);
    }

    registerOverride (id, override) {
        if (this.overrides.has(id)) {
            warn(`extension with same id '${id}' already exists and will be overridden`)
        }

        const extension = {
            value: override
        }

        this.overrides.set(id, extension);
    }

    clearOverrides () {
        this.overrides = new Map();
    }

    removeOverride (id) {
        this.overrides.delete(id)
    }
}

export const overrideStorage = new OverrideStorage();
export const registerOverride = overrideStorage.registerOverride.bind(overrideStorage);
export const getOverride = overrideStorage.getOverride.bind(overrideStorage);
export const clearOverrides = overrideStorage.clearOverrides.bind(overrideStorage);
export const removeOverride = overrideStorage.removeOverride.bind(overrideStorage);

