const crypto = require('crypto');
const User = require('../model/User');
const { sendPasswordResetOtp } = require('../utils/mailTransporter');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { fn, col, where: sqlWhere, Op } = require('sequelize');
const { OAuth2Client } = require('google-auth-library');
const { createNotification } = require('./notificationController');
require('dotenv').config();

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

const hashResetToken = (token) =>
    crypto.createHash('sha256').update(String(token)).digest('hex');

const generateResetOtp = () => String(crypto.randomInt(100000, 1000000));

const getGoogleClientId = () => String(process.env.GOOGLE_CLIENT_ID || '').trim();

const getGoogleOAuthClient = () => {
    const id = getGoogleClientId();
    return id ? new OAuth2Client(id) : null;
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
            });
        }

        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Trigger welcome notification
        await createNotification(
            user.id,
            'System',
            '👋',
            `Welcome to our project, ${name}!`,
            'Explore the world with our trip planning tools. We are glad to have you here.'
        );

        res.status(201).json({
            message: 'User registered successfully. Please login to continue.',
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.login = async (req, res) => {
    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Server JWT is not configured.' });
        }
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        // Check for admin credentials
        if (email === 'admin@gmail.com' && password === 'admin') {
            console.log('Admin login successful');

            // Find or create admin user in DB to ensure a valid UUID for foreign keys
            let adminUser = await User.findOne({ where: { email: 'admin@gmail.com' } });
            if (!adminUser) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('admin', salt);
                adminUser = await User.create({
                    name: 'Admin',
                    email: 'admin@gmail.com',
                    password: hashedPassword,
                    role: 'admin'
                });
            }

            const payload = {
                user: {
                    id: adminUser.id,
                    role: 'admin'
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '24h' },
                (err, token) => {
                    if (err) {
                        console.error('Admin login JWT error:', err.message);
                        return res.status(500).json({ message: 'Could not create session. Check JWT_SECRET on the server.' });
                    }
                    res.json({
                        token,
                        user: {
                            id: adminUser.id,
                            name: adminUser.name,
                            email: 'admin@gmail.com',
                            role: 'admin'
                        }
                    });
                }
            );
            return;
        }

        // Regular traveler login - admin email is NOT allowed here
        if (email === 'admin@gmail.com') {
            return res.status(403).json({ message: 'Admin must use the Admin Login portal.' });
        }

        let user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User not found in DB');
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        if (!user.password) {
            return res.status(400).json({
                message: 'This account uses Google sign-in. Please use Continue with Google.',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        console.log('Login successful for:', email);
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error('Login JWT error:', err.message);
                    return res.status(500).json({ message: 'Could not create session. Check JWT_SECRET on the server.' });
                }
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role || 'traveler',
                    },
                });
            }
        );
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).send('Server Error');
    }
};

