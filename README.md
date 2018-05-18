# Standard Relayer API

0x Protocol is an open standard. Because of this, we expect many independent applications to be built that will want to use the protocol. In order to make it easier for anyone to source liquidity that conforms to the 0x order format, relayers can opt-in to implementing a set of standard relayer API endpoints. In doing so, they allow clients of the standard relayer API to access the orders on their orderbook.

## Current Specifications

* [HTTP](https://github.com/0xProject/standard-relayer-api/blob/master/http/v0.md)
* [WebSocket](https://github.com/0xProject/standard-relayer-api/blob/master/ws/v0.md)

## General Info

### Versioning

TBD

### Testing

Use the [sra-report](https://github.com/0xProject/0x-monorepo/tree/development/packages/sra-report) command line tool to test your API for standard relayer API compliance.

### Schemas

The [JSON schemas](http://json-schema.org/) for the API payloads and responses can be found in [@0xproject/json-schemas](https://github.com/0xProject/0x.js/tree/development/packages/json-schemas). Examples of each payload and response can be found in the library's [test suite](https://github.com/0xProject/0x.js/blob/development/packages/json-schemas/test/schema_test.ts#L1).

```
npm install @0xproject/json-schemas --save
```

You can easily validate your API's payloads and responses using the [@0xproject/json-schemas](https://github.com/0xProject/0x.js/tree/development/packages/json-schemas) package:

```
import {SchemaValidator, ValidatorResult, schemas} from '@0xproject/json-schemas';

const {relayerApiTokenPairsResponseSchema} = schemas;
const validator = new SchemaValidator();

const tokenPairsResponse = {
    ...
};
const validatorResult: ValidatorResult = validator.validate(tokenPairsResponse, relayerApiTokenPairsResponseSchema);
```
