class OverrideStorage {
    overridesMap = new Map();

    getOverride(id) {
      return this.overridesMap.get(id);
    }

    registerOverride(id, override) {
      if (this.overridesMap.has(id)) {
        warn(`extension with same id '${id}' already exists and will be overridden`);
      }

      const extension = {
        value: override,
      };

      this.overridesMap.set(id, extension);
    }

    clearOverrides() {
      this.overridesMap = new Map();
    }

    removeOverride(id) {
      this.overridesMap.delete(id);
    }
}

export const overrideStorage = new OverrideStorage();
export const registerOverride = overrideStorage.registerOverride.bind(overrideStorage);
export const getOverride = overrideStorage.getOverride.bind(overrideStorage);
export const clearOverrides = overrideStorage.clearOverrides.bind(overrideStorage);
export const removeOverride = overrideStorage.removeOverride.bind(overrideStorage);

