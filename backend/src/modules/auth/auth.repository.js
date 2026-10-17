import { db } from '../../db/index.js';

import { users, refreshTokens } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

const findUserByEmail = async (email) => {
    const data = await db.select().from(users).where(eq(users.email, email));
    return data[0];
};

const register = async (email, password) => {
    const data = await db.insert(users).values({ email, password }).returning();
    return data[0];
};

const saveRefreshToken = async (userId, refreshToken) => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(refreshTokens).values({ userId, refreshToken, expiresAt });
};

const deleteRefreshToken = async (userId) => {
  await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
};

const findRefreshToken = async (refreshToken) => {
    const data = await db.select().from(refreshTokens).where(eq(refreshTokens.refreshToken, refreshToken));
    return data[0];
}

const me = async (userId) => {
    const data = await db
        .select({ id: users.id, email: users.email })
        .from(users)
        .where(eq(users.id, userId));
    return data[0];
}

export default {
    findUserByEmail,
    register,
    saveRefreshToken,
    deleteRefreshToken,
    findRefreshToken,
    me
};