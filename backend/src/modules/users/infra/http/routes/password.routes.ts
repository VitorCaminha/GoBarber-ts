import { Router } from 'express';

import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRoutes = Router();
const forgotpasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRoutes.post('/forgot', forgotpasswordController.create);
passwordRoutes.post('/reset', resetPasswordController.create);

export default passwordRoutes;
