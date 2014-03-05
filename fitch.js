

// function Formula (instance) {
// 	this.type  	 	 = Object.getProtoypeOf(instance);
// 	this.right 	 	 = right;
// 	this.inspect 	 = this.left.groupedInspect + ' ∨ ' + this.right.groupedInspect;
// 	this.groupedInspect	 = '(' + this.inspect + ')';
// 	this.eliminate = function(){
// 		return [this.left, this.right];
// 	}
// };

var Proof;

function initProof (argument) {
	Proof = {
		formulae:	 [],
		checked: 	 [],
		var_names: [],
		var_values:{},
		step_num:	 0,
		level:		 0,
		body:			 document.getElementById('proof'),
		assumption:{
			formulae:[],
			step_num:0
		},
		step: function(){
			this.step_num += 1;
		},
		addFormula: function(formula){
			this.formulae.push(formula);
			this.step();
		}
	};
};

function assignTruths () {
	for (var propt in Proof.var_values) {
		Proof.var_values[propt] = Math.random() > 0.5 ? true : false;
	}
};

function makePremises (argument) {
	var premises = [];
	var premise;
	var i = 0;
	var num;
	for (var propt in Proof.var_values) {
		num = Math.floor(Math.random() * 5);
		switch(num){
			case 0:
				premise = new Variable(propt);
				break;
			case 1:
				premise = new Conjunction(new Variable(propt), new Variable(Proof.var_names[Math.floor(Math.random() * 3)]));
				break;
			case 2:
				premise = new Disjunction(new Variable(propt), new Variable(Proof.var_names[Math.floor(Math.random() * 3)]));
				break;
			case 3:
				premise = new Implication(new Variable(propt), new Variable(Proof.var_names[Math.floor(Math.random() * 3)]));
				break;
			case 4:
				premise = new Equivalence(new Variable(propt), new Variable(Proof.var_names[Math.floor(Math.random() * 3)]));
				break;
		}
		if (Math.random() > 0.5) {
			premise = new Negation(premise);
		}

		premises.push(premise);
		i += 1;
	};

	premises.push(new Implication(new Variable('tiger'), new Variable('cube')));
	premises.push(new Implication(new Variable('cube'), new Variable('golf')));
	premises.push(new Implication(new Variable('golf'), new Variable('cube')));
	premises.push(new Implication(new Variable('golf'), new Negation(new Variable('cube'))));
	premises.push(new Disjunction(new Variable('tiger'), new Variable('golf')));
	premises.push(new Negation(new Negation(new Variable('golf'))));
	premises.push(new Variable('golf'));

	addLines(premises);
};

window.addEventListener("load", doShit, false);

function doShit() {
	initProof();
	setRuleHandlers();

	var choices = document.getElementsByClassName("choice");
	for (var i = 0; i < choices.length; i++) {
    choices[i].addEventListener('click', handleChoice, false);
	}

	var cubes = document.getElementsByClassName("cube");
	for (var i = 0; i < cubes.length; i++) {
    cubes[i].addEventListener('click', cubeClickHandler, false);
	}

	var modals = document.getElementsByClassName("modal");
	for (var i = 0; i < modals.length; i++) {
    modals[i].addEventListener('click', hideModal, false);
	}

	document.getElementById('satelloon').addEventListener('click', playMessage, false);
	document.getElementById('submit_vars').addEventListener('click', setVars, false);
	document.getElementById('reiterate').addEventListener('click', reiterate, false);
	document.getElementById('delete').addEventListener('click', deleteLines, false);
	document.getElementById('assume').addEventListener('click', assume, false);


	initTest();
};

function initTest () {
	setTestVars();
	setChoices();
	makePremises();
};

function playMessage () {
	playAudio('who_cares');
};

function playAudio (audio_id) {
   document.getElementById(audio_id).play();
};

function reiterate () {
	if (checkArity(this)) {
		var formulae = getFormulae();
		if (checkLevels(formulae)) {
			addLines([new formulae[0].constructor(formulae[0].left, formulae[0].right)]);
			return;
		}
	}
	alert('check yourself');
};

function assume () {
	Proof.assuming = true;
	Proof.level		+= 1;
	showChoices();
};

