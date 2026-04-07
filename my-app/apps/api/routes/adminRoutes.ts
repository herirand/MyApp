import { FastifyInstance } from "fastify";
import { expenseDto, expenseMeDto, payDto } from "../dto/expenseDto";
import expenseService from "../services/expenseService";
import expenseMeService from "../services/expenseMeService";
import payService from "../services/payService";


async function adminRoutes(app: FastifyInstance) {
	app.post('/expense', expenseDto, expenseService);
	app.get('/expense/me', expenseMeDto, expenseMeService);
	app.get('/pay', payDto, payService);
}

export default adminRoutes;
