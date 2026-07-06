const {setGlobalOptions} = require("firebase-functions/v2");
const {onCall} = require("firebase-functions/v2/https");

const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

setGlobalOptions({
  maxInstances: 10,
});

// ========================================
// EMAIL TRANSPORTER
// ========================================

const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {

    user: process.env.GMAIL_EMAIL,

    pass: process.env.GMAIL_PASSWORD,

  },

});

// ========================================
// SEND ADMIN OTP
// ========================================

exports.sendAdminOTP = onCall(async () => {
  const email = process.env.GMAIL_EMAIL;

  const otp = Math.floor(
      100000 + Math.random() * 900000,
  ).toString();

  const expiresAt = Date.now() + (5 * 60 * 1000);

  await admin.firestore()

      .collection("adminOTP")

      .doc(email)

      .set({

        otp,

        expiresAt,

      });

  await transporter.sendMail({

    from: `"AquaFlow" <${email}>`,

    to: email,

    subject: "AquaFlow Admin Verification Code",

    html: `

            <h2>AquaFlow Admin Verification</h2>

            <p>Your verification code is:</p>

            <h1 style="letter-spacing:5px;">${otp}</h1>

            <p>This code will expire in <b>5 minutes</b>.</p>

        `,

  });

  return {

    success: true,

  };
});
