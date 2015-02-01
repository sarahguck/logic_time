var Proof;
var Fitch;

var Caddy = {
  help:{
    'start screen':{
      messages:[
        'Type one word in each hole!',
        '<u>What are you talking about</u><br> \
        Fitch Fairway is an ok HTML logic game meant to help you practice deriving righteous conclusions from given premises. \
        "Fitch" is the name of the system (don\'t worry about that).<br><br> \
        <u>To start</u><br>Type any three words in the unattractive black ovoids, hit "submit", \
        and you will receive your very own personalized premises and a conclusion to prove.<br><br> \
        <u>The attractive 3D caddy</u><br> \
        is here for your viewing pleasure, and to provide helpful tips along the way. \
        Click his beacon anytime to access this Information Cube.'
      ],
      arrow_id:'var_input_arrow'
    },
    'rule needs two reference lines':{
      messages:['You need to reference two lines to apply this rule. Click the check box on the left to reference a line.'],
      arrow_id:'checkbox_arrows'
    },
    'rule needs one reference line':{
      messages:['You need to reference one line to apply this rule. Click the check box on the left to reference a line.'],
      arrow_id:'checkbox_arrow'
    },
    'tried inactive implication introduction':{
      messages:[]
    }
  }
};

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
    inSubProof: function(){
      this.level != 0;
    },
		step: function(){
			this.step_num += 1;
		},
		addFormula: function(formula){
			this.formulae.push(formula);
			this.step();
		}
	};
	Fitch = {};
};

function assignTruths () {
	for (var propt in Proof.var_values) {
		Proof.var_values[propt] = Math.random() > 0.5 ? true : false;
	}
};

/*
Cube(b)
¬(Cube(c) ∧ Cube(b))
¬Cube(c)

¬(¬Dodec(b) ∨ ¬Dodec(c))
Dodec(b) ∧ Dodec(c)
*/

// [conclusion, premises*]
function makeGames (){
	var v = Proof.var_names;

	Fitch.games = [
		[	
			new Implication(new Variable(v[0]), new Variable(v[2])), 
			new Implication(new Variable(v[0]), new Variable(v[1])), 
			new Implication(new Variable(v[1]), new Variable(v[2])) 
		],
		[	
			new Disjunction(new Variable(v[0]), new Variable(v[2])),
			new Disjunction(new Variable(v[0]), new Variable(v[1])),
			new Disjunction(new Negation(new Variable(v[1])), new Variable(v[2])) 
		],
		[	
			new Disjunction(new Variable(v[0]), new Conjunction(new Variable(v[1]), new Variable(v[2]))),
			new Disjunction(new Variable(v[0]), new Variable(v[1])),
			new Disjunction(new Variable(v[0]), new Variable(v[2])) 
		],
		[	
			new Implication(new Implication(new Variable(v[0]), new Variable(v[1])), new Implication(new Variable(v[0]), new Variable(v[2]))),
			new Implication(new Variable(v[0]), new Implication(new Variable(v[1]), new Variable(v[2]))) 
		],
		[	
			new Negation(new Variable(v[2])), 
			new Variable(v[0]), 
			new Negation(new Conjunction(new Variable(v[2]), new Variable(v[1])))
		],
		[	
			new Negation(new Disjunction(new Negation(new Variable(v[0])), new Negation(new Variable(v[1])))),
			new Conjunction(new Variable(v[0]), new Variable(v[1]))
		]
	];

}

function parseText (text){
	return handleParserObject(Parser.exports.parse(text));
}

