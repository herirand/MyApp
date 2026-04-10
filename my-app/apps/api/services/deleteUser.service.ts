import { prisma } from "@myapp/db";
import { FastifyRequest, FastifyReply } from "fastify";


async function deleteUserService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const { username, userId } = request.body as {
			username: string;
			userId: string;
		}

		const isUser = await prisma.user.findFirst({
			where: {
				AND: [{ username }, { userId }]
			}
		})

		if (!isUser) {
			return reply.status(401).send({
				success: false,
				error: 'user not found',
			});
		}

		if (isUser.role === 'ADMIN') {
			return reply.status(401).send({
				success: false,
				error: 'admn only',
			});
		}
		await prisma.$transaction([
			prisma.transaction.deleteMany({
				where: { username: isUser.username },
			}),
			prisma.user.delete({
				where: { id: isUser.id },
			})
		])

		return reply.status(200).send({
			success: true,
			message: 'succes'
		});
	} catch (error) {
		return reply.status(401).send({
			success: false,
			error: error ?? "delete user error",
		})
	}
}

export default deleteUserService;
