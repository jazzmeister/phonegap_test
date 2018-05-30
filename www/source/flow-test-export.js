/* @flow */

import * as Backbone from "../lib/backbone-min.js";

export function add(num1 /* :number */, num2 /* :number */) /* :number */ {
	return num1 + num2;
}

//export function returnSqrFunc(x) => x*x;

//export.add = add;


var QuestionBase = Backbone.Model.extend({
    defaults: {
        id: null,
        type: 'base',
        text: null,
        comment: null,
        options: null,
        lastAnswer: null
    },
    
    clearAnswer: function () {
        this.set('lastAnswer', null);
    },

    isAnswered: function () {
        return this.get('lastAnswer') != null;
    }
});

export function QuestionFactory(defaults /* : Object */) {
	return new QuestionBase(defaults);
}

export function SJT(defaults /* : Object */) {
	return QuestionBase;
}