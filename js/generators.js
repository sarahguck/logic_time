function generateAndIntroduction(formulae) {
	return [new Conjunction(formulae[0], formulae[1])];
};

function generateAndElimination(formulae) {
	if (formulae[0] instanceof Conjunction) {
		return [new formulae[0].left.constructor(formulae[0].left.left, formulae[0].left.right), new formulae[0].right.constructor(formulae[0].right.left, formulae[0].right.right)];
	}
};

function generateOrIntroduction(formula) {
	var formulae = getFormulae();
	formulae.push(formula);

	if ((formulae.length == 2) && (checkLevel(formulae))) {
		addLines([new Disjunction(formulae[0], formulae[1])]);
	} else {
		alert('check yourself');
	}
	
};

function finishOrIntroduction (formulae) {
	return [new Disjunction(formulae[0], formulae[1])];
}

function generateOrElimination(formulae) {
	var disjunction = [];
	for (var i = 0; i < formulae.length; i++) {
		if (formulae[i] instanceof Disjunction) {
			disjunction.push(formulae[i]);
			formulae.splice(i, 1);
		}
	}
	if 	(
				(disjunction.length == 1) &&
				(formulae[0] instanceof Implication) &&
				(formulae[1] instanceof Implication) &&
				((formulae[0].left.inspect == disjunction[0].left.inspect) || (formulae[0].left.inspect == disjunction[0].right.inspect)) &&
				((formulae[1].left.inspect == disjunction[0].left.inspect) || (formulae[1].left.inspect == disjunction[0].right.inspect)) &&
				(formulae[0].right.inspect == formulae[1].right.inspect)
			) {
		return [new formulae[0].right.constructor(formulae[0].right.left, formulae[0].right.right)];
	}
};

function generateNegationIntroduction(formulae) {
	if 	(
				(formulae[0] instanceof Implication) && 
				(formulae[1] instanceof Implication) &&
				(formulae[0].left.inspect == formulae[1].left.inspect) &&
					(
						(formulae[0].right.inspect == (new Negation(formulae[1].right)).inspect) || 
						(formulae[1].right.inspect == (new Negation(formulae[0].right)).inspect)
					)
		  ) {
		// exitAssumption();
		return [new Negation(formulae[0].left)];
	} else {
		return false;
	}
	
};

function generateNegationElimination(formulae) {
	if ((formulae[0] instanceof Negation) && (formulae[0].left instanceof Negation)) {
		return [new formulae[0].left.left.constructor(formulae[0].left.left.left, formulae[0].left.left.right)];
	}
};

function generateImplicationIntroduction() {
	if (Proof.level != 0) {
		var consequent = Proof.formulae[Proof.formulae.length - 1];
		for (var i = Proof.formulae.length - 2; i >= 0; i--) {
			if (Proof.formulae[i].level < Proof.level) {
				var antecedent = Proof.formulae[i + 1];
				break;
			}
		};
		exitAssumption();
		return [new Implication(antecedent, consequent)];
	}
};

function generateImplicationElimination(formulae) {
	var implication = [];
	for (var i = 0; i < formulae.length; i++) {
		if (formulae[i] instanceof Implication) {
			implication.push(formulae[i]);
			formulae.splice(i, 1);
		}
	}
	if ((implication.length == 1) && (implication[0].left.inspect == formulae[0].inspect)) {
		return [new implication[0].right.constructor(implication[0].right.left, implication[0].right.right)];
	}
};

function generateEquivalenceIntroduction(formulae) {
	if ((formulae[0].left.inspect == formulae[1].right.inspect) && 
			(formulae[1].left.inspect == formulae[0].right.inspect)) {
		return [new Equivalence(formulae[0].left, formulae[1].left)]
	}
};

function generateEquivalenceElimination(formulae) {
	if (formulae[0] instanceof Equivalence) {
		return [new Implication(formulae[0].left, formulae[0].right), new Implication(formulae[0].right, formulae[0].left)];
	}
};