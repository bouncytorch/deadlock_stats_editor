import { KeyValues3Comments, KeyValues3 } from 'easy-keyvalues';

declare module 'easy-keyvalues' {
    interface ValueBoolean extends IKV3Value {
        Value(): boolean;
        SetValue(v: boolean): this;
        Clone(): ValueBoolean;
    }

    interface ValueInt extends IKV3Value {
        Value(): number;
        SetValue(v: number): this;
        Clone(): ValueInt;
    }

    interface ValueDouble extends IKV3Value {
        Value(): number;
        SetValue(v: number): this;
        Format(): string;
        Clone(): ValueDouble;
    }

    interface ValueFeature extends IKV3Value {
        Feature: string;
        Value(): string;
        SetValue(v: string): this;
        Format(): string;
        Clone(): ValueFeature;
    }

    interface ValueString extends IKV3Value {
        Value(): string;
        SetValue(v: string): this;
        Format(): string;
        Clone(): ValueString;
    }

    interface ValueArray extends IKV3Value {
        Value(): Readonly<IKV3Value[]>;
        SetValue(list: IKV3Value[]): this;
        Append(...kv: IKV3Value[]): this;
        Insert(index: number, ...kv: IKV3Value[]): this;
        Delete(v: IKV3Value): this;
        /**
         * Recursively iterate through all children to find the value that matches the ID
         */
        FindIDTraverse(id: string): KeyValues3 | undefined;
        /**
         * Recursively iterate through all children to find the value that matches the callback
         */
        Search(callback: (v: IKV3Value) => boolean): IKV3Value | undefined;
        Get(index: number): IKV3Value | undefined;
        Format(tab?: string): string;
        /**
         * Convert to javascript array
         */
        toArray(): unknown[];
        Clone(): ValueArray;
    }

    interface ValueObject extends IKV3Value {
        Value(): Readonly<KeyValues3[]>;
        SetValue(list: KeyValues3[]): this;
        Create(key: string, value: IKV3Value): KeyValues3;
        Append(...kv: KeyValues3[]): this;
        Insert(index: number, ...kv: KeyValues3[]): this;
        Delete(v: string | KeyValues3): KeyValues3 | undefined;
        Get(index: number): KeyValues3 | undefined;
        /**
         * Find a KeyValues3
         */
        Find(callback: (kv: KeyValues3, i: number, parent: ValueObject) => boolean): KeyValues3 | undefined;
        /**
         * Find a KeyValues3
         */
        FindKey(key: string): KeyValues3 | undefined;
        /**
         * Find a KeyValues3
         */
        FindAll(callback: (kv: KeyValues3, i: number, parent: ValueObject) => boolean): KeyValues3[];
        /**
         * Find a KeyValues3
         */
        FindAllKeys(...keys: string[]): KeyValues3[];
        /**
         * Recursively iterate through all children to find the value that matches the ID
         */
        FindIDTraverse(id: string): KeyValues3 | undefined;
        /**
         * Recursively iterate through all children to find the value that matches the callback
         */
        Search(callback: (value: IKV3Value) => boolean): IKV3Value | undefined;
        Format(tab?: string): string;
        /**
         * Convert to javascript object
         */
        toObject(): object;
        Clone(): ValueObject;
    }


    interface ValueFeatureObject extends ValueObject {
        Feature: string
    }

    interface ValueNull extends IKV3Value {
        Value(): null;
        Format(): string;
        Clone(): ValueNull;
    }

    export interface IKV3Value {
        Comments: KeyValues3Comments;
        Value(): unknown;
        GetOwner(): KeyValues3 | undefined;
        SetOwner(owner: KeyValues3 | undefined): void;
        IsBoolean(): this is ValueBoolean;
        IsInt(): this is ValueInt;
        IsDouble(): this is ValueDouble;
        IsString(): this is ValueString;
        IsFeature(): this is ValueFeature;
        IsFeatureObject(): this is ValueFeatureObject;
        IsArray(): this is ValueArray;
        IsObject(): this is ValueObject;
        IsNull(): this is ValueNull;
        Format(): string;
        Clone(): IKV3Value;
    }
}
