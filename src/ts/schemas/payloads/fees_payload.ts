import {schemas} from '0x-json-schemas';

export const feesPayload = {
    id: '/FeesPayload',
    type: 'object',
    properties: {
        maker: {type: 'string'},
        taker: {type: 'string'},
        makerToken: {$ref: schemas.addressSchema.id},
        takerToken: {$ref: schemas.addressSchema.id},
        makerTokenAmount: {$ref: schemas.numberSchema.id},
        takerTokenAmount: {$ref: schemas.numberSchema.id},
    },
    required: ['makerToken', 'takerToken', 'makerTokenAmount', 'takerTokenAmount'],
};
