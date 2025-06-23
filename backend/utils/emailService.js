const nodemailer = require('nodemailer');
require('dotenv').config();

// Criação do transporter com dados do .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,           // e.g. teuemail.racketmatch@gmail.com
    pass: process.env.EMAIL_PASS,           // palavra-passe ou App Password do Gmail
  },
});

// Função para envio do código de verificação 2FA
const sendVerificationCode = async (to, code) => {
  const mailOptions = {
    from: `"RacketMatch" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Código de Verificação - RacketMatch',
    text: `🛡️ O seu código de verificação é: ${code}\n\nEste código expira em 5 minutos.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📨 Código 2FA enviado para ${to}`);
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    throw error;
  }
};

module.exports = sendVerificationCode;
