function addTaskData(id) {
	var nid = id;
	if (data.tasks[nid] != null) {
		var i=0;
		while (data.tasks[nid+i] != null) {i++;}
		nid = nid+i;
	}
	var taskdata = d.tasks[id];
	if (taskdata != null) {
		//var newTask = jQuery.extend(true, {}, taskdata);
		var newTask = {};
		newTask["id"] = id;
		newTask["progress"] = 0;
		newTask["people"] = 0;
		newTask["peopleFound"] = false;
		newTask["dleft"] = taskdata.durability;
		newTask["tasks"] = {}
		data.tasks[nid] = newTask;
		return nid;
	}
	return null;
}

function makeTooltip(task, dtask) {
	function addIcon(obj, icon, hasPrevious) {
		var em = ""
		if (hasPrevious) {
			em += "&nbsp;&nbsp;";
		}
		em += "<span class='"+icon+"'>";
		if (obj.min == obj.max) {
			em += obj.min;
		} else {
			em += obj.min + "-" + obj.max;
		}
		return em;
	}

	var elem = "<span class='tooltip'>";
	if (dtask.title) {
		elem += "<p class='title'>" + dtask.title + "</p><hr/>";
	}
	if (dtask.effort) {
		elem += "<p class='effort'>";
		var efforticon = "icon-back-in-time";
		if (dtask.type == "fight") {
			elem += "<span class='icon-heart'>" + (dtask.effort/100);
		} else {
			elem += "<span class='icon-back-in-time'>" + (dtask.effort/100);
		}
		if (dtask.attack) {
			elem += "&nbsp;<span class='icon-alert'>" + dtask.attack;
		}
		elem += "</p><hr/>";
	}
	if (dtask.desc) {
		elem += "<p class='desc'>" + dtask.desc + "</p><hr/>";
	}
	if (dtask.tech && dtask.tech.length > 0) {
		elem += "<p class='head'>Technology:</p>";
		elem += "<table>"
		for (var i=0; i<dtask.tech.length; i++) {
			var req = dtask.tech[i];
			var lid = dtask.tech[i].id;
			elem += "<tr><td>"+d.items[lid].name+"</td><td><span class='has_"+req.id+"'>0</span>/<span class='hasc_"+req.id+"'>"+req.count+"</span></td></tr>";
			itemChanged(req.id);
		}
		elem += "<table>"
		elem += "<hr/>";
	}
	if (dtask.requires && dtask.requires.length > 0) {
		elem += "<p class='head'>Consumes:</p>";
		elem += "<table>"
		for (var i=0; i<dtask.requires.length; i++) {
			var req = dtask.requires[i];
			var lid = dtask.requires[i].id;
			elem += "<tr><td>"+d.items[lid].name+"</td><td><span class='has_"+req.id+"'>0</span>/<span class='hasc_"+req.id+"'>"+req.count+"</span></td></tr>";
			itemChanged(req.id);
		}
		elem += "<table>"
		elem += "<hr/>";
	}

	if (dtask.loot || dtask.food || dtask.water) {
		var title = "Produces:";
		if (dtask.type == "gather") { title = "Loot:" }
		elem += "<p class='head'>"+title+"</p>";
	}

	hasPrevious = false;
	if (dtask.food) {
		elem += addIcon(dtask.food, "icon-food", hasPrevious);
		hasPrevious = true;
	}
	if (dtask.water) {
		elem += addIcon(dtask.water, "icon-droplet", hasPrevious);
		hasPrevious = true;
	}
	if (dtask.money) {
		elem += addIcon(dtask.money, "icon-money", hasPrevious);
		hasPrevious = true;
	}
	if (dtask.medkits) {
		elem += addIcon(dtask.medkits, "icon-medkit", hasPrevious);
		hasPrevious = true;
	}

	if (dtask.loot) {
		if (dtask.loot.length > 0) {
			elem += "<table>"
			for (var i=0; i<dtask.loot.length; i++) {
				var prob = dtask.loot[i].prob; if (!prob) prob = 1;
				var lid = dtask.loot[i].id;
				var count = dtask.loot[i].count > 1 ? dtask.loot[i].count + "x" : "";

				if (!d.items[lid])
					console.log("undef:" + lid);

				elem += "<tr><td>"+count+"</td><td>"+d.items[lid].name+"</td>";
				var pclass = "always";
				if (prob <= 0.05) { pclass = "rare" } else
				if (prob <= 0.2) { pclass = "uncommon" } else
				if (prob < 1) { pclass = "common" }
				elem += "<td class='p_"+pclass+"'>"+pclass+"</td></tr>";
			}
			elem += "</table>"
		}
	}

	elem += "</span>";
	return elem;
}