function setVars () {
	var name;
	var flag = false;
	var inputs 		 = document.getElementsByClassName("var");
	var var_values = {};
	var var_names	 = [];
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].value == '') {
			alert('come on');
			flag = true;
			return;
		}
		// remove spaces at beginnin and end of string ($.strip())
		name = inputs[i].value.replace(/\s/g, '_').toLowerCase();
		var_values[name] = true;
		var_names.push(name);
	};
	if (hasDuplicates(var_names)) {
		alert('Fool! You make duplicate! Now you play MY WAY!');
		setTextVars();
	} else {
		flag ? alert('THANKS') : alert('Thanks');
		Proof.var_values = var_values;
		Proof.var_names  = var_names;
	}	
	document.getElementById('get_vars').className = 'modal';
	setChoices();
	assignTruths();
	makePremises();		
};

function setTestVars() {
	Proof.var_values = {'golf':true, 'cube':true, 'tiger':true};
	Proof.var_names  = ['golf', 'cube', 'tiger'];
}

function hasDuplicates(array) {
  var valuesSoFar = {};
  for (var i = 0; i < array.length; ++i) {
    var value = array[i];
    if (Object.prototype.hasOwnProperty.call(valuesSoFar, value)) {
        return true;
    }
    valuesSoFar[value] = true;
  }
  return false;
};

function showChoices () {
	document.getElementById('inputs').className = 'show';
};

function hideChoices () {
	document.getElementById('inputs').className = '';
};

function setChoices () {
	var choices = document.getElementsByClassName("choice");
	for (var i = 0; i < choices.length; i++) {
    choices[i].innerHTML = Proof.var_names[i];
	}
};

function handleChoice () {
	var choice  = this.innerHTML;
	var formula = new Variable(choice);
	if (Proof.assuming) {
		makeAssumption(formula);
	} else {
		generateOrIntroduction(formula);
	}
	hideChoices();
};

function makeAssumption (formula) {
	openSubProof();
	document.getElementById('implication_introduction').className += ' active';
	addLines([formula]);
};

function exitAssumption () {
	Proof.assuming = false;
	Proof.level 	-= 1;
	Proof.body 		 = Proof.body.parentNode.parentNode;
};

function cubeClickHandler () {
	this.parentNode.removeChild(this);
	showModal('get_to_work');	
};

function showModal (modal_id) {
	document.getElementById(modal_id).className += " show";
};

function hideModal (e) {
	if (e.target.tagName == 'INPUT') return;
	this.className = "modal";
};

function handleCheck () {
	var index = parseInt(this.getAttribute('data-index'));
	if (this.checked) {
		Proof.checked.push(index);
	} else {
		var arr_index = Proof.checked.indexOf(index);
		if (arr_index > -1) Proof.checked.splice(arr_index, 1);
	}
};

function getExtremum (array, operator) {
	var extremum = array[0] || 0;
	for (var i = 0; i < array.length; i++) {
		if (eval(array[i] + operator + extremum)) extremum = array[i];
	};
	return extremum;
}

function checkArity (rule) {
	return parseInt(rule.getAttribute('data-arity')) == Proof.checked.length;
};

function checkLevels (formulae) {
	// ACTUALLY sarah you need make sure they're not from a previous subproof of the same level too.
	
	var checked = Proof.checked.sort(function(a,b){return b-a});
	var min 		= checked[checked.length - 1];
	// var max 		= checked[0];
	var max			= Proof.formulae.length - 1;
	var level 	= Proof.level;

	for (var i = max; i >= min; i--) {
		if (Proof.formulae[i].level < level) {
			level = Proof.formulae[i].level;
		} if (Proof.formulae[i].level > level) {
			for (var n = 0; n < checked.length; n++) {
				if (checked[n] == i) {
					return false;
				}
			};
		}
	};

	return true;
};

function handleRule () {
	var rule = this;
	pushButton(rule);
	if (checkArity(rule)) {
		var formulae = getFormulae();
		if (checkLevels(formulae)) {
			generateFormulae(rule, formulae);
			return;
		}
	}
	alert('check yourself');
};

