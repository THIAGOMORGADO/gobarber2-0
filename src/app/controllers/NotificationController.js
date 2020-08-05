import Notification from '../schemas/Notification';
import User from '../model/User';

class NotificationController {
  async index(req, res) {
    const checkIsprovider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!checkIsprovider) {
      return res
        .status(400)
        .json({ error: 'Only provider can load notification' });
    }
    const notification = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.json(notification);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    return res.json(notification);
  }
}
export default new NotificationController();
