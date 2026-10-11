import authService from './auth.service.js';

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await authService.register(email, password);
        return res.status(201).json({ success: true, data: data });
    } catch (e) {
        return res.status(400).json({ success: false, message: e.message });
    }
}

export default {
    register,
}