# Standard Relayer API V0 Draft

0x Protocol is an open standard. Because of this, we expect many independent applications to be built that will want to use the protocol. In order to make it easier for anyone to source liquidity that conforms to the 0x order format, relayers can opt-in to implementing a set of standard relayer API endpoints. In doing so, they allow clients of the standard relayer API to access the orders on their orderbook.

## General Guidance

### Schemas

The [JSON schemas](http://json-schema.org/) for the API payloads and responses can be found in [0x-json-schema](https://github.com/0xProject/json-schemas). Examples of each payload and response can be found in the library's [test suite](https://github.com/0xProject/json-schemas/blob/master/test/schema_test.ts#L379).

```
npm install 0x-json-schema --save
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

### Pagination

Requests that return multiple items should respond to the **?page** and **?per_page** parameters. For example:

```
curl https://api.example-relayer.com/v0/token_pairs?page=3&per_page=20
```
Page numbering should be 1-indexed, not 0-indexed.

These requests include the `token_pairs`, `orders`, and `order_book` endpoints.

### Rate Limits

Rate limit guidance for clients can be optionally returned in the response headers:

| Header Name           | Description
| --------------------- | ---------------------------------------------------------------------------- |
| X-RateLimit-Limit     | The maximum number of requests you're permitted to make per hour.            |
| X-RateLimit-Remaining | The number of requests remaining in the current rate limit window.           |
| X-RateLimit-Reset     | The time at which the current rate limit window resets in UTC epoch seconds. |

For example:

```
curl -i https://api.example-relayer.com/v0/token_pairs
HTTP/1.1 200 OK
Date: Mon, 20 Oct 2017 12:30:06 GMT
Status: 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 56
X-RateLimit-Reset: 1372700873
```

When a rate limit is exceeded, a status of **429 Too Many Requests** should be returned.

### Errors

Unless the spec defines otherwise, errors to bad requests should respond with HTTP 4xx or status codes.

#### Common error codes

| Code | Reason
| ---- | --------------------------------------- |
| 400  | Bad Request – Invalid request format    |
| 404  | Not found                               |
| 429  | Too many requests - Rate limit exceeded |
| 500  | Internal Server Error                   |
| 501  | Not Implemented                         |


### Misc.

- All requests and responses should be of **application/json** content type
- All token amounts are sent in amounts of the smallest level of precision (base units). (e.g if a token has 18 decimal places, selling 1 token would show up as selling `'1000000000000000000'` units by this API).
- All addresses are sent as lower-case (non-checksummed) Ethereum addresses with the `0x` prefix.

## REST API

### GET /v0/token_pairs

Retrieves a list of available token pairs and the information required to trade them. This endpoint should be paginated.

#### Parameters

* tokenA=&tokenB [string]: returns token pairs that contain tokenA and tokenB (in any order). Setting only tokenA or tokenB returns pairs filtered by that token only

#### Response

[See response schema](https://github.com/0xProject/json-schemas/blob/master/schemas/relayer_api_token_pairs_response_schema.ts#L1)

```
[
    {
        "tokenA": {
            "address": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
            "minAmount": "0",
            "maxAmount": "10000000000000000000",
            "precision": 5
        },
        "tokenB": {
            "address": "0xef7fff64389b814a946f3e92105513705ca6b990",
            "minAmount": "0",
            "maxAmount": "50000000000000000000",
            "precision": 5
        }
    },
    ...
]
```

- `address` - address of the token
- `minAmount` - the minimum trade amount the relayer will accept
- `maxAmount` - the maximum trade amount the relayer will accept
- `precision` - the desired price precision a relayer would like to support within their orderbook

### GET /v0/orders

Retrieves a list of orders given query parameters. Default is all open orders. This endpoint should be paginated

#### Parameters

* exchangeContractAddress [string]: returns orders created for this exchange address
* tokenAddress [string]: returns orders where makerTokenAddress or takerTokenAddress is token address
* makerTokenAddress [string]: returns orders with specified makerTokenAddress
* takerTokenAddress [string]: returns orders with specified makerTokenAddress
* tokenA=&tokenB [string]: returns orders where makerTokenAddress and takerTokenAddress are tokenA or tokenB
* maker [string]: returns orders where maker is maker address
* taker [string]: returns orders where taker is taker address
* trader [string]: returns orders where maker or taker is trader address
* feeRecipient [string]: returns orders where feeRecipient is feeRecipient address

If both makerTokenAddress and takerTokenAddress are specified, returned orders will be sorted by price determined by (takerTokenAmount/makerTokenAmount) in ascending order. By default, orders returned by this endpoint are unsorted.

#### Response

[See response schema](https://github.com/0xProject/json-schemas/blob/master/schemas/signed_orders_schema.ts#L1)

```
[
    {
        "exchangeContractAddress": "0x12459c951127e0c374ff9105dda097662a027093",
        "maker": "0x9e56625509c2f60af937f23b7b532600390e8c8b",
        "taker": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
        "makerTokenAddress": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
        "takerTokenAddress": "0xef7fff64389b814a946f3e92105513705ca6b990",
        "feeRecipient": "0xb046140686d052fff581f63f8136cce132e857da",
        "makerTokenAmount": "10000000000000000",
        "takerTokenAmount": "20000000000000000",
        "makerFee": "100000000000000",
        "takerFee": "200000000000000",
        "expirationUnixTimestampSec": "42",
        "salt": "67006738228878699843088602623665307406148487219438534730168799356281242528500",
        "ecSignature": {
            "v": 27,
            "r": "0x61a3ed31b43c8780e905a260a35faefcc527be7516aa11c0256729b5b351bc33",
            "s": "0x40349190569279751135161d22529dc25add4f6069af05be04cacbda2ace2254"
        }
    },
    ...
]
```

### GET /v0/order/[orderHash]

Retrieves a specific order by orderHash.

#### Response

[See response schema](https://github.com/0xProject/json-schemas/blob/master/schemas/order_schemas.ts#L24)


```
{
    "exchangeContractAddress": "0x12459c951127e0c374ff9105dda097662a027093",
    "maker": "0x9e56625509c2f60af937f23b7b532600390e8c8b",
    "taker": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
    "makerTokenAddress": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
    "takerTokenAddress": "0xef7fff64389b814a946f3e92105513705ca6b990",
    "feeRecipient": "0xb046140686d052fff581f63f8136cce132e857da",
    "makerTokenAmount": "10000000000000000",
    "takerTokenAmount": "20000000000000000",
    "makerFee": "100000000000000",
    "takerFee": "200000000000000",
    "expirationUnixTimestampSec": "42",
    "salt": "67006738228878699843088602623665307406148487219438534730168799356281242528500",
    "ecSignature": {
        "v": 27,
        "r": "0x61a3ed31b43c8780e905a260a35faefcc527be7516aa11c0256729b5b351bc33",
        "s": "0x40349190569279751135161d22529dc25add4f6069af05be04cacbda2ace2254"
    }
}
```

Returns HTTP 404 if no order with specified orderHash was found.

### GET /v0/order_book

#### Parameters

* baseTokenAddress [string]: address of token designated as the baseToken in the [currency pair calculation](https://en.wikipedia.org/wiki/Currency_pair) of price (required).
* quoteTokenAddress [string]: address of token designated as the quoteToken in the currency pair calculation of price (required).

Bids will be sorted in descending order by price, and asks will be sorted in ascending order by price. Within the price sorted orders, the orders are further sorted first by total fees, then by expiration in ascending order.

#### Response

```
{
    "bids": [
        {
            "exchangeContractAddress": "0x12459c951127e0c374ff9105dda097662a027093",
            "maker": "0x9e56625509c2f60af937f23b7b532600390e8c8b",
            "taker": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
            "makerTokenAddress": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
            "takerTokenAddress": "0xef7fff64389b814a946f3e92105513705ca6b990",
            "feeRecipient": "0xb046140686d052fff581f63f8136cce132e857da",
            "makerTokenAmount": "10000000000000000",
            "takerTokenAmount": "20000000000000000",
            "makerFee": "100000000000000",
            "takerFee": "200000000000000",
            "expirationUnixTimestampSec": "42",
            "salt": "67006738228878699843088602623665307406148487219438534730168799356281242528500",
            "ecSignature": {
                "v": 27,
                "r": "0x61a3ed31b43c8780e905a260a35faefcc527be7516aa11c0256729b5b351bc33",
                "s": "0x40349190569279751135161d22529dc25add4f6069af05be04cacbda2ace2254"
            }
        },
        ...
    ],
    "asks": [
        {
            "exchangeContractAddress": "0x12459c951127e0c374ff9105dda097662a027093",
            "maker": "0x9e56625509c2f60af937f23b7b532600390e8c8b",
            "taker": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
            "makerTokenAddress": "0xef7fff64389b814a946f3e92105513705ca6b990",
            "takerTokenAddress": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
            "feeRecipient": "0xb046140686d052fff581f63f8136cce132e857da",
            "makerTokenAmount": "22000000000000000",
            "takerTokenAmount": "10000000000000000",
            "makerFee": "100000000000000",
            "takerFee": "200000000000000",
            "expirationUnixTimestampSec": "632",
            "salt": "54515451557974875123697849345751275676157243756715784155226239582178",
            "ecSignature": {
                "v": 27,
                "r": "0x61a3ed31b43c8780e905a260a35faefcc527be7516aa11c0256729b5b351bc33",
                "s": "0x40349190569279751135161d22529dc25add4f6069af05be04cacbda2ace2254"
            }
        },
        ...
    ]
}
```

### POST /v0/fees

Given an unsigned order without the fee-related properties, returns the required `feeRecipient`, `makerFee`, and `takerFee` of that order.

#### Payload

[See payload schema](https://github.com/0xProject/json-schemas/blob/master/schemas/relayer_api_fees_payload_schema.ts)

```
{
    "exchangeContractAddress": "0x12459c951127e0c374ff9105dda097662a027093",
    "maker": "0x9e56625509c2f60af937f23b7b532600390e8c8b",
    "taker": "0x0000000000000000000000000000000000000000",
    "makerTokenAddress": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
    "takerTokenAddress": "0xef7fff64389b814a946f3e92105513705ca6b990",
    "makerTokenAmount": "10000000000000000",
    "takerTokenAmount": "20000000000000000",
    "expirationUnixTimestampSec": "42",
    "salt": "67006738228878699843088602623665307406148487219438534730168799356281242528500"
}
```

#### Response

[See response schema](https://github.com/0xProject/json-schemas/blob/master/schemas/relayer_api_fees_response_schema.ts)

```
{
    "feeRecipient": "0xb046140686d052fff581f63f8136cce132e857da",
    "makerFee": "100000000000000",
    "takerFee": "200000000000000"
}
```

### POST /v0/order

Submit a signed order to the relayer.

#### Payload

[See payload schema](https://github.com/0xProject/json-schemas/blob/master/schemas/order_schemas.ts#L24)

```
{
    "exchangeContractAddress": "0x12459c951127e0c374ff9105dda097662a027093",
    "maker": "0x9e56625509c2f60af937f23b7b532600390e8c8b",
    "taker": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
    "makerTokenAddress": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
    "takerTokenAddress": "0xef7fff64389b814a946f3e92105513705ca6b990",
    "feeRecipient": "0xb046140686d052fff581f63f8136cce132e857da",
    "makerTokenAmount": "10000000000000000",
    "takerTokenAmount": "20000000000000000",
    "makerFee": "100000000000000",
    "takerFee": "200000000000000",
    "expirationUnixTimestampSec": "42",
    "salt": "67006738228878699843088602623665307406148487219438534730168799356281242528500",
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
