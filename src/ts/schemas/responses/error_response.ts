import {schemas} from '0x-json-schemas';

export const errorResponse = {
    id: '/ErrorResponse',
    type: 'object',
    properties: {
        code: {$ref: schemas.numberSchema.id},
        reason: {type: 'string'},
        validationErrors: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
    required: ['code', 'reason'],
};
