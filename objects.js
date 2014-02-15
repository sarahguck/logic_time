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
	this.level = Proof.level;
	this.assumption = Proof.assuming && Proof.assumption.step_num == 0;
};

function Disjunction (left, right) {
	this.left  	 	 = left;
	this.right 	 	 = right;
	this.inspect 	 = this.left.groupedInspect + ' ∨ ' + this.right.groupedInspect;
	this.groupedInspect	 = '(' + this.inspect + ')';
	this.eliminate = function(){
		return [this.left, this.right];
	}
	this.level = Proof.level;
	this.assumption = Proof.assuming && Proof.assumption.step_num == 0;
};

function Negation (left) {
	this.left   = left;
	this.right	= left;
	this.inspect 	 = '¬' + this.left.groupedInspect;
	this.groupedInspect = this.inspect;
	this.eliminate = function(){
		return [left, right];
	}
	this.level = Proof.level;
	this.assumption = Proof.assuming && Proof.assumption.step_num == 0;
};

function Implication (left, right) {
	this.left = left;
	this.right = right;
	this.inspect 		= this.left.groupedInspect + ' ⇒ ' + this.right.groupedInspect;
	this.groupedInspect = '(' + this.inspect + ')';
	this.level = Proof.level;
	this.assumption = Proof.assuming && Proof.assumption.step_num == 0;
};

function Equivalence (left, right) {
	this.left = left;
	this.right = right;
	this.inspect = this.left.groupedInspect + ' ⇔ ' + this.right.groupedInspect;
	this.groupedInspect = '(' + this.inspect + ')';
	this.level = Proof.level;
	this.assumption = Proof.assuming && Proof.assumption.step_num == 0;
};

function Variable (left, right) {
	this.left 	 = left;
	this.right	 = left;
	this.inspect = left;
	this.groupedInspect = this.inspect;
	this.level = Proof.level;
	this.assumption = Proof.assuming && Proof.assumption.step_num == 0;
}