function initGame (){
	var n = Math.floor(Math.random() * Fitch.games.length);
	n = 5; // for testing
	addConclusion(Fitch.games[n].shift());
	addLines(Fitch.games[n]);
  for (var i = 0; i < Fitch.games[n].length; i++) {
    Fitch.games[n][i].premise = true;
  };
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

	var modals = document.getElementsByClassName("click_to_close");
	for (var i = 0; i < modals.length; i++) {
    modals[i].addEventListener('click', hideModal, false);
	}

	var symbols = document.getElementsByClassName("insert_symbol");
	for (var i = 0; i < symbols.length; i++) {
    symbols[i].addEventListener('click', insertSymbol, false);
	}

  var intro_inputs = document.getElementsByClassName("var_input");
  for (var i = 0; i < intro_inputs.length; i++) {
    intro_inputs[i].addEventListener('keyup', varInputKeyup, false);
  }
  intro_inputs[0].focus();

	document.getElementById('satelloon').addEventListener('click', playMessage, false);
	document.getElementById('submit_vars').addEventListener('click', setVars, false);
	document.getElementById('reiterate').addEventListener('click', reiterate, false);
	document.getElementById('delete').addEventListener('click', handleDeletion, false);
	document.getElementById('assume').addEventListener('click', assume, false);
	document.getElementById('submit_assumption').addEventListener('click', handleInputSubmit, false);
	document.getElementById('abort_assumption').addEventListener('click', abortAssumption, false);
  document.getElementById('help').addEventListener('click', hideHelpCube, false);

  // document.getElementById('help_target').addEventListener('click', showHelpCube, false);
  // document.getElementById('cube_wrap').addEventListener('click', hideHelpCube, false);

	// initTest();
  // caddy stuff
  Caddy.masked_content = document.getElementById('caddy_content');
  Caddy.content_mask   = document.getElementById('caddy_mask');
  Caddy.drag_mask      = document.getElementById('drag_mask');
  Caddy.cube_faces     = document.getElementsByClassName('cube_message');
  Caddy.help_cube = document.getElementById('cube');
  Caddy.help_state = 'start screen';

  var faces = document.getElementsByClassName('cube_face');
  for (var i = 0; i < faces.length; i++) {
    faces[i].addEventListener('mouseenter', pauseCubeRotation, false);
    faces[i].addEventListener('mouseleave', resumeCubeRotation, false);
  }

  Caddy.content_mask.addEventListener('mousedown', initCaddyDrag, false);

};

function varInputKeyup (event) {
  if (event.keyCode == 13) {
    document.getElementById('submit_vars').click();
  }
}

function pauseCubeRotation () {
  Caddy.help_cube.className = '';
}

function resumeCubeRotation () {
  Caddy.help_cube.className = 'rotate';
}

function showHelpCube () {
  showModal('help');
  document.getElementById('cube_wrap').className = 'show';
  Caddy.help_cube.className = 'rotate';

  var message = Caddy.help[Caddy.help_state].messages[1];
  for (var i = 0; i < Caddy.cube_faces.length; i++) {
    Caddy.cube_faces[i].innerHTML = message;
  };
}

function hideHelpCube () {
  hideModal.call(this);
  document.getElementById('cube_wrap').className = '';
  Caddy.help_cube.className = '';
}

function initCaddyDrag (e) {
  if (e.target.getAttribute('id') == 'help_target') {
    showHelpCube();
    return;
  }

	Caddy.drag_mask.className = 'show';

	var offsetX = e.clientX - Caddy.content_mask.offsetLeft;
	var offsetY = e.clientY - Caddy.content_mask.offsetTop;

	function dragCaddy(e){
		var x = e.clientX - offsetX;
		var y = e.clientY - offsetY;
		Caddy.masked_content.style.top  = y + 'px';
		Caddy.masked_content.style.left = x + 'px';
		Caddy.content_mask.style.top  = y + 'px';
		Caddy.content_mask.style.left = x + 'px';
	};

	function disableCaddyDrag(){
		Caddy.drag_mask.className = '';
		document.removeEventListener('mousemove', dragCaddy, false);
		document.removeEventListener('mouseup', disableCaddyDrag, false);
		document.getElementById('caddy_mask').removeEventListener('mouseup', disableCaddyDrag, false);
	}

	document.addEventListener('mousemove', dragCaddy, false);
	document.addEventListener('mouseup', disableCaddyDrag, false);
	Caddy.content_mask.addEventListener('mouseup', disableCaddyDrag, false);
}



function insertSymbol () {
	var field  = document.getElementById('assumption');
	field.value += this.getAttribute('data-symbol');
}

