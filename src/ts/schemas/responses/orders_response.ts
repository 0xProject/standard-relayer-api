import {schemas} from '0x-json-schemas';
import {orderPayload} from '../payloads/order_payload';

export const ordersResponse = {
    id: '/OrdersResponse',
    type: 'array',
    items: {$ref: '/OrderResponse'},
};

export const orderResponse = {
    id: '/OrderResponse',
    allOf: [
        { $ref: '/OrderResponse' },
        {
            properties: {
                pending: {
                    type: 'object',
                    properties: {
                        filledAmount: {$ref: schemas.numberSchema.id},
                        cancelAmount: {$ref: schemas.numberSchema.id},
                    },
                },
            },
        },
    ],
};
