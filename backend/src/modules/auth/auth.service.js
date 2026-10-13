import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import authRepository from './auth.repository.js';

const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
}

const register = async (email, password) => {
    const candidate = await authRepository.findUserByEmail(email);
    if (candidate) {
        throw new Error('The mail is busy.');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await authRepository.register(email, hashPassword);
    const tokens = generateTokens({ id: user.id });
    await authRepository.saveRefreshToken(user.id, tokens.refreshToken);
    return {
        id: user.id,
        email: user.email,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
    }
}

const login = async (email, password) => {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('Email or password is invalid');
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        throw new Error('Email or password is invalid');
    }
    await authRepository.deleteRefreshToken(user.id);
    const tokens = generateTokens({ id: user.id });
    await authRepository.saveRefreshToken(user.id, tokens.refreshToken);
    return {
        id: user.id,
        email: user.email,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
    }
}

const refresh = async (refreshToken) => {
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!user) {
        throw new Error('Invalid token');
    }
    const refreshTokenIsValid = await authRepository.findRefreshToken(refreshToken);
    if (!refreshTokenIsValid) {
        throw new Error('Unauthorized');
    }
    await authRepository.deleteRefreshToken(user.id);
    const tokens = generateTokens({ id: user.id });
    await authRepository.saveRefreshToken(user.id, tokens.refreshToken);
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
    }
}

export default {
    register,
    login,
    refresh
}