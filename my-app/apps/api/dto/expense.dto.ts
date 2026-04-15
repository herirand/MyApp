export const expenseDto = {
	schema: {
		tags: ['expense'],
		description: 'Faire des retrait',
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
					createdAd: { type: 'string' },
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

export const expenseMeDto = {
	schema: {
		tags: ['expense'],
		description: 'Recuperer toutes les transaction de depense',
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
				properties: {
					error: { type: 'string' },
				}
			}
		}
	}
}

export const payDto = {
	schema: {
		tags: ['total des soldes'],
		description: 'voir les soldes',
		response: {
			200: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: { type: 'number' },
						total: { type: 'number' }
					}
				}
			},
			500: {
				type: 'object',
				properties: {
					error: { type: 'string' },
				}
			}
		}
	}
}
