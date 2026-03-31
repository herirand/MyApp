export const transactionStudentDto = {
	schema: {
		tags: ['Transaction'],
		description: 'Recuperer mes transaction ',
		security: [{ bearerAuth: [] }],
		response: {
			200: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: { type: 'number' },
						amount: { type: 'number' },
						description: { type: 'string' },
						status: { type: 'string' },
						createdAt: { type: 'string' },
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
			required: ['studentId', 'amount', 'description'],
			properties: {
				studentId: { type: 'number' },
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
