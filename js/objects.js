// function Formula (left, right) {
// 	this.left  	 	 = left;
// 	this.right 	 	 = right;
// 	this.inspect 	 = this.left.groupedInspect + ' ∧ ' + this.right.groupedInspect;
// 	this.groupedInspect	 = '(' + this.inspect + ')';
// 	this.eliminate = function(){
// 		return [this.left, this.right];
// 	}
// 	this.level = Proof.level;
// };

function Conjunction (left, right) {
	this.left  	 	 = left;
	this.right 	 	 = right;
	this.inspect 	 = this.left.groupedInspect + ' ∧ ' + this.right.groupedInspect;
	this.groupedInspect	 = '(' + this.inspect + ')';
	this.eliminate = function(){
		return [this.left, this.right];
	}
	this.level      = Proof.level;
	this.assumption = isAssumption();
  this.premise    = false;
};

function Disjunction (left, right) {
	this.left  	 	 = left;
	this.right 	 	 = right;
	this.inspect 	 = this.left.groupedInspect + ' ∨ ' + this.right.groupedInspect;
	this.groupedInspect	 = '(' + this.inspect + ')';
	this.eliminate = function(){
		return [this.left, this.right];
	}
	this.level      = Proof.level;
	this.assumption = isAssumption();
  this.premise    = false;
};

function Negation (left) {
	this.left   = left;
	this.right	= left;
	this.inspect 	 = '¬' + this.left.groupedInspect;
	this.groupedInspect = this.inspect;
	this.level      = Proof.level;
	this.assumption = isAssumption();
  this.premise    = false;
};

function Implication (left, right) {
	this.left = left;
	this.right = right;
	this.inspect 		= this.left.groupedInspect + ' ⇒ ' + this.right.groupedInspect;
	this.groupedInspect = '(' + this.inspect + ')';
	this.level      = Proof.level;
	this.assumption = isAssumption();
  this.premise    = false;
};

function Equivalence (left, right) {
	this.left = left;
	this.right = right;
	this.inspect = this.left.groupedInspect + ' ⇔ ' + this.right.groupedInspect;
	this.groupedInspect = '(' + this.inspect + ')';
	this.level      = Proof.level;
	this.assumption = isAssumption();
  this.premise    = false;
};

function Variable (left, right) {
	this.left 	 = left;
	this.right	 = left;
	this.inspect = left;
	this.groupedInspect = this.inspect;
	this.level      = Proof.level;
  this.assumption = isAssumption();
  this.premise    = false;
}

function isAssumption(){
  return Proof.inSubProof() && Proof.assumption.step_num == 0;
}

function isPremise(){
  return Proof.adding_premises;
}