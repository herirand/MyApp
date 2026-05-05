export const newPasswordDto = {
	schema: {
		tags: ['password'],
		description: 'changer les mots de pass',
		security: [{ bearerAuth: [] }],
		body: {
			type: 'object',
			required: ['currentPassword', 'newPassword', 'confirmPassword'],
			properties: {
				currentPassword: { type: 'string' },
				newPassword: { type: 'string', minLength: 8 },
				confirmPassword: { type: 'string' },
			}
		},
		response: {
			200: { type: 'object', properties: { message: { type: 'string' } } },
			400: { type: 'object', properties: { error: { type: 'string' } } },
			401: { type: 'object', properties: { error: { type: 'string' } } },
			429: { type: 'object', properties: { error: { type: 'string' } } },
			500: { type: 'object', properties: { error: { type: 'string' } } },
		}
	}
}

export const forgotPasswordSchema = {
	schema: {
		body: {
			type: 'object',
			required: ['email', 'userId', 'newPassword', 'confirmPassword'],
			properties: {
				email: { type: 'string' },
				userId: { type: 'string' },
				newPassword: { type: 'string', minLength: 8 },
				confirmPassword: { type: 'string', minLength: 8 },
			}
		},
		response: {
			201: {
				type: 'object',
				properties: {
					success: { type: 'boolean' },
					message: { type: 'string' },
				}
			},
			400: { type: 'object', properties: { error: { type: 'string' } } },
			401: { type: 'object', properties: { error: { type: 'string' } } },
			429: { type: 'object', properties: { error: { type: 'string' } } },
			500: { type: 'object', properties: { error: { type: 'string' } } },
		}
	}
}
