export const DEFAULT_WARN = 'warning message not set or obfuscated if this is a production build'
export const DEFAULT_ERROR = 'error message not set or obfuscated if this is a production build'
export const MESSAGE_PREFIX = '[react-redefined] '

export function warn (message) {
    console.warn(MESSAGE_PREFIX + (message || DEFAULT_WARN));
}

export function error (message) {
    throw new Error(MESSAGE_PREFIX + (message || DEFAULT_ERROR));
}

export function invariant (condition, message) {
    if (condition) {
        error(message);
    }
}
