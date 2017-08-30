# Standard Relayer API Draft

## Endpoints

### GET /v0/token_pairs

#### Response

```
[
    {
        tokenA: {
            symbol: 'ZRX',
            address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
            minAmount: '0',
            maxAmount: '100000000000000000000000',
            precision: 18
        },
        tokenB: {
            symbol: 'WETH',
            address: '0x2956356cd2a2bf3202f771f50d3d14a367b48070',
            minAmount: '0',
            maxAmount: '100000000000000000000',
            precision: 18
        }
    },
    ...
]
```

### GET /v0/orders

#### Parameters

* exchange{string}: returns orders with exchange address
* isExpired{boolean}: returns expired orders (defaults to false)
* isOpen{boolean}: returns open orders (defaults to true)
* isClosed{boolean}: returns closed orders (defaults to false)
* token{string}: returns orders where makerToken or takerToken is token address
* makerToken{string}: returns orders where makerToken is makerToken address
* takerToken{string}: returns orders where takerToken is takerToken address
* tokenA=&tokenB{string}: returns orders where makerToken and takerToken are tokenA or tokenB
* maker{string}: returns orders where maker is maker address
* taker{string}: returns orders where taker is taker address
* trader{string}: returns orders where maker or taker is trader address
* feeRecipient{string}: returns orders where feeRecipient is feeRecipient address
* limit{number}: number of orders to return

#### Response

```
[
    {
        exchange: '',
        maker: '',
        taker: '',
        makerToken: '',
        takerToken: '',
        feeRecipient: '',
        makerTokenAmount: '',
        takerTokenAmount: '',
        makerFee: '',
        takerFee: '',
        expirationTimestampInSec: '',
        salt: '',
        orderHash: '',
        ecdsa: {
            v: ,
            r: '',
            s: ''
        },
        state: 'open'|'expired'|'closed'|'unfunded',
        remainingTakerTokenAmount: '',
        pendingRemainingTakerTokenAmount: ''
    },
    ...
]
```

### GET /v0/order/<orderHash>

#### Response

```
{
    exchange: '',
    maker: '',
    taker: '',
    makerToken: '',
    takerToken: '',
    feeRecipient: '',
    makerTokenAmount: '',
    takerTokenAmount: '',
    makerFee: '',
    takerFee: '',
    expirationTimestampInSec: '',
    salt: '',
    orderHash: '',
    ecdsa: {
        v: ,
        r: '',
        s: ''
    },
    state: 'open'|'expired'|'closed'|'unfunded',
    remainingTakerTokenAmount: '',
    pendingRemainingTakerTokenAmount: ''
},
```

Returns HTTP 404 if no order with specified orderHash is found

### POST /v0/fees

#### Payload

```
{
    maker: '',
    makerToken: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    takerToken: '0x2956356cd2a2bf3202f771f50d3d14a367b48070',
    makerTokenAmount: '30000000000000000000000',
    takerTokenAmount: '40000000000000000000'
}
```

#### Response

```
{
    taker: '',
    feeRecipient: '',
    makerFee: '300000000000000000',
    takerFee: '400000000000000000'
}
```

### POST /v0/order

#### Payload

```
{
    exchange: '',
    maker: '',
    taker: '',
    makerToken: '',
    takerToken: '',
    feeRecipient: '',
    makerTokenAmount: '',
    takerTokenAmount: '',
    makerFee: '',
    takerFee: '',
    expirationTimestampInSec: '',
    salt: '',
    orderHash: '',
    ecdsa: {
        v: ,
        r: '',
        s: ''
    }
}
```

#### Response

```
```
