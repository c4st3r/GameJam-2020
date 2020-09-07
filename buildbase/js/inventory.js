function findItem(id) {
	var item = data.items[id];
	return item ? item : null;

}

function setAddIcon(id, count) {
	$("#ia_"+id).text("+" + count);
	$("#ia_"+id).removeClass("removed");
	iconItems[id] = {time: 200};
}

function setRemoveIcon(id, count) {
	$("#ia_"+id).text("-" + count);
	$("#ia_"+id).addClass("removed");
	iconItems[id] = {time: 200};
}


function addItem(id, num = 1) {
	ditem = d.items[id];
	if (ditem == null) return;
	
	found = data.items[id];
	if (found == null) {
		found = {id: id, item: ditem, count: 0}
		data.items[id] = found;
	}
	found.count += num;
	updateItem(id, ditem.name, ditem.cat, found);
	itemChanged(id, found);
	setAddIcon(id, num);
	
	log("New item: " + ditem.name, "loggreen", false);
	
	if (id == "effigy") {
		setTimeout(function(){
			showWinGameModal();
		}, 500);
	}
}

function removeItem(id, num = 1) {
	ditem = d.items[id];
	if (ditem == null) return;
	
	found = data.items[id];
	if (found == null) return;
	found.count -= num;
	updateItem(id, ditem.name, ditem.cat, found);
	itemChanged(id, found);
	setRemoveIcon(id, num);
}

function itemChanged(id, item = null) {
	if (!item) {
		item = findItem(id)
		//if (item == null) return;
	}
	changedItems[id] = item;
}

function closeCategory(category) {
	var catalog = $("#cat_"+category);
	var open = $("#open"+category);
	catalog.toggle();
	
	if (open.hasClass("icon-right-open-1")) {
		open.removeClass("icon-right-open-1");
		open.addClass("icon-down-open-1");
	} else {
		open.removeClass("icon-down-open-1");
		open.addClass("icon-right-open-1");
	}
	
	if (category == "people") {
		updatePeopleItems();
	}
}

function makeItemHeader(id) {
	var name = id.charAt(0).toUpperCase() + id.substr(1);
	return "<thead><tr><th colspan='2' onclick='closeCategory(\""+id+"\")'><span id='open"+id+"'class='icon-right-open-1'></span>"+name+"</th></tr></thead>";
}

function makeItemRow(id, name, count, tooltip = null) {
	var ttip = "";
	if (tooltip) {
		ttip = "<span class='tooltip'>"+tooltip+"</span>";
	}
	return "<tr id='itr_"+id+"' class='irow'><td class='name'>"+name+""+ttip+ "</td><td id='i_"+id+"' class='amount'>"+count+"</td><td id='ia_"+id+"' class='iadd' width='30px'></td></tr>";
}

function makeGeneralItems() {
	var hm = "";
	hm += makeItemHeader("general");
	hm += "<tbody id='cat_general'>";
	hm += makeItemRow("g_people", "<span class='icon-male'>", 0, "people");
	hm += makeItemRow("g_money", "<span class='icon-money'>", 0, "money");
	hm += makeItemRow("g_food", "<span class='icon-food'>", 0, "food");
	hm += makeItemRow("g_water", "<span class='icon-droplet'>", 0, "water");
	hm += makeItemRow("g_medkits", "<span class='icon-medkit'>", 0, "medicine");
	hm += "</tbody>";
	return hm;
}

function updatePersonRow(elem, icon, hunger, thirst, health, task) {
	elem.find(".hunger").css("width", hunger + "%");
	elem.find(".thirst").css("width", thirst + "%");
	elem.find(".health").css("width", health + "%");
	elem.find(".thunger").html(Math.round(hunger) + "%");
	elem.find(".tthirst").html(Math.round(thirst) + "%");
	elem.find(".thealth").html(Math.round(health) + "%");
	if (task) {
		elem.find(".personIcon").addClass("personOpaque");
	} else {
		elem.find(".personIcon").removeClass("personOpaque");
	}
}

function makePersonRow(id, icon, hunger, thirst, health, task, tooltip = null) {
	var ttip = "";
	if (tooltip) {
		ttip = "<span class='tooltip'>"+tooltip+
		"<table>"+
		"<tr><td class='name'>Hunger:</td><td class='thunger'>"+Math.round(hunger)+"%</td>" +
		"<tr><td class='name'>Thirst:</td><td class='tthirst'>"+Math.round(thirst)+"%</td>" +
		"<tr><td class='name'>Health:</td><td class='thealth'>"+Math.round(health)+"%</td>" +		
		"</table>"+
		"</span>";
	}
	var classes = task ? " personOpaque" : "";
	return "<tr id='pp"+id+"'><td class='name' colspan='2'>" +
		"<div class='personProfile'>" + 
		"<div class='personIcon "+icon+" "+classes+"'></div>" +
		"<div class='person'>" +
			"<div class='personBar hunger' style='width:"+hunger+"%'></div>" +
			"<div class='personBar thirst' style='width:"+thirst+"%'></div>" +
			"<div class='personBar health' style='width:"+health+"%'></div>" +
		"</div></div>" +
		ttip + "</td></tr>";
}

