import { FastifyRequest, FastifyReply } from "fastify";

export type TokenPayload = {
	id: number;
	role: string;
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
	try {
		const decoded = await request.jwtVerify<TokenPayload>();
		request.user = decoded;
	} catch (error) {
		return reply.code(401).send({
			success: false,
			error: "Token invalide ou manquant",
		});
	}
}
