(function (root, factory) {
		"use strict";

		if (typeof exports === 'object') {
			module.exports = factory(require('reservoir'));
		} else if (typeof define === 'function' && define.amd) {
			define(['reservoir/reservoir'], factory);
		} else {
			root.ArraySome = factory(root.Reservoir);
		}
	}(this, function (Reservoir) {
		"use strict";
		function _Some(targetArray) {
			if(typeof targetArray === "undefined") targetString = [];

			function getSubsetOfIndexes(numToEvaluate, arr) {
				var numToEvaluate = Math.floor(numToEvaluate);

				if ( arr == null ) {
					throw new TypeError( "this is null or not defined" );
				}

				if (Object.prototype.toString.call(numToEvaluate).slice(8, -1) !== "Number"
				   || numToEvaluate <= 0) {
					return [];
				}

				var indexList = new Reservoir(numToEvaluate);

				for(var i = 0; i < arr.length; i++) {
					indexList.pushSome(i);
				}

				// Step 1: Select the elements we want to use
				return indexList;
			}

			targetArray.sliceSome = function(numToReturn, startIndex, endIndex) {
				var numToReturn = Math.floor(numToReturn)
					elementList;

				if ( this == null ) {
					throw new TypeError( "this is null or not defined" );
				}

				if (Object.prototype.toString.call(numToReturn).slice(8, -1) !== "Number"
				   || numToReturn <= 0) {
					return [];
				}

				var startIndex = startIndex || 0,
				    arrayLength = endIndex || this.length;

				if(startIndex < 0) {
					startIndex = this.length + startIndex;
				}
				if(endIndex < 0) {
					endIndex = this.length + endIndex;
				}

				var elementList = new Reservoir(numToReturn);

				for(var i = startIndex; i < endIndex; i++) {
					elementList.pushSome(this[i]);
				}

				return elementList;
			}

			targetArray.forSome = function(numToEvaluate, callback, thisArg) {
				var indexList,
				    T;

				if ( Object.prototype.toString.call(callback) != "[object Function]" ) {
					throw new TypeError( callback + " is not a function" );
				}

				if ( thisArg ) {
					T = thisArg;
				}

				var indexList = new Reservoir(numToEvaluate);

				for(var i = 0; i < this.length; i++) {
					indexList.pushSome(i);
				}

				for(var i = 0; i < indexList.length; i++) {
					callback.call(T, this[indexList[i]], indexList[i], this);
				}
			};

			targetArray.filterSome = function(numToEvaluate, callback, thisArg) {
				var res = [];

				this.forSome(numToEvaluate, function(val, i, arr){
					if(callback.call(this, val, i, arr)) res.push(val);
				}, thisArg);

				return res;
			};

			targetArray.everySome = function(numToEvaluate, callback, thisArg) {
				var indexList,
				    T;

				if ( Object.prototype.toString.call(callback) != "[object Function]" ) {
					throw new TypeError( callback + " is not a function" );
				}

				indexList = getSubsetOfIndexes(numToEvaluate, this);

				if ( thisArg ) {
					T = thisArg;
				}

				for(var i = 0; i < indexList.length; i++) {
					if (!callback.call(T, this[indexList[i]], indexList[i], this))
						return false;
				}

				return true;
			};

			targetArray.someSome = function(numToEvaluate, callback, thisArg) {
				var indexList,
				    T;

				if ( Object.prototype.toString.call(callback) != "[object Function]" ) {
					throw new TypeError( callback + " is not a function" );
				}

				indexList = getSubsetOfIndexes(numToEvaluate, this);

				if ( thisArg ) {
					T = thisArg;
				}

				for(var i = 0; i < indexList.length; i++) {
					if (callback.call(T, this[indexList[i]], indexList[i], this))
						return true;
				}

				return false;
			};

			targetArray.reduceSome = function(numToEvaluate, callback, initialValue) {
				var indexList,
				    currentValue, i = 0;

				if ( Object.prototype.toString.call(callback) != "[object Function]" ) {
					throw new TypeError( callback + " is not a function" );
				}

				indexList = getSubsetOfIndexes(numToEvaluate, this);

				if ( initialValue ) {
					currentValue = initialValue;
				} else {
					if(indexList.length === 0) {
						throw TypeError("Reduce of empty array with no initial value");
					}
					currentValue = this[indexList[0]];
					i = 1;
				}

				for(; i < indexList.length; i++) {
					currentValue = callback.call(undefined, currentValue, this[indexList[i]], indexList[i], this);
				}

				return currentValue;
			};

			targetArray.reduceRightSome = function(numToEvaluate, callback, initialValue) {
				var indexList,
				    currentValue, i = 0;

				if ( Object.prototype.toString.call(callback) != "[object Function]" ) {
					throw new TypeError( callback + " is not a function" );
				}

				indexList = getSubsetOfIndexes(numToEvaluate, this);

				if ( initialValue ) {
					currentValue = initialValue;
					i = indexList.length;
				} else {
					if(indexList.length === 0) {
						throw TypeError("Reduce of empty array with no initial value");
					}
					i = indexList.length - 1;
					currentValue = this[indexList[i]];
				}

				while(i--) {
					currentValue = callback.call(undefined, currentValue, this[indexList[i]], indexList[i], this);
				}

				return currentValue;
			};

			targetArray.mapSome = function(numToEvaluate, callback, thisArg) {
				var res = [];

				this.forSome.call(numToEvaluate, function(val, i, arr){
					res.push(callback.call(this, val, i, arr));
				}, thisArg);

				return res;
			};

			targetArray.mapSomeSparse = function(numToEvaluate, callback, thisArg) {
				var res = [];

				this.forSome(numToEvaluate, function(val, i, arr){
					res[i] = callback.call(this, val, i, arr);
				}, thisArg);

				return res;
			};

			return targetArray;
		}

		return _Some;
}));