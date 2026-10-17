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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await authService.login(email, password);
        return res.status(200).json({ success: true, data: data });
    } catch (e) {
        return res.status(400).json({ success: false, message: e.message });
    }
}

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const data = await authService.refresh(refreshToken);
        return res.status(200).json({ success: true, data: data });
    } catch (e) {
        return res.status(400).json({ success: false, message: e.message });
    }
}

const me = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await authService.me(userId);
        return res.status(200).json({ success: true, data: data });
    } catch (e) {
        return res.status(400).json({ success: false, message: e.message });
    }
}

export default {
    register,
    login,
    refresh,
    me
}