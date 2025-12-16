import { KeyValues3, IKV3Value } from 'easy-keyvalues';

type Feature = {
    feature: string,
    value: string
}

type FeatureObject = {
    feature: string,
    value: KV3
}

type KV3Value = KV3Value[] | object | Feature | FeatureObject | string | number | boolean | null | undefined

export class KV3 {
    [x: string]: KV3Value | KV3Value[];
    #KVObject;

    private constructor(kv: KeyValues3) {
        this.#KVObject = kv;

        return new Proxy(this, {
            get(target, prop) {
                const obj = target.#KVObject.FindKey(String(prop));
                if (!obj)
                    return undefined;

                const objValue = obj.GetValue();
                return target.#unwrapKValue(objValue);
            },

            ownKeys(target) {
                const obj = target.#KVObject.GetValue().Value() as Readonly<KeyValues3>[];
                return obj.map(v => v.Key);
            },

            getOwnPropertyDescriptor(target, prop) {
                const obj = target.#KVObject.FindKey(String(prop));
                if (!obj)
                    return undefined;

                const objValue = target.#unwrapKValue(obj.GetValue());
                return {
                    configurable: true,
                    enumerable: true,
                    writable: false,
                    objValue
                };
            }
        });
    }

    #unwrapKValue(objValue: IKV3Value): KV3Value | KV3Value[] {
        if (objValue.IsArray())
            return objValue.Value().map(v => this.#unwrapKValue(v));

        else if (objValue.IsFeatureObject())
            return {
                feature: objValue.Feature,
                value: Object.fromEntries(
                    objValue.Value().map(v => [
                        v.Key,
                        this.#unwrapKValue(v.GetValue())
                    ])
                )
            };

        else if (objValue.IsObject())
            return Object.fromEntries(
                objValue.Value().map(v => [
                    v.Key,
                    this.#unwrapKValue(v.GetValue())
                ])
            );

        else if (objValue.IsFeature())
            return {
                feature: objValue.Feature,
                value: objValue.Value()
            } as Feature;

        else if (
            objValue.IsBoolean()
            || objValue.IsDouble()
            || objValue.IsInt()
            || objValue.IsString()
            || objValue.IsNull()
        ) return objValue.Value();
    }

    static parse(kvstring: string) {
        return new KV3(KeyValues3.Parse(kvstring));
    }
}

