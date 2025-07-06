const emailService = require('../services/emailService');

exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    await emailService.sendEmail(to, subject, text);
    res.status(200).json({ message: 'Email enviado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar e-mail.' });
  }
};
