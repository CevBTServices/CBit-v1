import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface IEmailData {
  adSoyad: string;
  eposta: string;
  konu: string;
  mesaj: string;
}

const sendContactEmail = async (data: IEmailData) => {
  const mailOptions = {
    from: `"CBIT Teknoloji İletişim" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: data.eposta,
    subject: `[CBIT İletişim Formu] ${data.konu}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #eb1c23, #a31d24); padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">Yeni İletişim Formu Mesajı</h2>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333; width: 120px;">Ad Soyad:</td>
              <td style="padding: 8px 0; color: #555;">${data.adSoyad}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">E-posta:</td>
              <td style="padding: 8px 0; color: #555;"><a href="mailto:${data.eposta}">${data.eposta}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Konu:</td>
              <td style="padding: 8px 0; color: #555;">${data.konu}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <p style="font-weight: bold; color: #333; margin-bottom: 8px;">Mesaj:</p>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${data.mesaj}</p>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 16px;">
          Bu mesaj cbit.com.tr iletişim formundan gönderilmiştir.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export { sendContactEmail };
