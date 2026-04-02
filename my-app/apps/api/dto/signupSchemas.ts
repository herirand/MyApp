// signupInputSchema, signupSchemaResponse

export const signupInputSchema = {
	schema: {
		body: {
			type: 'object',
			required: ['email', 'username', "id", 'password', 'confirmPassword'],
			properties: {
				email: { type: 'string', format: 'email' },
				username: { type: 'string', minLength: 3, pattern: '^[a-zA-Z0-9_]+$' },
				password: { type: 'string', minLength: 8 },
				confirmPassword: { type: 'string' },
				id: { type: 'string' },
			}

		},
		response: {
			201: {
				type: 'object',
				properties: {
					message: { type: 'string' },
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
};

export const signinInputSchema = {
	schema: {
		body: {
			type: 'object',
			required: ['email', 'password'],
			properties: {
				email: { type: 'string' },
				password: { type: 'string' },
			}
		},
		response: {
			201: {
				type: 'object',
				properties: {
					success: { type: 'boolean' },
					token: { type: 'string' },
					role: { type: 'string' },
					message: { type: 'string' },
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