exports.googleAuth = async (req, res) => {
    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Server JWT is not configured.' });
        }

        const googleClient = getGoogleOAuthClient();
        const audience = getGoogleClientId();
        if (!googleClient || !audience) {
            return res.status(503).json({ message: 'Google sign-in is not configured on the server.' });
        }

        const { idToken } = req.body;
        if (!idToken || typeof idToken !== 'string') {
            return res.status(400).json({ message: 'Missing Google credential.' });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience,
        });
        const payload = ticket.getPayload();
        if (!payload?.email) {
            return res.status(400).json({ message: 'Google account has no email address.' });
        }

        const googleSub = payload.sub;
        const emailFromGoogle = String(payload.email).trim();
        const emailLower = emailFromGoogle.toLowerCase();

        if (emailLower === 'admin@gmail.com') {
            return res.status(403).json({ message: 'Admin must use the Admin Login portal.' });
        }

        let user = await User.findOne({ where: { googleId: googleSub } });
        if (!user) {
            user = await User.findOne({ where: { email: emailFromGoogle } });
            if (!user) {
                user = await User.findOne({
                    where: sqlWhere(fn('LOWER', col('email')), emailLower),
                });
            }
        }

        const name = payload.name || payload.given_name || emailFromGoogle.split('@')[0];
        const profilePicture = payload.picture || null;
        let createdNew = false;

        if (user) {
            if (user.role === 'admin') {
                return res.status(403).json({ message: 'Admin accounts must use the Admin Login portal.' });
            }
            if (user.googleId && user.googleId !== googleSub) {
                return res.status(400).json({ message: 'This email is linked to a different Google account.' });
            }
            const updates = {};
            if (!user.googleId) updates.googleId = googleSub;
            if (profilePicture && !user.profilePicture) updates.profilePicture = profilePicture;
            if (Object.keys(updates).length) {
                await user.update(updates);
            }
        } else {
            user = await User.create({
                name,
                email: emailFromGoogle,
                password: null,
                googleId: googleSub,
                profilePicture,
                role: 'traveler',
            });
            createdNew = true;
            await createNotification(
                user.id,
                'System',
                '👋',
                `Welcome to our project, ${name}!`,
                'Explore the world with our trip planning tools. We are glad to have you here.'
            );
        }

        const payloadJwt = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payloadJwt,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error('Google auth JWT error:', err.message);
                    return res.status(500).json({ message: 'Could not create session. Check JWT_SECRET on the server.' });
                }
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role || 'traveler',
                    },
                });
            }
        );
    } catch (err) {
        console.error('Google auth error:', err.message);
        if (err.message && err.message.includes('Token used too late')) {
            return res.status(400).json({ message: 'Google sign-in expired. Please try again.' });
        }
        if (
            err.message &&
            (err.message.includes('audience') ||
                err.message.includes('Audience') ||
                err.message.includes('Wrong recipient'))
        ) {
            return res.status(401).json({
                message:
                    'Google client ID mismatch. Use the same Web client ID in Backend/.env (GOOGLE_CLIENT_ID) and frontend/.env (VITE_GOOGLE_CLIENT_ID or GOOGLE_CLIENT_ID).',
            });
        }
        if (err.message && err.message.includes('Wrong number of segments')) {
            return res.status(400).json({ message: 'Invalid Google credential. Please try signing in again.' });
        }
        res.status(401).json({ message: 'Google sign-in could not be verified. Please try again.' });
    }
};

/**
 * One-click sign-in for local development when GOOGLE_CLIENT_ID is not set.
 * Creates (or reuses) a demo traveler — no Google Cloud setup required.
 * Not available in production or when real Google OAuth is configured.
 */
exports.devGoogleLogin = async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ message: 'Demo sign-in is not available in production.' });
        }
        if (getGoogleClientId()) {
            return res.status(404).json({ message: 'Use the real Continue with Google button.' });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Server JWT is not configured.' });
        }

        const email = 'demo.traveler@local.dev';
        const googleId = 'dev-local-google-sub';
        let user = await User.findOne({ where: { email } });

        if (!user) {
            user = await User.create({
                name: 'Demo Traveler',
                email,
                password: null,
                googleId,
                role: 'traveler',
            });
            await createNotification(
                user.id,
                'System',
                '👋',
                'Welcome, Demo Traveler!',
                'You are using local demo sign-in. Add GOOGLE_CLIENT_ID to sign in with your real Google account.'
            );
        } else {
            if (user.role === 'admin') {
                return res.status(403).json({ message: 'Demo account conflict.' });
            }
            if (!user.googleId) {
                await user.update({ googleId });
            }
        }

        const payloadJwt = { user: { id: user.id } };
        jwt.sign(
            payloadJwt,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error('Dev Google JWT error:', err.message);
                    return res.status(500).json({ message: 'Could not create session.' });
                }
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role || 'traveler',
                    },
                });
            }
        );
    } catch (err) {
        console.error('devGoogleLogin:', err.message);
        res.status(500).json({ message: 'Demo sign-in failed. Is the database running?' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
        });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const dbWithTimeout = (promise, ms = 6000) =>
    Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Database is slow. Please try again.')), ms);
        }),
    ]);

