/*
 *The MIT License (MIT)
 *
 *Copyright (c) 2015 Ed Oswald Go
 *
 *Permission is hereby granted, free of charge, to any person obtaining a copy
 *of this software and associated documentation files (the "Software"), to deal
 *in the Software without restriction, including without limitation the rights
 *to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *copies of the Software, and to permit persons to whom the Software is
 *furnished to do so, subject to the following conditions:
 *
 *The above copyright notice and this permission notice shall be included in all
 *copies or substantial portions of the Software.
 *
 *THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *SOFTWARE.
*/
(function(window){

	var FeeType = {
		DEP : "DEP",
		BUY : "BUY",
		SELL: "SELL",
		DIV : "DIV",
	}

	function Broker(name) {
		this.name = name;
		this.feeMap = {};
	}

	Broker.prototype.getName = function getName() {
		return this.name;
	};

	Broker.prototype.addBuyFee = function (feeObj) {
		this.addFee(feeObj, FeeType.BUY);
		return this;
	};

	Broker.prototype.addSellFee = function (feeObj) {
		this.addFee(feeObj, FeeType.SELL);
		return this;
	};

	Broker.prototype.addFee = function (feeObj) {
		var args = arguments;
		if ( args.length < 2) { alert('Must provide two parameters or more'); return; }

		for ( var i = 1; i < args.length; i ++ ) {
			var arg = args[i];
			var arrFees = this.feeMap[arg];
			if ( !arrFees ) { arrFees = this.feeMap[arg] = []; }
			arrFees.push(args[0]);
		}

		return this;
	};

	Broker.prototype.getFees = function () {
		return this.feeMap;
	};

	Broker.prototype.getFeesForType = function (feeType) {
		return this.feeMap[feeType];
	};

	window.Broker = Broker;
	window.FeeType = FeeType;

})(window);