import { prisma } from "@myapp/db"
import { passWordHash } from "../utils/utils";

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

	const existingUser = await prisma.user.findFirst({
		where: {
			OR: [
				{ email },
				{ userId: id }
			]
		},
	});

	if (existingUser) {
		console.log("email ou id deja utiliser");
		return reply.code(409).send({
			success: false,
			error: "email ou id deja utiliser",
		});
	}
	const pass = await passWordHash(password);

	const user = await prisma.user.create({
		data: {
			email, username, userId: id, password: pass
		}
	})

	return reply.code(201).send({
		success: true,
		message: "user ariver "
	});
}

export default signupService;
