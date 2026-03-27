import { prisma } from "@myapp/db"

async function signupService(request, reply) {
	const { email, username, id, password, confirmPassword } = request.body as {
		email: string,
		username: string,
		id: string,
		password: string,
		confirmPassword: string,
	};
	console.log(`email: ${email} | username: ${username} | id: ${id} | password: ${password} | confirmPassword: ${confirmPassword}`);

	if (password != confirmPassword) {
		return reply.code(400).send({
			success: false,
			error: "password don't match",
		})
	}

	const existingUser = await prisma.user.findUnique({
		where: { email },
	});

	if (existingUser) {
		console.log("email deja utiliser");
		return reply.code(409).send({
			success: false,
			error: "email deja utiliser",
		});
	}

	const user = await prisma.user.create({
		data: {
			email, username, password
		}
	})

	return reply.code(201).send({
		message: "user ariver "
	});
}

export default signupService;
