import { FastifyInstance } from "fastify";
import transactionStudentService from "../services/transactionStudent.service";
import { transactionStudentDto } from "../dto/transaction.dto";
import { expenseMeDto, payDto } from "../dto/expense.dto";
import { beneficeMeDto } from "../dto/benefice.dto";
import { authenticate } from "../middlwares/auth.middleware";
import expenseMeService from "../services/expenseMe.service";
import payService from "../services/pay.service";
import beneficeMeService from "../services/beneficeMe.service";
import { newPasswordDto } from "../dto/signup.dto";
import newPasswordService from "../services/newPassword.service";
import spentService from "../services/spent.service";

async function transactionRoutes(app: FastifyInstance) {
	app.get('/transactions/me', { ...transactionStudentDto, preHandler: authenticate }, transactionStudentService);
	app.get('/expense/me', { ...expenseMeDto, preHandler: authenticate }, expenseMeService);
	app.get('/pay', { ...payDto, preHandler: authenticate }, payService);
	app.get('/spent', { ...payDto, preHandler: authenticate }, spentService);
	app.get('/benefice/me', { ...beneficeMeDto, preHandler: authenticate }, beneficeMeService);
	app.post('/newPassword', { ...newPasswordDto, preHandler: authenticate }, newPasswordService);
}

export default transactionRoutes;
