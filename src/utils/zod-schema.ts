import { z } from 'zod'

export type SchemaPartial<T extends z.ZodTypeAny> = z.ZodType<Partial<z.infer<T>>>
export type PartialData<T extends z.ZodTypeAny> = z.infer<SchemaPartial<T>>
export type SchemaWithId<T extends z.ZodTypeAny> = z.ZodType<z.infer<T> & { id: string }>
export type DataWithId<T extends z.ZodTypeAny> = z.infer<SchemaWithId<T>>

export function addIdToSchema<T extends z.ZodTypeAny>(schema: T): SchemaWithId<T> {
    if (!(schema instanceof z.ZodObject)) {
        throw new Error('addIdToSchema only supports ZodObject schemas')
    }

    return schema.extend({
        id: z.string()
    }) as SchemaWithId<T>
}

export function makeSchemaPartial<T extends z.ZodTypeAny>(schema: T): SchemaPartial<T> {
    if (schema instanceof z.ZodObject) {
        return schema.partial()
    }

    // TODO: Add support for Array, Union, and other schema types

    return schema
}