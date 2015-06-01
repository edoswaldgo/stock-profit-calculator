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
	 * Represents a stock calculator.

	 * @constructor
	 * @class
	 * @param {broker} broker - The stock broker to use.
	 */
	var StockCalculator = window.StockCalculator = function StockCalculator(broker) {
		if ( !broker ) {
			throw "Broker must be specified."
		}

		this.broker = broker;
		this.math = math.create({
			number: 'bignumber'
			// TODO: Add options for precision.
		  // precision: options && options.calcPrecision != null ? options.calcPrecision : 64
		});
	}

	/** 
	 * Gets the stock broker being used by the calculator.
   *
	 * @function getBroker 
	 *
	 * @return the broker instance.
	 */
	StockCalculator.prototype.getBroker = function () {
		return this.broker;
	};

	/** 
   * Computes for the gain or loss of a stock market transaction provided the parameters below.
	 *
	 * @function compute
	 *
	 * @param numOfShares -
	 * 					the number of shares involved in the transaction.
	 * @param buyPrice -
	 * 					the price per share upon buying the stock.
	 * @param sellPrice -
	 * 					the price per share upon selling the stock.
	 * @param mustAddDetails -
	 * 					[optional] determines if transaction fees breakdown will be included or not.
	 * @return an Object containing the following details: gain, gainPercent, actualBuy, actualSell, and etcetera.
	 */
	StockCalculator.prototype.compute = function compute(numOfShares, buyPrice, sellPrice, mustAddDetails) {
    // Local variables.
    var lMath = this.math;
    var lNumOfShares = toBigNumber(numOfShares);

    // Buy
    var lBuyPrice = toBigNumber(buyPrice);
    var grossBuyAmount = computeGrossAmount(lNumOfShares, lBuyPrice);
    var buyFees = populateFees.call(this, this.broker.getBuyFees(), grossBuyAmount);
    var totalBuyFees = sumArrayValues.call(this, buyFees);
    var netBuyAmount = this.math.chain(grossBuyAmount).add(totalBuyFees).done();

    // Sell
    var lSellPrice = toBigNumber(sellPrice);
    var grossSellAmount =  computeGrossAmount(lNumOfShares, lSellPrice)
    var sellFees = populateFees.call(this, this.broker.getSellFees(), grossSellAmount);
    var totalSellFees = sumArrayValues.call(this, sellFees);
    var netSellAmount = this.math.chain(grossSellAmount).subtract(totalSellFees).done();

    // Transaction Details
    var result = {
      gain: computeGain.call(this, netSellAmount, netBuyAmount),
      gainPercent: computeGainPercent.call(this, netSellAmount, netBuyAmount),
      actualBuy: computeActualBuy.call(this, netBuyAmount, lNumOfShares),
      actualSell: computeActualSell.call(this, netSellAmount, lNumOfShares)
    };

    // Transaction Fees Breakdown
    // May skip the inclusion of fees breakdown to lessen overhead.
    if ( mustAddDetails ) {
    	result.details = {
        buy : {
          grossTradeAmt: lMath.number(grossBuyAmount),
          fees: convertArrayBigNumberValuesToNumber.call(this, buyFees),
          netTradeAmt: lMath.number(netBuyAmount)
        },
        sell : {
          grossTradeAmt: lMath.number(grossSellAmount),
          fees: convertArrayBigNumberValuesToNumber.call(this, sellFees),
          netTradeAmt: lMath.number(netSellAmount)
        }
      };
    }

    // Return the computation result.
    return result;

  };

  /**
   *
   * Gross Amount = No. of Shares * Price per share
   *
   */
  function computeGrossAmount(numOfShares, price) {
		return this.math.chain(numOfShares).multiply(price).done();
	};

	/**
   *
   * Gain = Net Sell Amount - Net Buy Amount
   *
   */
	function computeGain(netSellAmount, netBuyAmount) {
		var lMath = this.math;
		return lMath.number(lMath.chain(netSellAmount).subtract(netBuyAmount).done());
	};

	/**
   *
   * Gain(%) =  Net Sell Amount / Net Buy Amount * 100 - 100
   *
   */
	function computeGainPercent(netSellAmount, netBuyAmount) {
		var lMath = this.math;
		return lMath.number(lMath.chain(netSellAmount).divide(netBuyAmount).multiply(100).subtract(100).done());
	};

	/**
   *
   * Actual Buy Amount = Net Buy Amount / No. of Shares
   *
   */
	function computeActualBuy(netBuyAmount, numOfShares) {
		var lMath = this.math;
		return lMath.number(lMath.chain(netBuyAmount).divide(numOfShares).done());
	};

	/**
   *
   * Actual Sell Amount = Net Sell Amount / No. of Shares
   *
   */
	function computeActualSell(netSellAmount, numOfShares) {
		var lMath = this.math;
		return lMath.number(lMath.chain(netSellAmount).divide(numOfShares).done());
	};

	/**
   * Function responsible for calculating all the fees of the stock
   * transaction which is dependent on the stock broker. This function is the
   * important part for integrating the stock calculator and the stock broker
   * instances.
   *
   * @param fees -
	 * 				  the array of fees from the stock broker.
   * @param grossTradeAmt -
	 * 				  the gross amount of the trade transaction.
   * @return an array of object containing the actual amount of a transaction fee.
   *
   */
	function populateFees(fees, grossTradeAmt) {
		var scope = {grossTradeAmt:grossTradeAmt};
		var calcFees = [];
		
		for (var i = 0; i < fees.length; i++) {
			var fee = fees[i];
			// Use the eval method of math.js to calculate an equation given a scope.
			var value = this.math.eval(fee.handler(), scope);
			scope[fee.name] = value;
			calcFees.push({name: fee.name, descrip: fee.descrip, value: value});
		}

		return calcFees;
	}

	/**
   * Function responsible for summing all the entries of an Array given
   * a key parameter. This is used for adding all the transaction fees up.
   *
   * @param arrObj -
	 * 				  the array of objects to be interated.
   * @param aKey -
	 * 				  the key inside an Object to be used for summation.
   * @return the sum, in bigNumber, of all the entries inside the array.
   */
	function sumArrayValues(arrObj, aKey) {
		// Default key is value.
		var key = aKey || 'value';

		var sumValue = this.math.chain(0);

		for (var i = 0; i < arrObj.length; i++) {
			var feeObj = arrObj[i];
			sumValue = sumValue.add(feeObj[key]);
		}

		return sumValue.done();
	}

	/**
   * Function responsible for converting all the entries of an Array given
   * a key parameter. This is used for converting the BigNumber values to Number.
   *
   * @param arrObj -
	 * 				  the array of objects to be interated.
   * @param aKey -
	 * 				  the key inside an Object to be used for summation.
   * @return the same array instance which has already been manipulated.
   */
	function convertArrayBigNumberValuesToNumber(arrObj, aKey) {
		var key = aKey || 'value';

		for (var i = 0; i < arrObj.length; i++) {
			var feeObj = arrObj[i];
			feeObj[key] = this.math.number(feeObj[key]);
		}

		return arrObj;
	}

	/**
   * Function for converting a Number to BigNumber.
   *
   * @param value -
   * 					the value to be converted.
   * @return the converted value as BigNumber.
   */
	function toBigNumber(value) {
		return this.math.bignumber(value || 0);
	}

})(window);