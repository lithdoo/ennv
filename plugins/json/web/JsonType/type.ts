


export enum JsonSimpTypeKey {
    null = 'json_null',
    string = 'json_string',
    number = 'json_number',
    boolean = 'json_boolean',
}

export enum JsonCompTypeKey {
    array = 'json_array',
    tuple = 'json_tuple',
    table = 'json_table',
    struct = 'json_struct',
    union = 'json_union'
}

export type JsonType = JsonNullType
    | JsonBooleanType
    | JsonStringType
    | JsonNumberType
    | JsonArrayType
    | JsonTupleType
    | JsonTableType
    | JsonStructType
    | JsonUnionType

export abstract class JsonTypeBase {
    abstract key: JsonCompTypeKey | JsonSimpTypeKey
    equal(other: JsonTypeBase) {
        return this.key === other.key
    }
}

export class JsonNullType extends JsonTypeBase {
    key: JsonSimpTypeKey.null = JsonSimpTypeKey.null
}

export class JsonBooleanType extends JsonTypeBase {
    key: JsonSimpTypeKey.boolean = JsonSimpTypeKey.boolean
}

export class JsonStringType extends JsonTypeBase {
    key: JsonSimpTypeKey.string = JsonSimpTypeKey.string
}

export class JsonNumberType extends JsonTypeBase {
    key: JsonSimpTypeKey.number = JsonSimpTypeKey.number
}

export class JsonArrayType extends JsonTypeBase {
    key: JsonCompTypeKey.array = JsonCompTypeKey.array
    kind: JsonType = new JsonNullType()

    equal(other: JsonTypeBase) {
        if (other.key !== this.key) return false
        const { kind } = other as JsonArrayType
        return this.kind.equal(kind)
    }
}

export class JsonTupleType extends JsonTypeBase {
    key: JsonCompTypeKey.tuple = JsonCompTypeKey.tuple
    list: JsonType[] = []

    equal(other: JsonTypeBase) {
        if (other.key !== this.key) return false
        const { list } = other as JsonTupleType
        if (this.list.length !== list.length) return false
        return this.list.findIndex((v, i) => !v.equal(list[i])) < 0
    }
}

export class JsonTableType extends JsonTypeBase {
    key: JsonCompTypeKey.table = JsonCompTypeKey.table
    kind: JsonType = new JsonNullType()
    equal(other: JsonTypeBase) {
        if (other.key !== this.key) return false
        const { kind } = other as JsonTableType
        return this.kind.equal(kind)
    }
}

export class JsonStructType extends JsonTypeBase {
    key: JsonCompTypeKey.struct = JsonCompTypeKey.struct
    fields: [string, JsonType][]
}

export class JsonUnionType extends JsonTypeBase {
    key: JsonCompTypeKey.union = JsonCompTypeKey.union
    list: JsonType[]
}