function generateFormulae (rule, formulae) {
	var new_formulae = eval(getRuleHandler(rule)).call(rule, formulae);
	if (new_formulae) {
		addLines(new_formulae);
	}
};

function pushButton (button) {
	button.className += ' push';
	setTimeout(function(){
		button.className = 'rule';
	}, 500);
};

function setRuleHandlers () {
	var rules = document.getElementsByClassName('normal_rule');
	for (var i = 0; i < rules.length; i++) {
		rules[i].onclick = handleRule;
	};

	document.getElementById('or_introduction').onclick = showChoices;
	document.getElementById('implication_introduction').onclick = function(){
		pushButton(this);
		generateFormulae(this);
	}
};

function getRuleHandler(rule) {
	var fn_name = 'generate';
	var text 		= rule.innerHTML.split('<br>');
	for (var i = 0; i < text.length; i++) {
		fn_name += text[i].charAt(0).toUpperCase() + text[i].slice(1);
	};
	return fn_name;
};

function addLines(lines) {
	var new_line;
	var checkbox;
	var span1;
	var span2;
	var label;
	var sentence;
	for (var i = 0; i < lines.length; i++) {
		new_line = document.createElement('li');
		new_line.setAttribute('data-index', Proof.step_num);
		new_line.setAttribute('class', 'line');
		new_line.setAttribute('id', 'line_' + Proof.step_num);

		checkbox = document.createElement('input');
		checkbox.setAttribute('type', 'checkbox');
		checkbox.setAttribute('id', 'box_' + Proof.step_num);
		checkbox.setAttribute('data-index', Proof.step_num);
		checkbox.addEventListener('change', handleCheck, false);

		span1 = document.createElement('span');
		span1.setAttribute('class', 'vert');

		span2 = document.createElement('span');
		span2.setAttribute('class', 'horiz');

		label = document.createElement('label');
		label.setAttribute('for', 'box_' + Proof.step_num);

		sentence = document.createElement('p');
		sentence.innerHTML = lines[i].inspect;

		label.appendChild(span1);
		label.appendChild(span2);
		new_line.appendChild(checkbox);
		new_line.appendChild(label);
		new_line.appendChild(sentence);

		Proof.body.appendChild(new_line);

		Proof.addFormula(lines[i]);
		if (Proof.assuming) Proof.assumption.step_num += 1;
	}
	uncheckAll();
};

function uncheckAll () {
	var checked = getCheckedLines();
	for (var i = 0; i < checked.length; i++) {
		checked[i].checked = false;
	};
	Proof.checked = [];
};

function getCheckedLines() {
	var inputs  = document.getElementsByTagName("input");
	var checked = [];
	for (var i = 0; i < inputs.length; i++) {
	  if ((inputs[i].type == "checkbox") && (inputs[i].checked)) {
      checked.push(inputs[i]);
	  }
	}
	return checked;
};

function getFormulae () {
	var formulae = [];
	for (var i = 0; i < Proof.checked.length; i++) {
		formulae.push(Proof.formulae[Proof.checked[i]]);
	};
	return formulae;
};

function deleteLines () {
	var checked = getCheckedLines();
	var remove 	= [];
	for (var i = 0; i < checked.length; i++) {
		Proof.body.removeChild(checked[i].parentNode);
		remove.push(parseInt(checked[i].getAttribute('data-index')));
	};
	Proof.checked = [];
	//deleteFormulae(remove.sort().reverse());
};

function deleteFormulae (ordered_indices) {
	for (var i = 0; i < ordered_indices.length; i++) {
		Proof.formulae.splice(ordered_indices[i], 1);
	};
};

function openSubProof (argument) {
	var sub = document.createElement('li');
	sub.setAttribute('class', 'subproof');

	var bg = document.createElement('div');
	bg.setAttribute('class', 'subproof_bg');
	var line = document.createElement('div');
	line.setAttribute('class', 'subproof_marker');
	var sub_body = document.createElement('ol');
	sub_body.setAttribute('class', 'subproof_body proof_body');

	sub.appendChild(line);
	sub.appendChild(bg);
	sub.appendChild(sub_body);
	Proof.body.appendChild(sub);
	Proof.body = sub_body;
};