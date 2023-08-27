import { JsonArrayType, JsonBooleanType, JsonCompTypeKey, JsonNullType, JsonNumberType, JsonSimpTypeKey, JsonStringType, JsonStructType, JsonTableType, JsonTupleType, JsonType, JsonUnionType } from "./type";


export const json = new class {
    read(json: Object): JsonType {
        if (!json || typeof json !== 'object')
            throw new Error('unknown type')

        const $key: JsonSimpTypeKey | JsonCompTypeKey = (json as any).$key

        if ($key === JsonSimpTypeKey.null) return new JsonNullType()
        if ($key === JsonSimpTypeKey.boolean) return new JsonBooleanType()
        if ($key === JsonSimpTypeKey.string) return new JsonStringType()
        if ($key === JsonSimpTypeKey.number) return new JsonNumberType()

        if ($key === JsonCompTypeKey.array) {
            return Object.assign(new JsonArrayType(), {
                kind: this.read((json as any).kind)
            })
        }

        if ($key === JsonCompTypeKey.table) {
            return Object.assign(new JsonTableType(), {
                kind: this.read((json as any).kind)
            })
        }

        if ($key === JsonCompTypeKey.tuple) {
            return Object.assign(new JsonTupleType(), {
                list: ((json as any).list || []).map(val => this.read(val))
            })
        }

        if ($key === JsonCompTypeKey.union) {
            return Object.assign(new JsonUnionType(), {
                list: ((json as any).list || []).map(val => this.read(val))
            })
        }

        if ($key === JsonCompTypeKey.struct) {
            return Object.assign(new JsonStructType(), {
                fields: ((json as any).fields || []).map(val => [val.name.toString(), this.read(val.type)])
            })
        }

        throw new Error('unknown type')
    }

    write(type: JsonType): Object {
        if (type.key === JsonSimpTypeKey.null) return { $key: JsonSimpTypeKey.null }
        if (type.key === JsonSimpTypeKey.boolean) return { $key: JsonSimpTypeKey.boolean }
        if (type.key === JsonSimpTypeKey.string) return { $key: JsonSimpTypeKey.string }
        if (type.key === JsonSimpTypeKey.number) return { $key: JsonSimpTypeKey.number }


        if (type.key === JsonCompTypeKey.array) return {
            $key: JsonCompTypeKey.array,
            kind: this.write((type as JsonArrayType).kind)
        }

        if (type.key === JsonCompTypeKey.table) return {
            $key: JsonCompTypeKey.array,
            kind: this.write((type as JsonTableType).kind)
        }


        if (type.key === JsonCompTypeKey.tuple) return {
            $key: JsonCompTypeKey.tuple,
            list: (type as JsonTupleType).list.map(val => this.write(val))
        }


        if (type.key === JsonCompTypeKey.union) return {
            $key: JsonCompTypeKey.union,
            list: (type as JsonUnionType).list.map(val => this.write(val))
        }


        if (type.key === JsonCompTypeKey.struct) return {
            $key: JsonCompTypeKey.struct,
            fields: (type as JsonStructType).fields.map(val => ({
                name: val[0], type: this.write(val[1])
            }))
        }


        throw new Error('unknown type')
    }
}