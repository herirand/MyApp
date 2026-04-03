import { FastifyInstance } from "fastify";
import { expenseDto } from "../dto/expenseDto";
import expenseService from "../services/expenseService";


async function adminRoutes(app: FastifyInstance) {
	app.post('/expense', expenseDto, expenseService);
}

export default adminRoutes;
