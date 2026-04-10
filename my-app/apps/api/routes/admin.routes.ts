import { FastifyInstance } from "fastify";
import { expenseDto } from "../dto/expense.dto";
import expenseService from "../services/expense.service";
import transactionAdminService from "../services/transactionAdmin.service";
import beneficeService from "../services/beneficeAdmin.service";
import allStudentsService from "../services/allStudents.service";
import deleteUserService from "../services/deleteUser.service";
import createUserService from "../services/createUser.service";
import { requireAdmin } from "../middlwares/admin.middleware";
import { transactionAdminDto } from "../dto/transaction.dto";
import { beneficeDto } from "../dto/benefice.dto";
import { allStudentsDto, deleteUserDto } from "../dto/students.dto";
import { signupInputSchema } from "../dto/signup.dto";


async function adminRoutes(app: FastifyInstance) {
	app.post('/expense', { ...expenseDto, preHandler: requireAdmin }, expenseService);
	app.post('/transactions', { ...transactionAdminDto, preHandler: requireAdmin }, transactionAdminService);
	app.post('/benefice', { ...beneficeDto, preHandler: requireAdmin }, beneficeService);
	app.get('/student', { ...allStudentsDto, preHandler: requireAdmin }, allStudentsService);
	app.post('/delete', { ...deleteUserDto, preHandler: requireAdmin }, deleteUserService);
	app.post('/create', { ...signupInputSchema, preHandler: requireAdmin }, createUserService);
}

export default adminRoutes;
