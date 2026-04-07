import { FastifyInstance } from "fastify";
import { expenseDto, expenseMeDto } from "../dto/expenseDto";
import expenseService from "../services/expenseService";
import expenseMeService from "../services/expenseMeService";


async function adminRoutes(app: FastifyInstance) {
	app.post('/expense', expenseDto, expenseService);
	app.get('/expense/me', expenseMeDto, expenseMeService);
}

export default adminRoutes;
