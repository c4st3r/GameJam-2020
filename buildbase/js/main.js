var initialData = {
	pending: null,
	general: {
		availablePeople: 0,
		money: -1,
		food: 25,
		water: 30,
		medkits: -1,
	},
	people: [],
	tasks: {},
	items: {
	},
	logs: {
	},
	tabs: {},
	sequence:0
};

var data;
var sinceLastSave = 0;
var sinceLastCheck = 0;
var sinceLastCheck2 = 0;
var debug = true;
var speedup = 1;
var changedItems = {};
var iconItems = {};
var updatePeople = true;

$( function() {
	initModals();
	reset();
	
	if (!debug) {
		$(".debug").hide();
		load();
	}
	refreshItems();
	var id = setInterval(update, 20, 2);
} );

function save() {
	localStorage.setItem("data", JSON.stringify(data));
}

function load() {
	var sdata = localStorage.getItem("data");
	if (sdata) {
		data = JSON.parse(sdata);
	}
	
	refreshItems();
	refreshTasks();
}

function resetButton() {
	if (confirm("Are you sure you want to start over again?")) {
		reset();
	}
}

function reset() {
	data = jQuery.extend(true, {}, initialData);
	iconItems = {};
	refreshItems();
	refreshTasks();
	clearLog();
	log("Welcome to my simulation", "logregular");
	//log("All I have for now is this wonderful log and some basic supplies.", "logblue");
	//log("Please assign your workers to task by using the + and - next to those tasks.", "logblue");
	
	addPerson();
	addPerson();
	addPerson();
	addTask("lakewater");
	addTask("wheatfield");
	addTask("cuttrees");
	addTask("buildcampfire");
}

function newgame() {
	reset();
	closeEndGameModal();
}

function update(dt) {
	updateTasks(dt*speedup);
	if (!debug) {
		sinceLastSave += dt;
		if (sinceLastSave >= 100) {
			save();
			sinceLastSave = sinceLastSave-100;
		}	
	}
	sinceLastCheck += dt;
	if (sinceLastCheck >= 37) {
		sinceLastCheck = sinceLastCheck-37;
		check();
	}
	sinceLastCheck2 += dt;
	if (sinceLastCheck2 >= 13) {
		sinceLastCheck2 = sinceLastCheck2-13;
		check2();
	}
	//Update icon add/remve icons
	var keys = Object.keys(iconItems);
	for (var i in keys) {
		var key = keys[i];
		var ii = iconItems[key];
		if (ii) {
			ii.time -= dt;
			if (ii.time < 0) {
				$("#ia_"+key).text("");
				delete iconItems[key];
			} else {
				$("#ia_"+key).css('opacity', ii.time / 200);
				$("#ia_"+key).css('text-indent', -(ii.time - 200)*0.2 + "px");
			}
		}
	}
}

function check() {
	var keys = Object.keys(changedItems);
	for (var i in keys) {
		var key = keys[i];
		if (changedItems[key] !== undefined) {
			var item = changedItems[key];
			count = 0;
			if (item != null) {
				count = item.count;
			}
			changedItems[key] = undefined;				
			$(".has_"+key).text(count);
			$(".hasc_"+key).each(function(j) {
				if (count >= parseInt($(this).text())) {
					$(this).parent().removeClass("lacking");
					var ptext = $(this).parents(".task").find(".progresstext");
					if (!$(this).parents(".tooltip").find(".lacking").length) {
						ptext.removeClass("lacking");
					}
				} else {
					$(this).parent().addClass("lacking");
					var ptext = $(this).parents(".task").find(".progresstext");
					if (!ptext.hasClass("lacking")) {
						ptext.addClass("lacking");
					}
				}
			});
		}
	}
}

function check2() {
	if (data.general.availablePeople < data.people.length) {
		updatePeopleItems();
		updatePeople = true;
	} else if (updatePeople) {
		updatePeopleItems();
		updatePeople = false;
	}
	
}

