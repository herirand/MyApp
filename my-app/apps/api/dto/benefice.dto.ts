export const beneficeDto = {
	schema: {
		tags: ['benefice'],
		description: 'Ajouter des benefices',
		security: [{ bearerAuth: [] }],
		body: {
			type: 'object',
			required: ['amount', 'description'],
			properties: {
				amount: { type: 'number' },
				description: { type: 'string' },
			}
		},
		response: {
			200: {
				type: 'object',
				properties: {
					id: { type: 'number' },
					amount: { type: 'number' },
					description: { type: 'string' },
					createdAt: { type: 'string' },
				}
			},
			401: {
				type: 'object',
				properties: { error: { type: 'string' } }
			},
			403: {
				type: 'object',
				properties: { error: { type: 'string' } }
			}
		}
	}
}

export const beneficeMeDto = {
	schema: {
		tags: ['benefice'],
		description: 'Recuperer tout les transactions de benefice',
		security: [{ bearerAuth: [] }],
		querystring: {
			type: 'object',
			properties: {
				page: { type: 'integer', minimum: 1, default: 1 },
				limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
			},
			additionalProperties: false,
			required: [],
		},
		response: {
			200: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: { type: 'number' },
						amount: { type: 'number' },
						description: { type: 'string' },
						createdAt: { type: 'string' },
					}
				}
			},
			401: {
				type: 'object',
				properties: { error: { type: 'string' } }
			},
			500: {
				type: 'object',
				properties: { error: { type: 'string' }, }
			}
		}
	}
}