function handleInputSubmit () {
	var field  = document.getElementById('assumption');
	var text 	 = field.value.replace(/\s/g, '');
	if (text == '') {
		alert('naw');
		return;
	}

	var parsed = Parser.exports.parse(text);
	var obj 	 = handleParserObject(parsed);
	if (Proof.or_introduction_in_progress) {
		var formulae = getFormulae();
		formulae.push(obj);
		var new_formulae = finishOrIntroduction(formulae);
		if (new_formulae) {
			addLines(new_formulae);
		}
	} else {
    makeAssumption(obj);
  }

	hideChoices();
	field.value = '';
  Proof.or_introduction_in_progress = false;
}

function abortAssumption () {
	hideChoices();
	document.getElementById('assumption').value = '';
}

function handleParserObject (obj) {
	return makeObj(obj.obj, obj.left, obj.right);
}

function makeObj (constructor, left, right) {
	if (constructor == 'Variable') {
		return new Variable(left, right);
	} else {
		return new (eval(constructor))(makeObj(left.obj, left.left, left.right), makeObj(right.obj, right.left, right.right));
	}
}

function initTest () {
	setTestVars();
	// makePremises();
	initGame();
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
	Proof.level		+= 1;
	showChoices();
};

function setVars () {
	var name;
	var flag = false;
	var inputs 		 = document.getElementsByClassName('var_input');
	var var_values = {};
	var var_names	 = [];
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].value == '') {
			alert('come on');
			flag = true;
			return;
		}
    if (inputs[i].value.toLowerCase().replace(/\s/g, '').match(/[^a-z]/g, '')) {
      alert('seriously, a-z');
      if (hasDuplicates(var_names)) {
        alert('AND NO DUPLICATES!');
      }
      return;
    }
		name = inputs[i].value.replace(/[^a-z]/g, '').toLowerCase();
		var_values[name] = true;
		var_names.push(name);
	};
	if (hasDuplicates(var_names)) {
		alert('Fool! You make duplicate! Now you play MY WAY!');
		setTestVars();
	} else {
		flag ? alert('THANKS') : alert('Thanks');
		Proof.var_values = var_values;
		Proof.var_names  = var_names;
	}	
	document.getElementById('get_vars').className = 'modal';
	assignTruths();
	// makePremises();	
	makeGames();
	initGame();	
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
	document.getElementById('middle').className = 'assume';
};

function hideChoices () {
	document.getElementById('inputs').className = '';
	document.getElementById('middle').className = '';
};

function makeAssumption (formula) {
	openSubProof();
	document.getElementById('implication_introduction').className += ' active';
	addLines([formula]);
};

function exitAssumption () {
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
	if (e && e.target.tagName == 'INPUT') return;
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

function setLineIndex (line, index) {
	line.setAttribute('data-index', index);
	line.setAttribute('id', 'line_' + index);

	var checkbox = line.childNodes[0];
	checkbox.setAttribute('id', 'box_' + index);
	checkbox.setAttribute('data-index', index);

	var label = line.childNodes[1];
	label.setAttribute('for', 'box_' + index);
};

function reIndexLines () {
	Proof.checked = [];
	var lines = getlines();
	for (var i = 0; i < lines.length; i++) {
		setLineIndex(lines[i], i);
		if (lines[i].childNodes[0].checked) {
			Proof.checked.push(i);
		}
	};
}
	
function getlines () {
	return document.getElementsByClassName("line");
}

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

	document.getElementById('or_introduction').onclick = handleOrIntroduction;
	document.getElementById('implication_introduction').onclick = function(){
		pushButton(this);
		generateFormulae(this);
	}
};

function handleOrIntroduction() {
  Proof.or_introduction_in_progress = true;
  showChoices();
}

function getRuleHandler(rule) {
	var fn_name = 'generate';
	var text 		= rule.childNodes[0].innerHTML.split('<br>');
	for (var i = 0; i < text.length; i++) {
		fn_name += text[i].charAt(0).toUpperCase() + text[i].slice(1);
	};
	return fn_name;
};

function addConclusion(line) {
	Proof.conclusion = line;

	var concl = document.createElement('span');
	concl.setAttribute('id', 'conclusion');
	concl.innerHTML = line.inspect;

	var flag = document.createElement('div');
	flag.setAttribute('id', 'flag');

	var pole = document.createElement('div');
	pole.setAttribute('id', 'pole');

	var hole = document.createElement('div');
	hole.setAttribute('id', 'hole');

	var container = document.getElementById('conclusion_container');
	container.appendChild(concl);
	container.appendChild(flag);
	container.appendChild(pole);
	container.appendChild(hole);
};

