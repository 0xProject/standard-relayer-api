import {schemas} from '0x-json-schemas';

export const tokenPairsResponse = {
    id: '/TokenPairsResponse',
    type: 'array',
    items: {
        properties: {
            tokenA: {$ref: '/TokenTradeInfo'},
            tokenB: {$ref: '/TokenTradeInfo'},
        },
        required: ['v', 'r', 's'],
        type: 'object',
    },
};

const tokenTradeInfo = {
    id: '/TokenTradeInfo',
    type: 'object',
    properties: {
        address: {$ref: schemas.addressSchema.id},
        symbol: {type: 'string'},
        minAmount: {type: schemas.numberSchema.id},
        maxAmount: {type: schemas.numberSchema.id},
        precision: {type: schemas.numberSchema.id},
    },
    required: ['address'],
};
