function getSequenceId() {
	if (!data.sequence) data.sequence = 0;
	return data.sequence++;
}

function addPerson(vhealth = 1000, logtext = undefined) {
	var guy =
	{
		name: generateName(),
		task: null,
		id: getSequenceId(),
		effort: 1,
		hunger: 1000,
		thirst: 1000,
		health: vhealth,
		maxhunger: 1000,
		maxthirst: 1000,
		maxhealth: vhealth
	};
	data.people.push(guy);
	releasePerson();
	if (logtext) {
		log(logtext, "logblue");
	}
	updatePeopleItems();
	setAddIcon("g_people", 1);
}

function updatePersonEffort(dt, person, attack) {
	person.hunger -= dt;
	person.thirst -= dt * 1.5;
	person.health -= dt * attack;
	if (person.hunger <= 0) {
		if (data.general.food > 0) {
			removeFood(1);
			person.hunger += 1000;
		} else {
			person.hunger = 0;
			taskMinus(person.task, person);
			killPerson(person, " from hunger.");
			return;
		}
	}
	if (person.thirst <= 0) {
		if (data.general.water > 0) {
			removeWater(1);
			person.thirst += 1000;
		} else {
			person.thirst = 0;
			taskMinus(person.task, person);
			killPerson(person, " from thirst.");
			return;
		}
	}
	if (person.health <= 0) {
		if (data.general.medkits > 0) {
			removeMedkit(1);
			person.health += person.maxhealth;
		} else {
			person.health = 0;
			taskMinus(person.task, person);
			killPerson(person, " of wounds.");
			return;
		}
	}
}

function killPerson(person, logmessage) {
	for (var i=0; i<data.people.length; i++) {
		if (data.people[i] === person) {
			data.people.splice(i, 1);
			break;
		}
	}

	data.general.availablePeople -= 1;
	if (data.general.availablePeople <= 0) {
		$(".taskplus").addClass("disabled");
	}
	updateGenerals();
	updatePeopleItems();
	setRemoveIcon("g_people", 1);

	log("One of your people died" + logmessage, "logred");

	if (data.people.length <= 0) {
		setTimeout(function(){
			showEndGameModal();
		}, 1000);
	}
}

function releaseAllPeople() {
	for (var i=0; i<data.people.length; i++) {
		var person = data.people[i];
		if (person.task != null) {
			taskMinus(person.task);
		}
	}
}

function bindPerson() {
	data.general.availablePeople -= 1;
	if (data.general.availablePeople <= 0) {
		$(".taskplus").addClass("disabled");
	}
	if (data.general.availablePeople != data.people.length) {
		$(".releaseButton").removeClass("disabled");
	}
	updateGenerals();
}
function releasePerson() {
	data.general.availablePeople += 1;
	if (data.general.availablePeople == 1) {
		$(".taskplus").removeClass("disabled");
	}
	if (data.general.availablePeople == data.people.length) {
		$(".releaseButton").addClass("disabled");
	}
	updateGenerals();
}
function generateName() {
	var firstNames = ["David", "Markus", "Vincent", "Prince", "John", "Mario", "Willie", "Kim", "Edgar", "Henry", "Alan", "Claudia", "Lisa", "Bert", "Conrad", "Steward", "Joe", "Samuel", "Dave", "Pamela", "Toni", "Jerry", "Megan", "Anna", "Benny", "Charlie", "Melinda", "Tracy", "Owen", "Lauren"];
	var lastNames = ["Terry", "Skinner", "Norton", "Smith", "Benton", "Bell", "Welch", "Foster", "Marsh", "Manning", "Weaver", "Luna", "Reed", "Scott", "Park", "Stephens", "Gray", "Knight", "Butler", "Bass", "Wise", "Wilson", "Goodwin", "Reed", "Larson", "Brooks", "Long", "Summers", "Jackson", "Lambert"];
	var fname = firstNames[Math.floor(Math.random() * firstNames.length)];
	var lname = lastNames[Math.floor(Math.random() * lastNames.length)];
	return fname + " " + lname;
}
