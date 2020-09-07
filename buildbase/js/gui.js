function hashCode(s) {
  var h = 0, l = s.length, i = 0;
  if ( l > 0 )
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
  return h.toString();
};

function addTabTask(tab) {
	if (!data.tabs) {data.tabs = {};}
	if (!data.tabs[tab]) {
		data.tabs[tab] = {count: 0}
	}
	data.tabs[tab].count += 1; 
	var elem = $("#tab_"+tab);
	elem.show();
	elem.find(".tabnum").html(data.tabs[tab].count);
	if(!elem.hasClass("new") && !elem.hasClass("active")){
		elem.addClass("new");
	}
}
function removeTabTask(tab) {
	data.tabs[tab].count -= 1;
	var elem = $("#tab_"+tab);
	elem.find(".tabnum").html(data.tabs[tab].count);
}

function openTab(evt, tabName) {
	$(".tabcontent").css("display", "none");
	$(".tablink").removeClass("active");
	
	$("#"+tabName).css("display", "block");
	
	var target = $(evt.target);
	if (!target.hasClass("tablink")) {
		target = target.parent();
	}
	target.addClass("active");
	target.removeClass("new");
}

function clearLog() {
	$("#logwindow").empty();
}

function log(text, type = "loggreen", duplicates = true) {
	var hash = hashCode(text);
	if (!duplicates && data.logs[hash] != undefined)
		return;
	
	$("<p class='"+type+" new'>"+text+"</p>").appendTo("#logwindow").hide().fadeIn(400, function() {$(this).removeClass('new')});
    $('#logwindow').animate({scrollTop: $('#logwindow')[0].scrollHeight}, "slow");
	
	if (!duplicates) {
		data.logs[hash] = text;
	}
}

function initModals() {
	window.onclick = function(event) {
		if (event.target == document.getElementById('endGameModal')) {
			closeEndGameModal();
		}
		if (event.target == document.getElementById('winGameModal')) {
			closeWinGameModal();
		}
		if (event.target == document.getElementById('creditsModal')) {
			closeCreditsModal();
		}
	}
}

function showCreditsModal() {
	var modal = document.getElementById('creditsModal');
	modal.style.display = "block";
}

function closeCreditsModal() {
	var modal = document.getElementById('creditsModal');
	modal.style.display = "none";
}

function showEndGameModal() {
	var modal = document.getElementById('endGameModal');
	modal.style.display = "block";
}

function closeEndGameModal() {
	var modal = document.getElementById('endGameModal');
	modal.style.display = "none";
}


function showWinGameModal() {
	var modal = document.getElementById('winGameModal');
	modal.style.display = "block";
}

function closeWinGameModal() {
	var modal = document.getElementById('winGameModal');
	modal.style.display = "none";
}