function makePeopleItems() {
	var hm = "";
	hm += makeItemHeader("people");
	hm += "<tbody id='cat_people'>";
	hm += "</tbody>";
	hm += "<tbody><tr><td class='name' colspan='2'><button onclick='releaseAllPeople()' class='releaseButton disabled'>Release all</button></td></tr></tbody>";
	return hm;
}

function updatePeopleItems() {
	var open = $("#openpeople");
	if (open.hasClass("icon-down-open-1")) {
		return;
	}
	for (var i=0; i<data.people.length; i++) {	
		var person = data.people[i];	
		var elem = $("#pp"+person.id);
		if (elem.length) {
			updatePersonRow(elem, "icon-user", 
				person.hunger/person.maxhunger * 100, 
				person.thirst/person.maxthirst * 100, 
				person.health/person.maxhealth * 100,
				person.task);
		}
		else 
		{
			var hm = makePersonRow(person.id, "icon-user", 
				person.hunger/person.maxhunger * 100, 
				person.thirst/person.maxthirst * 100, 
				person.health/person.maxhealth * 100,
				person.task,
				"<b>"+person.name+"</b>");
			$("#cat_people").append(hm);
		}
	}
}

function updateGenerals() {
	$("#i_g_people").text(data.general.availablePeople + "/" +data.people.length);
	$("#i_g_money").text(data.general.money);
	$("#i_g_food").text(data.general.food);
	$("#i_g_water").text(data.general.water);
	$("#i_g_medkits").text(data.general.medkits);
	
	if (data.general.money < 0) {
		$("#itr_g_money").hide();
	} else {
		$("#itr_g_money").show();
	}
	
	if (data.general.medkits < 0) {
		$("#itr_g_medkits").hide();
	} else {
		$("#itr_g_medkits").show();
	}
	
	if (data.general.food == 0) {
		$("#itr_g_food").addClass("lacking");
	} else {
		$("#itr_g_food").removeClass("lacking");
	}
	
	if (data.general.water == 0) {
		$("#itr_g_water").addClass("lacking");
	} else {
		$("#itr_g_water").removeClass("lacking");
	}
}

function removeFood(amount) {
	data.general.food -= 1;
	updateGenerals();
	setRemoveIcon("g_food", 1);
	if (data.general.food == data.people.length) {
		log("You are running out of food!", "logorange");
	}
	if (data.general.food == 0) {
		log("You are out of food!", "logred");
	}
}

function removeWater(amount) {
	data.general.water -= 1;
	updateGenerals();
	setRemoveIcon("g_water", 1);
	if (data.general.water == data.people.length) {
		log("You are running out of water!", "logorange");
	}
	if (data.general.water == 0) {
		log("You are out of water!", "logred");
	}
}

function removeMedkit(amount) {
	data.general.medkits -= 1;
	updateGenerals();
	setRemoveIcon("g_medkits", 1);
	if (data.general.medkits == 1) {
		log("You are running out of medicine!", "logorange");
	}
	if (data.general.medkits == 0) {
		log("You are out of medicine!", "logred");
	}
}

function updateItem(id, name, cat, item) {
	var elem = $("#i_"+id);
	if (elem.length) {
		/*if (item.count <= 0) {
			elem.parent().remove();
		} else {
			elem.text(item.count);
		}*/
		elem.text(item.count);
	} else {
		var celem = $("#cat_" + cat);
		if (!celem.length) {
			$("#items").append(makeItemHeader(cat));
			$("#items").append("<tbody id='cat_"+cat+"'></tbody>");
			celem = $("#cat_" + cat);
		}
		celem.append(makeItemRow(id, name, item.count));
	}
}

function refreshItems() {
	$("#items").empty();
	hm = makeGeneralItems();
	hm += makePeopleItems();
	$("#items").html(hm);
	updateGenerals();
	updatePeopleItems();
	
	var names = Object.keys(data.items);
	for (var i in names) {
		var item = data.items[names[i]];
		var ditem = d.items[names[i]];
		updateItem(item.id, ditem.name, ditem.cat, item);
	}
}

