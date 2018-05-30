/* @flow */

//import {add} from "./flow-test-export.js";
import * as Models from "./flow-test-export.js";
//import {underscore} from "../lib/underscore-min.js";
//import * as Backbone from "../lib/backbone-min.js";


function doubleMe(num /* :number */) {
	return num * 2;
}

var x = doubleMe(5);
//var y = doubleMe('john');


function handleComplexType(type /* :{num: number, str: string, allOk?: boolean } */) {
	type.num += 10;
	type.str += ' string';
	type.allOk = false;

	return type;
}

handleComplexType({ num: 10, str: 'john' });

console.log('Add result is ' + Models.add(3, 7));
//console.log('Sqr result is ' + returnSqrFunc()(3));

//var q = new Models.QuestionBase();
var q = Models.QuestionFactory({});
console.log("1 Answered? " + q.isAnswered());

var answeredQuestion = Models.QuestionFactory({ lastAnswer: true });
console.log("2 Answered? " + answeredQuestion.isAnswered());

console.log("1 Answered? " + q.isAnswered());