import { prisma } from "@myapp/db";
import { FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../lib/errors";


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
			throw new AppError('user not found', 404);
		}

		if (isUser.role === 'ADMIN') {
			throw new AppError('admin only', 403);
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
		if (error instanceof AppError) {
			return reply.status(error.status).send({
				success: false,
				error: error.message,
			});
		}
		return reply.status(401).send({
			success: false,
			error: error ?? "internal server error",
		})
	}
}

export default deleteUserService;
