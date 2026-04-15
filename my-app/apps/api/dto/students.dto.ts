export const allStudentsDto = {
	schema: {
		tags: ['user'],
		description: 'Recuperer tout les etudiants',
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
						username: { type: 'string' },
						userId: { type: 'number' }
					}
				}
			},
			401: {
				type: 'object',
				properties: { error: { type: 'string' } }
			}
		}
	}
}

export const deleteUserDto = {
	schema: {
		tags: ['user'],
		description: 'effacer un utilisateur',
		security: [{ bearerAuth: [] }],
		body: {
			type: 'object',
			required: ['username', 'userId'],
			properties: {
				username: { type: 'string' },
				userId: { type: 'string' },
			}
		},
		response: {
			201: {
				type: 'object',
				properties: { message: { type: 'string' } },
			},
			404: {
				type: 'object',
				properties: { error: { type: 'string' } },
			},
			403: {
				type: 'object',
				properties: { error: { type: 'string' } },
			},
			500: {
				type: 'object',
				properties: { error: { type: 'string' } },
			}
		}
	}
}