function addLines(lines) {
	for (var i = 0; i < lines.length; i++) {
		var text = lines[i].inspect;
		new_line = genHTML(text);
		Proof.body.appendChild(new_line);
		Proof.addFormula(lines[i]);
		if (Proof.inSubProof()) Proof.assumption.step_num += 1;
		if (text == Proof.conclusion.inspect) {
			alert('you win');
		}
	}
	uncheckAll();
};

function genHTML(text) {
	var new_line = document.createElement('li');
	new_line.setAttribute('data-index', Proof.step_num);
	new_line.setAttribute('class', 'line');
	new_line.setAttribute('id', 'line_' + Proof.step_num);

	var checkbox = document.createElement('input');
	checkbox.setAttribute('type', 'checkbox');
	checkbox.setAttribute('id', 'box_' + Proof.step_num);
	checkbox.setAttribute('data-index', Proof.step_num);
	checkbox.addEventListener('change', handleCheck, false);

	var span1 = document.createElement('span');
	span1.setAttribute('class', 'vert');

	var span2 = document.createElement('span');
	span2.setAttribute('class', 'horiz');

	var label = document.createElement('label');
	label.setAttribute('for', 'box_' + Proof.step_num);

	var sentence = document.createElement('p');
	sentence.innerHTML = text;

	label.appendChild(span1);
	label.appendChild(span2);
	new_line.appendChild(checkbox);
	new_line.appendChild(label);
	new_line.appendChild(sentence);

	return new_line;
}


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

function handleDeletion(){
  deleteFromLine(Math.min(Proof.checked));
  Proof.checked  = [];

	// deleteLines();
};

function deleteFromLine (line_num) {
  var e;
  for (var i = line_num; i < Proof.formulae.length; i++) {
    e = document.getElementById('line_' + i);
    e.parentElement.removeChild(e);
    if (Proof.formulae[i].assumption) {
      var subproof = getLastSubproofBodyAtLevel(Proof.formulae[i].level);
      subproof.parentElement.removeChild(subproof);
    }
  };
  resetProofToLine(line_num - 1);
};

function getLastSubproofBodyAtLevel (level) {
  var proof_body_candidates = document.getElementsByClassName('level_' + Proof.level);
  return proof_body_candidates[proof_body_candidates.length - 1];  
}

function resetProofToLine (line_num) {
  Proof.formulae.splice(line_num);
  Proof.step_num = line_num;
  Proof.level   += Proof.formulae[line_num].level;  
  Proof.body     = getLastSubproofBodyAtLevel(Proof.level);
};

function deleteLines () {
	var checked = getCheckedLines();
	var remove 	= [];
	for (var i = 0; i < checked.length; i++) {
		Proof.body.removeChild(checked[i].parentNode);
		remove.push(parseInt(checked[i].getAttribute('data-index')));
	};
	Proof.checked = [];
	Proof.step_num -= checked.length;
	deleteFormulae(remove.sort().reverse());
};

function deleteFormulae (ordered_indices) {
	for (var i = 0; i < ordered_indices.length; i++) {
		// if (Proof.formulae[ordered_indices].assum)
		Proof.formulae.splice(ordered_indices[i], 1);
	};
	reIndexLines();
};

function openSubProof (argument) {
	var sub = document.createElement('li');
	sub.setAttribute('class', 'subproof');

	var bg = document.createElement('div');
	bg.setAttribute('class', 'subproof_bg');
	var line = document.createElement('div');
	line.setAttribute('class', 'subproof_marker');
	var sub_body = document.createElement('ol');
	sub_body.setAttribute('class', 'subproof_body proof_body level_' + Proof.level);

	sub.appendChild(line);
	sub.appendChild(bg);
	sub.appendChild(sub_body);
	Proof.body.appendChild(sub);
	Proof.body = sub_body;
};

function proofIsValid () {
  for (var i = 0; i < Proof.formulae.length; i++) {
    if (Proof.formulae[i].premise) {
      break;
    }

  };
}