function getTaskIcon(dtask) {
	switch (dtask.type) {
		case "explore": return "icon-map-o";
		case "gather": return "icon-tree";
		case "fight": return "icon-paw";
		case "talk": return "icon-comment-empty";
		case "cook": return "icon-food-1";
		case "produce": return "icon-industry";
		case "recycle": return "icon-recycle";
		case "science": return "icon-beaker";
		case "build": return "icon-tools";
		case "loot": return "icon-cubes";
		case "trade": return "icon-balance-scale";
		case "home": return "icon-home";
	}
	return null;
}

function addTaskHtml(nid, task, dtask, tab) {
	var ticon = getTaskIcon(dtask);
	ticon = ticon ? "<span class='"+ticon+"'>&nbsp;" : "";
	var elem = "" +
	"<div id='"+nid+"' class='task'>" +
		"<div class='texthidden'>"+ticon +dtask.name+"</div>" +
		"<div class='taskHeader' onclick=''>" +
			"<div class='taskBar'></div>" +
			"<div class='progresstext'>"+ ticon +dtask.name+"</div>" +
		"</div>" +
		"<div class='taskDurability'>" +
			"<div class='taskDurabilityBar'></div>" +
		"</div>" +
		"<div class='btngroup'>" +
			"<div class='taskminus btn left disabled' onclick='taskMinus(\""+nid+"\")'><span class='icon-minus'></div>" +
			"<div class='center'><span class='number'>"+task.people+"</span><span class='icon-male'></div>" +
			"<div class='taskplus btn right' onclick='taskPlus(\""+nid+"\")'><span class='icon-plus'></div>" +
		"</div>" +
		makeTooltip(task, dtask) +
	"</div>";

	$(elem).appendTo("#t_"+tab).hide().fadeIn(400);
	addTabTask(tab);
	updateTaskBar(nid, task, dtask);
}

function addTask(id) {
	var nid = addTaskData(id);
	if (nid != null) {
		var task = data.tasks[nid];
		var dtask = d.tasks[id];
		addTaskHtml(nid, task, dtask, dtask.tab);
		if (dtask.log) {
			if (dtask.type == "explore") {
				log(dtask.log, "logpurple", false);
			} else {
				log(dtask.log, "logblue", false);
			}
		}
	}
}

function refreshTasks() {
	function emptyTab(tabName) {
		$("#t_"+tabName).empty();
		$("#tab_"+tabName).hide();
	}
	emptyTab("scavenge");
	emptyTab("cook");
	emptyTab("craft");
	emptyTab("research");
	emptyTab("trade");
	//emptyTab("work");
	data.tabs = {};

	var names = Object.keys(data.tasks);
	for (var i in names) {
		var task = data.tasks[names[i]];
		var dtask = d.tasks[task.id];
		if (dtask) {
			addTaskHtml(names[i], task, dtask, dtask.tab);
		}
	}

	var pendingtarget = $("#"+data.pending).find(".taskHeader");
	if (pendingtarget) {
		pendingtarget.addClass("active");
	}
}

function task(id) {
	/*
	var task = data.tasks[id];
	if (!task) return;

	if (data.pending == id) {
		$(".taskHeader").removeClass("active");
		data.pending = null;
	}
	else
	{
		$(".taskHeader").removeClass("active");
		var target = $("#"+id).find(".taskHeader");
		target.addClass("active");
		data.pending = id;
	}
	*/
}

