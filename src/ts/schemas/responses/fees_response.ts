import {schemas} from '0x-json-schemas';

export const feesResponse = {
    id: '/FeesResponse',
    type: 'object',
    properties: {
        makerFee: {$ref: schemas.numberSchema.id},
        takerFee: {$ref: schemas.numberSchema.id},
        feesRecipient: {$ref: schemas.addressSchema.id},
        takerToSpecify: {$ref: schemas.addressSchema.id},
    },
    required: ['makerFee', 'takerFee'],
};
