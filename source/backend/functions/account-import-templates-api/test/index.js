const {assert} = require('chai');
const rewire = require('rewire');
const { yamlParse } = require('yaml-cfn');
const index = rewire('../src');

describe('index.js', () => {

    const ACCOUNT_ID = 'xxxxxxxxxxxx';
    const REGION = 'eu-west-1';

    describe('handler', () => {
        const handler = index.__get__('handler')({ACCOUNT_ID, REGION});

        describe('getGlobalTemplate', () => {

            it('should incorporate account id into global template', async () => {
                const actual = await handler({
                    arguments: {},
                    info: {
                        fieldName: 'getGlobalTemplate'
                    }
                });
                const json = yamlParse(actual);
                assert.strictEqual(json.Parameters.WorkloadDiscoveryAccountId.Default, ACCOUNT_ID);
            });

        });

        describe('getRegionalTemplate', () => {

            it('should incorporate account id and region into global template', async () => {
                const actual = await handler({
                    arguments: {},
                    info: {
                        fieldName: 'getRegionalTemplate'
                    }
                });
                const json = yamlParse(actual);
                assert.strictEqual(json.Parameters.WorkloadDiscoveryAccountId.Default, ACCOUNT_ID);
                assert.strictEqual(json.Parameters.  AggregationRegion.Default, REGION);
            });

        });

        describe('unknown field', () => {

            it('should reject payloads with unknown query', async () => {
                const actual = await handler({
                    arguments: {},
                    info: {
                        fieldName: 'foo'
                    }
                }).catch(err => assert.strictEqual(err.message, 'Unknown field, unable to resolve foo.'));;
            });

        });
    });

});