function taskPlus(id, person = null) {
	if (data.general.availablePeople <= 0) return;
	var task = data.tasks[id];
	if (task == null) return;

	var found = false;
	if (person) {
		person.task = id;
		found = true;
	} else {
		for (var i=0; i<data.people.length; i++) {
			if (data.people[i].task == null) {
				data.people[i].task = id; found = true;
				break;
			}
		}
	}
	if (!found) {console.log("taskPlus FAILED"); return;}

	task.people += 1;
	$("#"+id).find(".number").text(task.people);
	if (task.people == 1) {
		$("#"+id).find(".taskminus").removeClass("disabled");
	}
	bindPerson();
}

function taskMinus(id, person = null) {

	var task = data.tasks[id];
	if (task == null) return;
	if (task.people <= 0) return;

	var found = false;
	if (person) {
		person.task = null;
		found = true;
	} else {
		for (var i=0; i<data.people.length; i++) {
			if (data.people[i].task == id) {
				data.people[i].task = null; found = true;
				break;
			}
		}
	}
	if (!found) {console.log("taskMinus FAILED"); return;}

	task.people -= 1;
	$("#"+id).find(".number").text(task.people);
	if (task.people <= 0) {
		$("#"+id).find(".taskminus").addClass("disabled");
	}
	releasePerson();
}

function checkResources(dtask, consumes) {
	if (dtask.tech) {
		for (var i=0; i<dtask.tech.length; i++) {
			var req = dtask.tech[i];
			var item = findItem(req.id);
			if (!item || item.count < req.count) {
				return false;
			}
		}
	}
	if (dtask.requires) {
		for (var i=0; i<dtask.requires.length; i++) {
			var req = dtask.requires[i];
			var item = findItem(req.id);
			if (!item || item.count < req.count) {
				return false;
			}
		}
		if (consumes) {
			for (var i=0; i<dtask.requires.length; i++) {
				removeItem(dtask.requires[i].id, dtask.requires[i].count);
			}
		}
	}
	return true;
}

function doTask(id, task, dtask, dt, effort) {
	if (!checkResources(dtask, false)) return false;

	task.progress += effort * dt;
	if (task.progress >= dtask.effort) {
		finishTask(id, task, dtask);
		task.progress -= dtask.effort;
	}
	updateTaskBar(id, task, dtask);
	return true;
}

function updateTasks(dt) {
	if (data.pending != null) {
		var task = data.tasks[data.pending];
		var dtask = d.tasks[task.id];
		if (task != null && dtask != null) {
			doTask(data.pending, task, dtask, dt, 1);
		}
	}
	for (var i=0; i<data.people.length; i++) {
		var person = data.people[i];
		if (person.task != null && person.effort != null) {
			var task = data.tasks[person.task];
			var dtask = d.tasks[task.id];
			if (task != null && dtask != null) {
				var success = doTask(person.task, task, dtask, dt, person.effort);
				if (!success) continue;
				var attack = dtask.attack ? dtask.attack : 0;
				updatePersonEffort(dt, person, attack);
			}
		}
	}
}

function getTaskCount(id) {
	count = 0;
	var keys = Object.keys(data.tasks);
	for (var i in keys) {
		if (data.tasks[keys[i]].id == id)
			count++;
	}
	return count;
}

function destroyTask(id, task, dtask) {
	if (data.pending == id)
		data.pending = null;

	for (var i=0; i<data.people.length; i++) {
		var c = data.people[i];
		if (c.task == id) {
			c.task = null;
			releasePerson();
		}
	}
	removeTabTask(dtask.tab);
	$("#"+id).hide(500, function() {$(this).remove();});
	delete data.tasks[id];

}

