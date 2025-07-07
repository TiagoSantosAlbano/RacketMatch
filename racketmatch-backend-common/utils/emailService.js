const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,           
    pass: process.env.EMAIL_PASS,           
  },
});


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
