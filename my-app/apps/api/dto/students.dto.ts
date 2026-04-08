export const allStudentsDto = {
	schema: {
		tags: ['tout les etudiants'],
		description: 'Recuperer tout les etudiants',
		security: [{ bearerAuth: [] }],
		response: {
			200: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: { type: 'number' },
						username: { type: 'string' }
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