function finishTask(id, task, dtask) {
	function getRandVal(obj) {
		if (obj && obj.max != undefined && obj.min != undefined) {
			var val = Math.random() * (obj.max - obj.min) + obj.min;
			return Math.round(val);
		}
		if (obj)
			console.log("ERROR: min or max value undefined min:" + obj.min + " max:" + obj.max);
		return 0;
	}

	checkResources(dtask, true);

	if (dtask.loot) {
		for (var i=0; i<dtask.loot.length; i++) {
			var loot = dtask.loot[i];
			if (loot && loot.id) {
				var count = loot.count ? loot.count : 1;
				for (var j=0; j<count; j++) {
					if (!loot.prob || loot.prob >= 1) {
						addItem(loot.id);
					} else {
						if (Math.random() < loot.prob) {
							addItem(loot.id);
						}
					}
				}
			}
		}
	}

	var doUpdate = false;
	if (dtask.food) {
		var val = getRandVal(dtask.food);
		data.general.food += val;
		setAddIcon("g_food", val);
		doUpdate = true;
	}
	if (dtask.water) {
		var val = getRandVal(dtask.water);
		data.general.water += val;
		setAddIcon("g_water", val);
		doUpdate = true;
	}
	if (dtask.money) {
		var val = getRandVal(dtask.money);
		if (data.general.money < 0 && val > 0) data.general.money = 0;
		data.general.money += val;
		setAddIcon("g_money", val);
		doUpdate = true;
	}
	if (dtask.medkits) {
		var val = getRandVal(dtask.medkits);
		if (data.general.medkits < 0 && val > 0) data.general.medkits = 0;
		data.general.medkits += val;
		setAddIcon("g_medkits", val);
		doUpdate = true;
	}
	if (doUpdate) { updateGenerals(); }


	if (dtask.people && !task.peopleFound) {
		for (var i=0; i<dtask.people.length; i++) {
			var person = dtask.people[i];
			addPerson(person.health, person.log);
		}
		task.peopleFound = true;
	}

	if (dtask.ntasks && dtask.ntasks.length > 0) {
		var probsum = 0;
		for (var i=0; i<dtask.ntasks.length; i++) {
			var ntask = dtask.ntasks[i];
			var prob = ntask.prob ? ntask.prob : 1;
			if (ntask.max && task.tasks[ntask.id] && task.tasks[ntask.id].count >= ntask.max) {
				prob = 0;
			}
			probsum += prob;
		}
		var randprob = Math.random() * probsum;
		probsum = 0;
		var ix = -1;
		for (var i=0; i<dtask.ntasks.length; i++) {
			var ntask = dtask.ntasks[i];
			var prob = ntask.prob ? ntask.prob : 1;
			if (ntask.max && task.tasks[ntask.id] && task.tasks[ntask.id].count >= ntask.max) {
				prob = 0;
			}
			probsum += prob;
			if (randprob < probsum) {
				ix = i;
				break;
			}
		}
		if (ix >= 0) {
			var ntask = dtask.ntasks[ix];
			if (ntask != null && d.tasks[ntask.id]) {
				var canAdd = true;
				if (ntask.maxglob && getTaskCount(ntask.id) >= ntask.maxglob) {
					canAdd = false;
				}
				if (ntask.max && task.tasks[ntask.id] && task.tasks[ntask.id].count >= ntask.max) {
					canAdd = false;
				}
				if (canAdd) {
					if (!task.tasks[ntask.id])
						task.tasks[ntask.id] = {count: 0};
					task.tasks[ntask.id].count+=1;
					addTask(ntask.id);
				}
			}
		}
	}

	if (dtask.durability > 0) {
		task.dleft -= 1;
		var elem = $("#"+id).find(".taskDurabilityBar");
		elem.css("width", (task.dleft / dtask.durability * 100) + "%");
		if (task.dleft <= 0) {
			destroyTask(id, task, dtask);
		}
	}
}

function updateTaskBar(id, task, dtask) {
	var elem = $("#"+id).find(".taskBar");
	elem.css("width", (task.progress / dtask.effort * 100) + "%");
}
