import {schemas} from '0x-json-schemas';

export const orderPayload = {
    id: '/OrderPayload',
    type: 'object',
    properties: {
        signedOrder: {$ref: schemas.orderSchema.id},
        state: {
            enum: ['open', 'expired', 'closed', 'unfunded'],
        },
        remainingTakerTokenAmount: {$ref: schemas.numberSchema.id},
    },
    required: ['signedOrder', 'state', 'remainingTakerTokenAmount'],
};
