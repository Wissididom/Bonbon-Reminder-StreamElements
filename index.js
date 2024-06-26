import "dotenv/config";

function isStreamElementsAccountId(str) {
  return /^[a-fA-F0-9]{24}$/.test(str);
}

function isTwitchLoginname(str) {
  return /^[A-Za-z0-9_]{4,25}$/.test(str);
}

async function getGuid(jwtToken, broadcasterLogin) {
  return fetch(
    `https://api.streamelements.com/kappa/v2/channels/${broadcasterLogin}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    },
  )
    .then((res) => {
      console.log(`channels/${broadcasterLogin}: Response-Code ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log(`channels/${broadcasterLogin}: ${JSON.stringify(data)}`);
      return data._id;
    })
    .catch((err) => {
      console.log(`Error getting User Guid: ${err}`);
    });
}

(async function () {
  if (process.env["JWT_TOKEN"]) {
    let jwtToken = process.env["JWT_TOKEN"];
    let guids = process.env["STREAMELEMENTS_ACCOUNT_IDS"] || "me";
    let textMessage = process.env["TEXT_MESSAGE"] || "TEXT_MESSAGE not set!";
    for (let guid of guids.split(",")) {
      if (guid == "me") guid = await getGuid(jwtToken, guid);
      if (!isStreamElementsAccountId(guid)) {
        console.warn(`${guid} is not a valid StreamElements Account ID!`);
        if (isTwitchLoginname(guid.toLowerCase())) {
          console.log(
            `Attempting to load the StreamElements Account ID from the Twitch login name!`,
          );
          guid = await getGuid(jwtToken, guid);
        } else {
          console.warn(
            `${guid} is not a Twitch login name either! Ignoring Account!`,
          );
          continue;
        }
      }
      await fetch(`https://api.streamelements.com/kappa/v2/bot/${guid}/say`, {
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
    }
  } else {
    console.log("Missing JWT_TOKEN in .env file");
  }
})();