/** POST /auth/forgot-password — send OTP to email */
exports.forgotPassword = async (req, res) => {
    const genericMessage =
        'If an account exists with that email, we sent a 6-digit verification code.';

    try {
        const email = String(req.body?.email || '').trim().toLowerCase();
        if (!email) {
            return res.status(400).json({ message: 'Please enter your email address.' });
        }

        if (email === 'admin@gmail.com') {
            return res.status(400).json({
                message: 'Admin password cannot be reset here. Contact your administrator.',
            });
        }

        let user = await dbWithTimeout(User.findOne({ where: { email } }));
        if (!user) {
            user = await dbWithTimeout(
                User.findOne({
                    where: sqlWhere(fn('LOWER', col('email')), email),
                })
            );
        }

        if (!user) {
            return res.json({
                message: genericMessage,
                emailSent: false,
                unknownAccount: true,
            });
        }

        if (!user.password) {
            return res.status(400).json({
                message:
                    'This account uses Google sign-in. Please use Continue with Google on the login page.',
            });
        }

        const otp = generateResetOtp();
        const hashedOtp = hashResetToken(otp);
        const expireAt = new Date(Date.now() + 15 * 60 * 1000);
        const userId = user.id;
        const userEmail = user.email;
        const userName = user.name;

        // Reply immediately — DB save + SMTP run in background (avoids 15–30s hang).
        res.json({
            message:
                'We sent a 6-digit code to your email. Check your inbox and spam folder, then enter it below.',
            emailSent: true,
            emailPending: true,
        });

        setImmediate(async () => {
            try {
                await dbWithTimeout(
                    User.update(
                        {
                            resetPasswordToken: hashedOtp,
                            resetPasswordExpire: expireAt,
                        },
                        { where: { id: userId } }
                    ),
                    8000
                );
                const mailResult = await sendPasswordResetOtp({
                    to: userEmail,
                    name: userName,
                    code: otp,
                });
                if (!mailResult.sent) {
                    console.warn('[Password reset] Background email failed for', userEmail);
                }
            } catch (bgErr) {
                console.error('[Password reset] Background save/email error:', bgErr.message);
            }
        });
        return;
    } catch (err) {
        console.error('forgotPassword:', err.message);
        if (!res.headersSent) {
            res.status(500).json({
                message: err.message || 'Could not process request. Please try again.',
            });
        }
    }
};

/** POST /auth/verify-reset-otp — verify email OTP, issue short-lived reset token */
exports.verifyResetOtp = async (req, res) => {
    try {
        const email = String(req.body?.email || '').trim().toLowerCase();
        const otp = String(req.body?.otp || '').trim();

        if (!email) {
            return res.status(400).json({ message: 'Please enter your email address.' });
        }
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({ message: 'Please enter the 6-digit code from your email.' });
        }

        let user = await User.findOne({
            where: {
                resetPasswordToken: hashResetToken(otp),
                resetPasswordExpire: { [Op.gt]: new Date() },
                [Op.and]: [sqlWhere(fn('LOWER', col('email')), email)],
            },
        });
        if (!user) {
            user = await User.findOne({
                where: {
                    email,
                    resetPasswordToken: hashResetToken(otp),
                    resetPasswordExpire: { [Op.gt]: new Date() },
                },
            });
        }

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired code. Please request a new one.',
            });
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const expireAt = new Date(Date.now() + 30 * 60 * 1000);

        await user.update({
            resetPasswordToken: hashResetToken(rawToken),
            resetPasswordExpire: expireAt,
        });

        return res.json({
            message: 'Code verified. You can now set a new password.',
            resetToken: rawToken,
            email: user.email,
        });
    } catch (err) {
        console.error('verifyResetOtp:', err.message);
        res.status(500).json({ message: 'Could not verify code. Please try again.' });
    }
};

/** GET /auth/reset-password/:token — check if reset token is still valid */
exports.validateResetToken = async (req, res) => {
    try {
        const token = String(req.params.token || '').trim();
        if (!token) {
            return res.status(400).json({ valid: false, message: 'Invalid reset session.' });
        }

        const user = await User.findOne({
            where: {
                resetPasswordToken: hashResetToken(token),
                resetPasswordExpire: { [Op.gt]: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({
                valid: false,
                message: 'This reset session is invalid or has expired. Please request a new code.',
            });
        }

        return res.json({ valid: true, email: user.email });
    } catch (err) {
        console.error('validateResetToken:', err.message);
        res.status(500).json({ valid: false, message: 'Server error.' });
    }
};

/** POST /auth/reset-password — set new password using token from email */
exports.resetPassword = async (req, res) => {
    try {
        const token = String(req.body?.token || '').trim();
        const password = req.body?.password;

        if (!token) {
            return res.status(400).json({ message: 'Reset token is missing.' });
        }
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
            });
        }

        const user = await User.findOne({
            where: {
                resetPasswordToken: hashResetToken(token),
                resetPasswordExpire: { [Op.gt]: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({
                message: 'Your reset session expired. Please request a new code and try again.',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await user.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpire: null,
        });

        await createNotification(
            user.id,
            'System',
            '🔐',
            'Password updated',
            'Your account password was changed successfully. If this was not you, contact support immediately.'
        );

        return res.json({
            message: 'Password reset successfully. You can now log in with your new password.',
        });
    } catch (err) {
        console.error('resetPassword:', err.message);
        res.status(500).json({ message: 'Could not reset password. Please try again.' });
    }
};
