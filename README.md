# Standard Relayer API V0 Draft

0x Protocol is an open standard. Because of this, we expect many independent applications to be built that will want to use the protocol. In order to make it easier for anyone to source liquidity that conforms to the 0x order format, relayers can opt-in to implementing a set of standard relayer API endpoints. In doing so, they allow clients of the standard relayer API to access the orders on their orderbook.

## General

### Schemas

The [JSON schemas](http://json-schema.org/) for the API payloads and responses can be found in [0x-json-schema](https://github.com/0xProject/json-schemas). Examples of each payload and response can be found in the library's [test suite](https://github.com/0xProject/json-schemas/blob/master/test/schema_test.ts#L379).

```
npm install 0x-json-schema
```

You can easily validate your API's payloads and responses using [0x-json-schema](https://github.com/0xProject/json-schemas):

```
import {SchemaValidator, ValidatorResult, schemas} from '0x-json-schemas';

const {relayerApiTokenPairsResponseSchema} = schemas;
const validator = new SchemaValidator();

const tokenPairsResponse = {
    ...
};
const validatorResult: ValidatorResult = validator.validate(tokenPairsResponse, relayerApiTokenPairsResponseSchema);
```

### Misc.

- All token amounts are sent in amounts of the smallest level of precision (base units). (e.g if a token has 18 decimal places, selling 1 token would show up as selling `'1000000000000000000'` units by this API).
- All addresses are sent as lower-case (non-checksummed) Ethereum addresses with the `0x` prefix.
- `CLOSED` state means the order has been entirely filled/canceled.

## Endpoints

### GET /v0/token_pairs

Retrieves a list of available token pairs and the information required to trade them.

#### Response

[See response schema](https://github.com/0xProject/json-schemas/blob/master/schemas/relayer_api_token_pairs_response_schema.ts#L1)

```
[
    {
        "tokenA": {
            "address": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
            "symbol": "MKR",
            "decimals": 18,
            "minAmount": "0",
            "maxAmount": "10000000000000000000",
            "precision": 5
        },
        "tokenB": {
            "address": "0xef7fff64389b814a946f3e92105513705ca6b990",
            "symbol": "GLM",
            "decimals": 18,
            "minAmount": "0",
            "maxAmount": "50000000000000000000",
            "precision": 5
        }
    }
    ...
]
```

- `precision` - the desired price precision a Relayer would like to support within their orderbook
- `minAmount` - the minimum trade amount the Relayer will accept
- `maxAmount` - the maximum trade amount the Relayer will accept

### GET /v0/orders

Retrieves a list of orders given query parameters. Default is all open orders.

#### Parameters

* exchangeContractAddress [string]: returns orders created for this exchange address
* isExpired [boolean]: returns expired orders (defaults to false)
* isOpen [boolean]: returns open orders (defaults to true)
* isClosed [boolean]: returns closed orders (defaults to false)
* token [string]: returns orders where makerTokenAddress or takerTokenAddress is token address
* makerTokenAddress [string]: returns orders with specified makerTokenAddress
* takerTokenAddress [string]: returns orders with specified makerTokenAddress
* tokenA=&tokenB [string]: returns orders where makerTokenAddress and takerTokenAddress are tokenA or tokenB
* maker [string]: returns orders where maker is maker address
* taker [string]: returns orders where taker is taker address
* trader [string]: returns orders where maker or taker is trader address
* feeRecipient [string]: returns orders where feeRecipient is feeRecipient address
* limit [number]: number of orders to return

#### Response

[See response schema](https://github.com/0xProject/json-schemas/blob/master/schemas/relayer_api_order_response_schema.ts#L1)

```
[
    {
        "signedOrder": {
            "maker": "0x9e56625509c2f60af937f23b7b532600390e8c8b",
            "taker": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
            "makerFee": "100000000000000",
            "takerFee": "200000000000000",
            "makerTokenAmount": "10000000000000000",
            "takerTokenAmount": "20000000000000000",
            "makerTokenAddress": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
            "takerTokenAddress": "0xef7fff64389b814a946f3e92105513705ca6b990",
            "salt": "256",
            "feeRecipient": "0xB046140686d052ffF581f63f8136CcE132e857dA",
            "exchangeContractAddress": "0x12459C951127e0c374FF9105DdA097662A027093",
            "expirationUnixTimestampSec": "42",
            "ecSignature": {
                "v": 27,
                "r": "0x61a3ed31b43c8780e905a260a35faefcc527be7516aa11c0256729b5b351bc33",
                "s": "0x40349190569279751135161d22529dc25add4f6069af05be04cacbda2ace2254"
            }
        },
        "state": "OPEN",
        "remainingTakerTokenAmount": "1000000000000000000"
    }
    ...
]
```

- `state` - the state of the order. The order is `OPEN` until completely filled/canceled.

### GET /v0/order/[orderHash]

Retrieves a specific order by orderHash.

#### Response

[See response schema](https://github.com/0xProject/json-schemas/blob/master/schemas/relayer_api_order_response_schema.ts#L7)


```
{
    "signedOrder": {
        "maker": "0x9e56625509c2f60af937f23b7b532600390e8c8b",
        "taker": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
        "makerFee": "100000000000000",
        "takerFee": "200000000000000",
        "makerTokenAmount": "10000000000000000",
        "takerTokenAmount": "20000000000000000",
        "makerTokenAddress": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
        "takerTokenAddress": "0xef7fff64389b814a946f3e92105513705ca6b990",
        "salt": "256",
        "feeRecipient": "0xB046140686d052ffF581f63f8136CcE132e857dA",
        "exchangeContractAddress": "0x12459C951127e0c374FF9105DdA097662A027093",
        "expirationUnixTimestampSec": "42",
        "ecSignature": {
            "v": 27,
            "r": "0x61a3ed31b43c8780e905a260a35faefcc527be7516aa11c0256729b5b351bc33",
            "s": "0x40349190569279751135161d22529dc25add4f6069af05be04cacbda2ace2254"
        }
    },
    "state": "OPEN",
    "pending": {
        "fillAmount": "50000000000000000",
        "cancelAmount": "50000000000000000"
    },
    "remainingTakerTokenAmount": "10000000000000000"
}
```

Returns HTTP 404 if no order with specified orderHash was found.

### POST /v0/fees

Returns the only acceptable fees (in ZRX) for the specified order parameters

#### Payload

[See payload schema](https://github.com/0xProject/json-schemas/blob/master/schemas/relayer_api_fees_payload_schema.ts)


```
{
    "maker": "0x9e56625509c2f60af937f23b7b532600390e8c8b",
    "taker": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
    "makerTokenAddress": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
    "takerTokenAddress": "0xef7fff64389b814a946f3e92105513705ca6b990",
    "makerTokenAmount": "10000000000000000000",
    "takerTokenAmount": "30000000000000000000"
}
```

#### Response

[See response schema](https://github.com/0xProject/json-schemas/blob/master/schemas/relayer_api_fees_response_schema.ts)

```
{
    "feeRecipient": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
    "takerToSpecify": "0xef7fff64389b814a946f3e92105513705ca6b990",
    "makerFee": "10000000000000000",
    "takerFee": "30000000000000000"
}
```

### POST /v0/order

Submit an order to the relayer.

#### Payload

[See payload schema](https://github.com/0xProject/json-schemas/blob/master/schemas/order_schemas.ts#L28)

```
{
    "maker": "0x9e56625509c2f60af937f23b7b532600390e8c8b",
    "taker": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
    "makerFee": "100000000000000",
    "takerFee": "200000000000000",
    "makerTokenAmount": "10000000000000000",
    "takerTokenAmount": "20000000000000000",
    "makerTokenAddress": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
    "takerTokenAddress": "0xef7fff64389b814a946f3e92105513705ca6b990",
    "salt": "256",
    "feeRecipient": "0xB046140686d052ffF581f63f8136CcE132e857dA",
    "exchangeContractAddress": "0x12459C951127e0c374FF9105DdA097662A027093",
    "expirationUnixTimestampSec": "42",
    "ecSignature": {
        "v": 27,
        "r": "0x61a3ed31b43c8780e905a260a35faefcc527be7516aa11c0256729b5b351bc33",
        "s": "0x40349190569279751135161d22529dc25add4f6069af05be04cacbda2ace2254"
    }
}
```

#### Response

###### Success Response

Returns HTTP 201 upon success.

###### Error Response

Error response will be sent with a non-2xx HTTP status code

[See error response schema](https://github.com/0xProject/json-schemas/blob/master/schemas/relayer_api_error_response_schema.ts)

```
{
    "code": 101,
    "reason": "Validation failed",
    "validationErrors": [
        {
            "field": "maker",
            "code": 1002,
            "reason": "Invalid address"
        }
    ]
}
```

General error codes:

```
100 - Validation Failed
101 - Malformed JSON
102 - Order submission disabled
103 - Throttled
```

Validation error codes:

```
1000 - Required field
1001 - Incorrect format
1002 - Invalid address
1003 - Address not supported
1004 - Value out of range
1005 - Invalid ECDSA or Hash
1006 - Unsupported option
```
