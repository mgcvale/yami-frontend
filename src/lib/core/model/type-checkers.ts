
export function isArrayOf<T>(arr: any, typeGuard: (item: any) => item is T): arr is T[] {
    return Array.isArray(arr) && arr.every(typeGuard);
}

export function verifyObject<T>(obj: any, schema: Record<keyof T, string>): obj is T {
    if (obj === null || typeof obj !== 'object') {
        console.error("Validation failed: Input is not a non-null object.");
        return false;
    }

    for (const [key, expectedType] of Object.entries(schema) as [string, string][]) {
        const isOptional = expectedType.endsWith('?');
        const baseType = isOptional ? expectedType.slice(0, -1) : expectedType;
        const value = obj[key];

        if (value == null) {
            if (isOptional) continue;
            console.error(`Validation failed: Property '${key}' is required but missing or null.`);
            return false;
        }

        const actualType = typeof value;
        if (actualType !== baseType) {
            console.error(`Validation failed: Property '${key}' is of type '${actualType}', expected '${baseType}'.`);
            return false;
        }
    }
    return true;
}