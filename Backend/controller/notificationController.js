const { Notification, User } = require('../model');

function normalizeNotification(row) {
    const json = row?.toJSON ? row.toJSON() : row;
    return {
        ...json,
        isRead: json.isRead === true || json.isRead === 1,
    };
}

const createNotification = async (userId, type, icon, title, message) => {
    try {
        if (!userId) return null;
        const allowed = ['Budget', 'Weather', 'Flights', 'Safety', 'Trip', 'System'];
        const safeType = allowed.includes(type) ? type : 'System';
        return await Notification.create({
            userId,
            type: safeType,
            icon,
            title,
            message,
        });
    } catch (error) {
        console.error('Error creating notification:', error.message);
        return null;
    }
};

async function ensureStarterNotifications(userId) {
    const count = await Notification.count({ where: { userId } });
    if (count > 0) return;

    const user = await User.findByPk(userId, { attributes: ['name'] });
    const name = user?.name?.split(' ')?.[0] || 'Traveler';

    await createNotification(
        userId,
        'System',
        '👋',
        `Welcome, ${name}!`,
        'Your travel inbox is ready. Trip updates, bookings, and budget alerts will appear here.'
    );
    await createNotification(
        userId,
        'Trip',
        '🗺️',
        'Plan your first trip',
        'Use Plan my trip or Create trip to start building your Pakistan itinerary.'
    );
}

const getNotifications = async (req, res) => {
    try {
        await ensureStarterNotifications(req.user.id);

        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            data: notifications.map(normalizeNotification),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ success: true, data: normalizeNotification(notification) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await Notification.update(
            { isRead: true },
            { where: { userId: req.user.id, isRead: false } }
        );
        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const deleted = await Notification.destroy({
            where: { id: req.params.id, userId: req.user.id },
        });

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const clearAll = async (req, res) => {
    try {
        await Notification.destroy({
            where: { userId: req.user.id },
        });
        res.status(200).json({ success: true, message: 'All notifications cleared' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    createNotification,
};
