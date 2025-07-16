const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const Mailjet = require("node-mailjet");
const cors = require("cors")({origin: true});

admin.initializeApp();

exports.sendEmail = onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      const {from: fromEmail, to: toEmail, subject, attachments} =
       request.query;

      if (!fromEmail) {
        return response.status(400).send("Query param 'from' is required");
      }
      if (!toEmail) {
        return response.status(400).send("Query param 'to' is required");
      }
      if (!subject) {
        return response.status(400).send("Query param 'subject' is required");
      }

      const recipientEmails = toEmail.split(",").map((email) => ({
        Email: email.trim(),
        Name: "Recipient",
      }));
      const mailjet = Mailjet.apiConnect(
          "dd25224982b214309b41c3d59cf4e35b",
          "22248b95bbbf20b1fe0e224ab75b7e75",
      );

      const emailRequest = mailjet.post("send", {version: "v6.0.6"}).request({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: "System email",
            },
            To: recipientEmails,
            Subject: subject,
            HTMLPart: "<h3>Dear user, welcome to Social Food Support</h3>",
            TextPart: "Dear user, welcome to Social Food Support",
            Attachments: attachments ? JSON.parse(attachments) : [],
          },
        ],
      });
      const result = await emailRequest;
      response.status(201).json(result.body);
    } catch (err) {
      response.status(500).send(`Failed to send email: ${err.message}`);
    }
  });
});
