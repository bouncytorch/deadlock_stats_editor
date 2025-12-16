import { test, expect } from '@jest/globals';
import { KV3 } from '../../src/util/kv';

const TEST_FILE = `<!-- kv3 encoding:text:version{e21c7f3c-8a33-41c5-9977-a76d3a32aa0d} format:generic:version{7412167c-06e9-4698-aff2-e63eb59037e7} -->
{
    boolValue = false
	intValue = 128
	doubleValue = 64.000000
	stringValue = "hello world"
	featureValue = resource:"particles/items3_fx/star_emblem.vpcf"
	multilineStringValue = """
First line of a multi-line string literal.
Second line of a multi-line string literal.
"""
	arrayValue =
	[
		1,
		2,
        { object = "nested object" }
        ["string", 0, { object = 0 }]
	]
	objectValue =
	{
		n = 5
		s = "foo"
        p = {
            d = "bar"
        }
	}
    objectFeatureValue = test:
    {
		n = 5
		s = "foo"
        p = {
            d = "bar"
        }
	}
}
`;

let TEST_KV: KV3;

describe('parses different value types correctly', () => {
    TEST_KV = KV3.parse(TEST_FILE);

    test('parses booleans', () => expect(TEST_KV.boolValue).toBeFalsy());
    test('parses integers', () => expect(TEST_KV.intValue).toBe(128));
    test('parses doubles', () => expect(TEST_KV.doubleValue).toBe(64.0));
    test('parses strings', () => expect(TEST_KV.stringValue).toBe('hello world'));
    test('parses features', () => expect(TEST_KV.featureValue).toEqual({
        feature: 'resource',
        value: 'particles/items3_fx/star_emblem.vpcf'
    }));
    test('parses multiline strings', () => expect(TEST_KV.multilineStringValue).toBe(`
First line of a multi-line string literal.
Second line of a multi-line string literal.
`));
    test('parses arrays', () => expect(TEST_KV.arrayValue).toEqual([
        1,
        2,
        { object: 'nested object' },
        ['string', 0, { object: 0 }]
    ]));
    test('parses objects', () => expect(TEST_KV.objectValue).toEqual({
        n: 5,
        s: 'foo',
        p: { d: 'bar' }
    }));
    test('parses feature objects', () => expect(TEST_KV.objectFeatureValue).toEqual({
        feature: 'test',
        value: {
            n: 5,
            s: 'foo',
            p: { d: 'bar' }
        }
    }));
});

