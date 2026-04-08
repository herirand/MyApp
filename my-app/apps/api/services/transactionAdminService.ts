import { prisma } from "@myapp/db";
import { FastifyRequest, FastifyReply } from "fastify";

async function transactionAdminService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const { amount, description, username } = request.body as any;

		const existingUser = await prisma.user.findFirst({
			where: {
				username
			}
		})

		if (!existingUser) {
			return reply.status(401).send({
				success: false,
				error: "Veuillez verifier le ID de l'utilisateur"
			})
		}

		await prisma.user.update({
			where: { id: existingUser.id },
			data: {
				balance: { increment: Number(amount) }
			},
		});

		await prisma.global.upsert({
			where: { id: 1 },
			update: { total: { increment: Number(amount) } },
			create: { id: 1, total: Number(amount) },
		});

		const newTransaction = await prisma.transaction.create({
			data: {
				amount,
				description,
				studentId: existingUser.id,
				username,
				type: 'DEPOSIT',
				status: 'CONFIRMED'
			}
		});

		return reply.send(newTransaction);
	} catch (error) {
		return reply.code(401).send({
			success: false,
			error: error ?? "token invalide",
		});
	}
}

export default transactionAdminService;
