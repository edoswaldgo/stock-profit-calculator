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

	/**
	 * Constants for type of transaction fee.
	 */
	var FeeType = {
		DEP : "DEP",
		BUY : "BUY",
		SELL: "SELL",
		DIV : "DIV",
	}

	/**
	 * Represents a stock broker.
   *
	 * @constructor
	 * @class
	 * @param {string} name - The name of the stock broker.
	 */
	function Broker(name) {
		this.name = name;
		this.feeMap = {};
	}

	/** 
	 * Gets the name of the stock broker.
   *
	 * @function getName
	 *
	 * @return the name of the stock broker.
	 */
	Broker.prototype.getName = function getName() {
		return this.name;
	};

	/** 
	 * Adds a fee for buy transactions.
   *
	 * @function addBuyFee
	 * @param feeObj - 
	 * 					the fee object containing the name, description, and 
	 * 					the fee handler.
	 *
	 * @return the same stock broker instance for chaining.
	 */
	Broker.prototype.addBuyFee = function (feeObj) {
		this.addFee(feeObj, FeeType.BUY);
		return this;
	};

	/** 
	 * Adds a fee for sell transactions.
   *
	 * @function addSellFee
	 * @param feeObj - 
	 * 					the fee object containing the name, description, and 
	 * 					the fee handler.
	 *
	 * @return the same stock broker instance for chaining.
	 */
	Broker.prototype.addSellFee = function (feeObj) {
		this.addFee(feeObj, FeeType.SELL);
		return this;
	};

	/** 
	 * Adds a transaction fee.
   *
	 * @function addFee
	 * @param feeObj - 
	 * 					the fee object containing the name, description, and 
	 * 					the fee handler.
	 *
	 * @return the same stock broker instance for chaining.
	 */
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

	/** 
	 * Gets all the transaction fees of the stock broker.
   *
	 * @function getFees
	 *
	 * @return the map of transaction fees.
	 */
	Broker.prototype.getFees = function () {
		return this.feeMap;
	};

	/** 
	 * Gets the transaction fees for a specific transaction type.
   *
	 * @function getFeesForType
	 * @param feeType -
	 *				  the type of transaction fee. i.e. buy, sell.
	 *
	 * @return the array of transaction fees for a specific type.
	 */
	Broker.prototype.getFeesForType = function (feeType) {
		return this.feeMap[feeType];
	};

	/** 
	 * Gets the transaction fees for buy transactions.
   *
	 * @function getBuyFees
	 *
	 * @return the array of fees for buy transactions.
	 */
	Broker.prototype.getBuyFees = function () {
		return this.feeMap[FeeType.BUY];
	};

	/** 
	 * Gets the transaction fees for sell transactions.
   *
	 * @function getSellFees
	 *
	 * @return the array of fees for sell transactions.
	 */
	Broker.prototype.getSellFees = function () {
		return this.feeMap[FeeType.SELL];
	};

	// Expose to public.
	window.Broker = Broker;
	window.FeeType = FeeType;

})(window);