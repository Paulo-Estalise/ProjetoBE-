const User = require('../models/User');
const nodemailer = require('nodemailer');

module.exports = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find({}, 'name email role');  // Só os dados necessários
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve users.' });
    }
  },

  async deleteInactiveUsers(req, res) {
    try {
      const threshold = new Date();
      threshold.setHours(threshold.getHours() - 24 * 2);  // Exclui usuários inativos nos últimos 2 dias
      const inactiveUsers = await User.find({ lastLogin: { $lt: threshold } });

      // Enviar email aos usuários excluídos
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        }
      });

      inactiveUsers.forEach(user => {
        transporter.sendMail({
          to: user.email,
          subject: 'Sua conta foi excluída',
          text: 'Sua conta foi excluída por inatividade nos últimos dois dias.',
        });
      });

      // Excluir usuários
      await User.deleteMany({ lastLogin: { $lt: threshold } });
      res.status(200).json({ message: 'Inactive users deleted.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete inactive users.' });
    }
  }
};
module.exports = {
    // Função para buscar um usuário por ID
    async getUserById(req, res) {
      const { id } = req.params;
      try {
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
      }
    },
  
    // Função para atualizar dados de um usuário
    async updateUser(req, res) {
      const { id } = req.params;
      const { name, email, role } = req.body;
  
      try {
        const user = await User.findByIdAndUpdate(id, { name, email, role }, { new: true });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
      } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
      }
    }
  };