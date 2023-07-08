require("dotenv").config();

(async function () {
  if (process.env["JWT_TOKEN"]) {
    let jwtToken = process.env["JWT_TOKEN"];
    let broadcasterLogin = process.env["BROADCASTER_LOGIN"] || "me";
    let textMessage = process.env["TEXT_MESSAGE"] || "TEXT_MESSAGE not set!";
    for (let login of broadcasterLogin.split(",")) {
      console.log(`Login:${login}`);
      await fetch(`https://api.streamelements.com/kappa/v2/channels/${login}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log(`channels/${login}: Response-Code ${res.status}`);
          return res.json();
        })
        .then((data) => {
          console.log(`channels/${login}: ${JSON.stringify(data)}`);
          let guid = data._id;
          fetch(`https://api.streamelements.com/kappa/v2/bot/${guid}/say`, {
            method: "POST",
            headers: {
              Accept: "application/json; charset=utf-8",
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: textMessage,
            }),
          })
            .then((res) => {
              console.log(`bot/${guid}/say: Response-Code ${res.status}`);
              return res.json();
            })
            .then((data) => {
              console.log(`bot/${guid}/say: ${JSON.stringify(data)}`);
            });
        })
        .catch((err) => {
          console.log(`Error getting User Guid: ${err}`);
        });
    }
  } else {
    console.log("Missing JWT_TOKENS in .env file");
  }
})();
