# Standard Relayer API

0x Protocol is an open standard. Because of this, we expect many independent applications to be built that will want to use the protocol. In order to make it easier for anyone to source liquidity that conforms to the 0x order format, relayers can opt-in to implementing a set of standard relayer API endpoints. In doing so, they allow clients of the standard relayer API to access the orders on their orderbook.

## Specification Versions

### SRA v0

Made to match [0x Protocol v1](https://github.com/0xProject/0x-protocol-specification/blob/master/v1/v1-whitepaper.pdf)

- [HTTP](https://github.com/0xProject/standard-relayer-api/blob/master/http/v0.md)
- [WebSocket](https://github.com/0xProject/standard-relayer-api/blob/master/ws/v0.md)

### SRA v1

Skipped for naming convention and convenience reasons.

### SRA v2

Made to match [0x Protocol v2](https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md)

- [HTTP](https://github.com/0xProject/standard-relayer-api/blob/master/http/v2.md)
- [WebSocket](https://github.com/0xProject/standard-relayer-api/blob/master/ws/v2.md)
- OpenAPI Spec ([Docs](http://sra-spec.s3-website-us-east-1.amazonaws.com/), [Package](https://github.com/0xProject/0x-monorepo/tree/development/packages/sra-spec))

### SRA v3

Made to match [0x Protocol v3](https://github.com/0xProject/0x-protocol-specification/blob/master/v3/v3-specification.md)

- [HTTP](https://github.com/0xProject/standard-relayer-api/blob/master/http/v3.md)
- [WebSocket](https://github.com/0xProject/standard-relayer-api/blob/master/ws/v3.md)

## General Info

### Versioning

The URL that specifies the SRA API endpoint should end in the version. Here are some examples:

**HTTP**: `https://api.relayer.com/sra/v0/`, `https://api.relayer.com/sra/v2/`

**Websocket**: `wss://api.relayer.com/sra/v0/`, `wss://api.relayer.com/sra/v2/`

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

### Asset Data Encoding

As we now support multiple [token transfer proxies](https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md#assetproxy), the identifier of which proxy to use for the token transfer must be encoded, along with the token information. Each proxy in 0x v2 has a unique identifier. If you're using 0x.js there will be helper methods for this [encoding](https://0xproject.com/docs/0x.js#zeroEx-encodeERC20AssetData) and [decoding](https://0xproject.com/docs/0x.js#zeroEx-decodeAssetProxyId).

The identifier for the Proxy uses a similar scheme to [ABI function selectors](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#function-selector).

```
// ERC20 Proxy ID  0xf47261b0
bytes4(keccak256("ERC20Token(address)"))
// ERC721 Proxy ID 0x02571792
bytes4(keccak256("ERC721Token(address,uint256)"))
```

Asset data is encoded using [ABI encoding](https://solidity.readthedocs.io/en/develop/abi-spec.html).

For example, encoding the ERC20 token contract (address: 0x1dc4c1cefef38a777b15aa20260a54e584b16c48) using the ERC20 Transfer Proxy (id: 0xf47261b0) would be:

```
0xf47261b00000000000000000000000001dc4c1cefef38a777b15aa20260a54e584b16c48
```

Encoding the ERC721 token contract (address: `0x371b13d97f4bf77d724e78c16b7dc74099f40e84`), token id (id: `99`, which hex encoded is `0x63`) and the ERC721 Transfer Proxy (id: `0x02571792`) would be:

```
0x02571792000000000000000000000000371b13d97f4bf77d724e78c16b7dc74099f40e840000000000000000000000000000000000000000000000000000000000000063
```

For more information see [the Asset Proxy](https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md#erc20proxy) section of the v2 spec and the [Ethereum ABI Spec](https://solidity.readthedocs.io/en/develop/abi-spec.html).

### Meta Data in Order Responses

In v2 of the standard relayer API we added the `metaData` field. It is meant to provide a standard place for relayers to put optional, custom or non-standard fields that may of interest to the consumer of the API.

A good example of such a field is `remainingTakerAssetAmount`, which is a convenience field that communicates how much of a 0x order is potentially left to be filled. Unlike the other fields in a 0x order, it is not guaranteed to be correct as it is derived from whatever mechanism the implementer (ie. the relayer) is using. While convenient for prototyping and low stakes situations, we recommend validating the value of the field by checking the state of the blockchain yourself, such as by using [Order Watcher](https://0xproject.com/wiki#0x-OrderWatcher).
