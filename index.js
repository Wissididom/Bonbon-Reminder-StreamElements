require('dotenv').config();

async function getGuid(broadcasterLogin) {
	console.log(`getGuid:${broadcasterLogin}`);
	return fetch(`https://api.streamelements.com/kappa/v2/channels/${broadcasterLogin}`, {
		headers: {
			'Accept': 'application/json',
			'Authorization': `Bearer ${jwtToken}`,
			'Content-Type': 'application/json'
		}
	}).then(res => {
		console.log(`channels/${login}: Response-Code ${res.status}`);
		return res.json();
	}).then(data => {
		console.log(`channels/${login}: ${JSON.stringify(data)}`);
		return data._id;
	}).catch(err => {
		console.log(`Error getting User Guid: ${err}`);
	});
}

(async function () {
if (process.env['JWT_TOKEN']) {
	let jwtToken = process.env['JWT_TOKEN'];
	let guids = process.env['STREAMELEMENTS_ACCOUNT_IDS'] || 'me';
	let textMessage = process.env['TEXT_MESSAGE'] || 'TEXT_MESSAGE not set!';
	for (let guid of guids.split(',')) {
		if (guid == 'me') // TODO: Maybe check if it is a twitch username/login
			guid = await getGuid(guid);
		console.log(`Guid:${guid}`);
		await fetch(`https://api.streamelements.com/kappa/v2/bot/${guid}/say`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json; charset=utf-8',
				'Authorization': `Bearer ${jwtToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: textMessage
			})
		}).then(res => {
			console.log(`bot/${guid}/say: Response-Code ${res.status}`);
			return res.json();
		}).then(data => {
			console.log(`bot/${guid}/say: ${JSON.stringify(data)}`);
		});
	}
} else {
	console.log('Missing JWT_TOKEN in .env file');
}
})();
