// import { prisma } from "../../../prisma/client"

async function signupService(request, reply) {
	const { email, username, id, password, confirmPassword } = request.body as {
		email: string,
		username: string,
		id: string,
		password: string,
		confirmPassword: string,
	};
	console.log(`email: ${email} | username: ${username} | id: ${id} | password: ${password} | confirmPassword: ${confirmPassword}`);

	return reply.code(201).send({
		message: "user ariver "
	});
}

export default signupService;
