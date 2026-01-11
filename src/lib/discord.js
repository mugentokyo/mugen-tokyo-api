const axios = require("axios");

const divider = "-----------------------------";

async function sendToDiscord(webhookUrl, message) {
  if (!webhookUrl) return;

  const finalMessage = `
${divider}
${message}
${divider}
`;

  try {
    await axios.post(webhookUrl, {
      content: finalMessage,
    });
  } catch (err) {
    console.error("DISCORD ERROR:", err.response?.data || err.message);
  }
}

module.exports = {
  sendToDiscord,
};