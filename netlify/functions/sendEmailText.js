import nodemailer from "nodemailer";

export async function handler(event, context) {
  // Handle preflight OPTIONS request for CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "OK",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  // Parse the incoming payload
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { toEmail, playerData, gameData } = payload;

  if (!toEmail || !playerData || !gameData) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Missing required parameters: toEmail, playerData, or gameData.",
      }),
    };
  }

  // Build plain text email content
  let emailBody = `Chess Performance Report\n\n`;
  emailBody += `Player Information\n`;
  emailBody += `Name: ${playerData.name || "Player"}\n`;
  emailBody += `Quiz Score: ${playerData.quizScore || "N/A"}\n`;
  emailBody += `Player Category: ${playerData.category || "Basic Level Player"}\n\n`;
  emailBody += `Game Statistics\n`;
  gameData.forEach((game, index) => {
    emailBody += `\nGame ${index + 1}\n`;
    emailBody += `Result: ${game.result || "N/A"}\n`;
    emailBody += `White Statistics:\n`;
    emailBody += `  • Accuracy: ${
      game.accuracy && game.accuracy.white !== undefined ? game.accuracy.white : "N/A"
    }%\n`;
    emailBody += `  • Blunders: ${
      game.blunders && game.blunders.white !== undefined ? game.blunders.white : "N/A"
    }\n`;
    emailBody += `  • Mistakes: ${
      game.mistakes && game.mistakes.white !== undefined ? game.mistakes.white : "N/A"
    }\n`;
    emailBody += `  • Inaccuracies: ${
      game.inaccuracies && game.inaccuracies.white !== undefined ? game.inaccuracies.white : "N/A"
    }\n`;
    emailBody += `Black Statistics:\n`;
    emailBody += `  • Accuracy: ${
      game.accuracy && game.accuracy.black !== undefined ? game.accuracy.black : "N/A"
    }%\n`;
    emailBody += `  • Blunders: ${
      game.blunders && game.blunders.black !== undefined ? game.blunders.black : "N/A"
    }\n`;
    emailBody += `  • Mistakes: ${
      game.mistakes && game.mistakes.black !== undefined ? game.mistakes.black : "N/A"
    }\n`;
    emailBody += `  • Inaccuracies: ${
      game.inaccuracies && game.inaccuracies.black !== undefined ? game.inaccuracies.black : "N/A"
    }\n`;
    emailBody += `Overall Score: ${
      game.overallScore !== undefined ? game.overallScore.toFixed(2) : "N/A"
    }%\n`;
  });

  // Verify environment variables are set
  if (!process.env.Mail_User || !process.env.Mail_Password) {
    console.error("Missing Mail_User or Mail_Password environment variable.");
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Server configuration error." }),
    };
  }

  // Mask the value to show only the first 3 characters and the length
  if (process.env.Mail_User) {
    console.log("Mail_User is loaded:", process.env.Mail_User.slice(0,3) + "*".repeat(process.env.Mail_User.length - 3));
  } else {
    console.log("Mail_User is not set");
  }
  
  if (process.env.Mail_Password) {
    console.log("Mail_Password is loaded, length:", process.env.Mail_Password.length);
  } else {
    console.log("Mail_Password is not set");
  }

  // Set up nodemailer transporter (example using Gmail)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.Mail_User,
      pass: process.env.Mail_Password,
    },
  });

  const mailOptions = {
    from: process.env.Mail_User,
    to: toEmail,
    subject: `Chess Performance Report - ${new Date().toLocaleString()}`,
    text: emailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", toEmail);
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Email sent successfully!" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Failed to send email." }),
    };
  }
}