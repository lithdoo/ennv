export const assign = <T extends object>(base:T,...next:(Partial<T>)[])=> Object.assign(base,...next)