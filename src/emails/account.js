const sgMail = require('@sendgrid/mail');
const sendgridAPIKey =
  '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';
sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'yogeshmishra667@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
};

const cancelWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'yogeshmishra667@gmail.com',
    subject: 'Sorry to see you go!',
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  cancelWelcomeEmail,
};
