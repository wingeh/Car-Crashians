fetch("https://mapboxdurationvolodimir-kudriachenkov1.p.rapidapi.com/getCyclingDuration", {
	"method": "POST",
	"headers": {
		"content-type": "application/x-www-form-urlencoded",
		"x-rapidapi-key": "306d0c339emshde878ece203b458p11f509jsnf2f990e88288",
		"x-rapidapi-host": "MapboxDurationvolodimir-kudriachenkoV1.p.rapidapi.com"
	},
	"body": {
		"accessToken": "pk.eyJ1Ijoid2luZ2VoIiwiYSI6ImNrbXMwZG1nYzAycHcyd3NlaTJuMnV3YTcifQ.kVwpM7qH_A98YyidSBZYNQ",
		"coordinates": "<REQUIRED>"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.error(err);
});