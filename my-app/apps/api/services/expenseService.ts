import { prisma } from "@myapp/db";
import { FastifyReply, FastifyRequest } from "fastify";

type TokenPayload = {
	id: number;
	role: string;
}


async function expenseService(request: FastifyRequest, reply: FastifyReply) {
	try {
		const decodedToken = await request.jwtVerify<TokenPayload>()

		if (decodedToken.role !== 'ADMIN') {
			return reply.status(409).send({ error: "admin only" });
		}

		const { amount, description } = request.body as {
			amount: number,
			description: string,
		}

		if (amount < 0) {
			return reply.status(400).send({
				success: false,
				error: 'valuer negative'
			});
		}

		const globalTotal = await prisma.global.findFirst();
		const currentTotal = globalTotal?.total ?? 0;
		const newTotal = currentTotal - amount;

		await prisma.global.update({
			where: { id: globalTotal?.id },
			data: { total: newTotal }
		})

		const newExpense = await prisma.expense.create({
			data: { amount, description }
		})

		return reply.send(newExpense);

	} catch (error) {
		return reply.status(401).send({
			success: false,
			error: error ?? "erreur lors du retrait",
		})
	}

}

export default expenseService;
