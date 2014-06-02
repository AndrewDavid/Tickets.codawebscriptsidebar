//	_  _ ____ ___  _ ____ _ ____ _  _
//	|\/| |___ |  \ | |__| | [__  |\/|
//	|  | |___ |__/ | |  | | ___] |  |
//	-------------------------------------------
//	The Braid UG (haftungsbeschraenkt)
//	mediaism
//	Westring 200
//	24106 Kiel // GERMANY
//	author: Bjoern Diekert / Germany / Kiel
//	e-mail: bd@mediaism.de
// -------------------------------------------
//	Date (DD.MM.YY): 02.06.14

var json;
var projektUUID = CodaTextView.siteUUID();
var projektID = projektUUID + '_todo';

setInterval(function(){

	if(projektUUID != CodaTextView.siteUUID()) {
		projektID = CodaTextView.siteUUID() + '_todo';
		getTodos();
	}

}, 1000);

function getTodos() {

	var myStorage = localStorage.getItem(projektID);

	if(myStorage === null) {
		json = [];
		saveTodoList();
	}
	else {
		json = $.parseJSON(myStorage);

		var output = '';
		var outputDone = '';
		var i = 0;
		$.each(json, function() {


			if(this['file'] != false) {
				var fileName = this['file'].replace(CodaTextView.siteLocalPath(),'');
			}
			else {
				var fileName = this['file'];
			}

			if(this['state'] === 'done') {
				outputDone += '<div class="todo '+ this['state'] +'" id="todo_'+ this['id'] +'" data-type="'+ this['type'] +'"><div class="todoTop">';
				outputDone += '<div class="check" onclick="check('+i+')"></div><div class="tag '+ this['type'] +'">'+ this['type'] +'</div>';
				outputDone += '<h2>'+ this['title'] +'</h2></div>';
				outputDone += '<div class="todoContainer"><div class="textWrapper"><p>'+ this['description'] +'</p>';

				if(this['file'] != false) {
					outputDone += '<div class="info" onclick="goto(\''+ this['file'] +'\', '+this['line']+', '+this['column']+');">'+fileName+':'+this['line']+'</div>';
				}

				outputDone += '</div><div class="toolbox"><ul><li>Edit</li><li onclick="removeTodo('+i+')">Delete</li></ul></div></div></div>';

			}
			else {

				output += '<div class="todo '+ this['state'] +'" id="todo_'+ this['id'] +'" data-type="'+ this['type'] +'"><div class="todoTop">';
				output += '<div class="check" onclick="check('+i+')"></div><div class="tag '+ this['type'] +'">'+ this['type'] +'</div>';
				output += '<h2>'+ this['title'] +'</h2></div>';
				output += '<div class="todoContainer"><div class="textWrapper"><p>'+ this['description'] +'</p>';

				if(this['file'] != false) {
					output += '<div class="info" onclick="goto(\''+ this['file'] +'\', '+this['line']+', '+this['column']+');">'+fileName+':'+this['line']+'</div>';
				}

				output += '</div><div class="toolbox"><ul><li>Edit</li><li onclick="removeTodo('+i+')">Delete</li></ul></div></div></div>';
			}

			i++;

		})

		$('#todoList').html(output);
		$('#todoListDone').html(outputDone);
		akkordeon();
	}
}

function saveTodoList() {
	localStorage.setItem(projektID, JSON.stringify(json));
}

function addTodo(todotype, todotitle, tododescription, todowithlines) {

	var tempId = json.length + 1;

	if(todowithlines === true) {
		json.push({"id": tempId,"type": todotype,"state": "open","line": CodaTextView.currentLineNumber(),"column": CodaTextView.getColumn(),"file": CodaTextView.path(),"title": todotitle,"description": tododescription});
	}
	else {
		json.push({"id": tempId,"type": todotype,"state": "open","line": false,"column": false,"file": false,"title": todotitle,"description": tododescription});
	}

	saveTodoList();
	getTodos();
}

function check(id) {
	json[id]['state'] = "done";
	saveTodoList();
	getTodos();
}

function uncheck(id) {
	json[id]['state'] = "open";
	saveTodoList();
	getTodos();
}

function removeTodo(id) {
	json.splice(id,1);
	saveTodoList();
	getTodos();
}

function goto(file, line, column) {
	CodaPlugInsController.openFileAtPath(file);
	CodaTextView.goToLineAndColumn(line,column)
}

function akkordeon() {
	$('.todoTop').not('.todoTop_active').next('.todoContainer').hide();
	$('.todoTop').click( function() {
		var trig = $(this);
		if ( trig.hasClass('todoTop_active') ) {
			trig.next('.todoContainer').slideToggle(200);
			trig.removeClass('todoTop_active');
		} else {
			$('.todoTop_active').next('.todoContainer').slideToggle(200);
			$('.todoTop_active').removeClass('todoTop_active');
			trig.next('.todoContainer').slideToggle(200);
			trig.addClass('todoTop_active');
		}
		return false;
	});
}

function clearform() {
	$('#addTodoDialogForm').trigger("reset");
	$('#addTodoDialogForm input').removeAttr('checked');
	$('.addIcon').removeClass('active');
	$('#addTodoDialog').hide();
}


$(document).ready(function () {

	$('#addTodoDialog').hide();

	$('#addTodoButton').click(function(){
		$('#addTodoDialog').show();
	});

	// ADD Todo Dialog
	$("#addBug").click(function () {
		$('input:radio[name=addTodoType]:nth(0)').attr('checked',true);
		$('.addIcon').removeClass('active');
		$(this).addClass('active');
	});

	$("#addFeat").click(function () {
		$('input:radio[name=addTodoType]:nth(1)').attr('checked',true);
		$('.addIcon').removeClass('active');
		$(this).addClass('active');
	});

	$("#addTodo").click(function () {
		$('input:radio[name=addTodoType]:nth(2)').attr('checked',true);
		$('.addIcon').removeClass('active');
		$(this).addClass('active');
	});

	// Sumit Todo without Line-Numbers
	$('#submitTodo').click(function(){

		if($("input:radio:checked[name='addTodoType']").val() != undefined && $("#addTodoTitle").val() != '' && $("#addTodoDescription").val() != '') {
			addTodo($("input[name='addTodoType']:checked").val(), $("#addTodoTitle").val(), $("#addTodoDescription").val(), false);
			clearform();
		}
		return false;
	});

	// Submit Todo with Line-Numbers
	$('#submitTodoLine').click(function(){
		if($("input:radio:checked[name='addTodoType']").val() != undefined && $("#addTodoTitle").val() != '' && $("#addTodoDescription").val() != '') {
			addTodo($("input[name='addTodoType']:checked").val(), $("#addTodoTitle").val(), $("#addTodoDescription").val(), true);
			clearform();
		}
		return false;
	});


});