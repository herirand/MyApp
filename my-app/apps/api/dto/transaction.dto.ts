export const transactionStudentDto = {
	schema: {
		tags: ['Transaction'],
		description: 'Recuperer mes transactions avec pagination',
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
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								id: { type: 'number' },
								amount: { type: 'number' },
								description: { type: 'string' },
								status: { type: 'string' },
								createdAt: { type: 'string' },
								username: { type: 'string' },
								type: { type: 'string' },
								studentId: { type: 'number' },
							}
						}
					},
					pagination: {
						type: 'object',
						properties: {
							total: { type: 'number' },
							page: { type: 'number' },
							limit: { type: 'number' },
							totalPages: { type: 'number' }
						}
					}
				}
			},
			401: {
				type: 'object',
				properties: {
					error: { type: 'string' },
				}
			}
		}
	}
}


export const transactionAdminDto = {
	schema: {
		tags: ['Transaction'],
		description: 'Ajout des transaction',
		security: [{ bearerAuth: [] }],
		body: {
			type: 'object',
			required: ['username', 'amount', 'description'],
			properties: {
				username: { type: 'string' },
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
					status: { type: 'string' },
					studentId: { type: 'string' },
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
