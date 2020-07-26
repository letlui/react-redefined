declare interface IRedefinedFactory {
    <T extends Function>(overrideId: string): T;
    <T extends (Function | number | string | boolean)>(overrideId: string, value: T): T;
}

declare module 'react-redefined' {
    function registerOverride (overrideId: string, value: any): any
    function getOverride (overrideId: string): { value: any }
    function clearOverrides (): void
    function removeOverride (id: string): void
    const redefined: IRedefinedFactory;
}
