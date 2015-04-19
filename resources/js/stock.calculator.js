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

	var StockCalculator = window.StockCalculator = function StockCalculator(broker) {
		this.broker = broker;
		this.math = mathjs({
			number: 'bignumber', 
			decimals: 20 
		}); 
	}

	StockCalculator.prototype.toNumber = function (value) {
		return this.math.bignumber(value);
	};

	StockCalculator.prototype.getMath = function () {
		return this.math;
	};

	StockCalculator.prototype.getBroker = function () {
		return this.broker;
	};

	StockCalculator.prototype.calcGrossTradeAmt = function (numOfShares, price) {
		return this.math.select(numOfShares).multiply(price).done();
	};

	StockCalculator.prototype.populate = function (numOfShares, buyPrice, sellPrice) {
		var grossBuyAmount = this.calcGrossTradeAmt(numOfShares, buyPrice);
		var grossSellAmount =  this.calcGrossTradeAmt(numOfShares, sellPrice)
		var buyFees = populateFees.call(this, this.broker.getFeesForType(FeeType.BUY), grossBuyAmount);
		var sellFees = populateFees.call(this, this.broker.getFeesForType(FeeType.SELL), grossSellAmount);
		var netBuyAmount = this.math.select(grossBuyAmount).add(sumArrayValues.call(this, buyFees)).done();
		var netSellAmount = this.math.select(grossSellAmount).subtract(sumArrayValues.call(this, sellFees)).done();


		var allFees = {
			profit: this.math.select(netSellAmount).subtract(netBuyAmount).done(),
			gainPercent: this.math.select(netSellAmount).divide(netBuyAmount).multiply(100).subtract(100).done(),
			actualBuy: this.math.select(netBuyAmount).divide(numOfShares).done(),
			actualSell: this.math.select(netSellAmount).divide(numOfShares).done(),
			detailsBuy : {
					feeType: FeeType.BUY,
					grossTradeAmt: grossBuyAmount,
					fees: buyFees,
					netTradeAmt: netBuyAmount
				},
			detailsSell : {
					feeType: FeeType.SELL,
					grossTradeAmt: grossSellAmount,
					fees: sellFees,
					netTradeAmt: netSellAmount
				},
			summary: [
				{
					feeType: FeeType.BUY,
					grossTradeAmt: grossBuyAmount,
					fees: buyFees,
					netTradeAmt: netBuyAmount
				},
				{
					feeType: FeeType.SELL,
					grossTradeAmt: grossSellAmount,
					fees: sellFees,
					netTradeAmt: netSellAmount
				}
			]
		};

		return allFees;
	};

	function populateFeesByType(feeType, numOfShares, price) {	
		var grossTradeAmt = this.calcGrossTradeAmt(numOfShares, price);
		var fees = populateFees.call(this, this.broker.getFeesForType(feeType), grossTradeAmt);
		var sumBuyFees = sumArrayValues.call(this, buyFees);

		retur 
	}

	function populateFees(fees, grossTradeAmt) {
		var scope = {grossTradeAmt:grossTradeAmt};
		var calcFees = [];
		
		for (var i = 0; i < fees.length; i++) {
			var fee = fees[i];			
			var value = this.math.eval(fee.handler(), scope) ;
			scope[fee.name] = value;
			calcFees.push({name: fee.name, descrip: fee.descrip, value: value});
		}

		return calcFees;
	}

	function sumArrayValues(arrObj, aKey) {
		var key = aKey || 'value';

		var sumValue = this.math.select(0);

		for (var i = 0; i < arrObj.length; i++) {
			var feeObj = arrObj[i];
			sumValue = sumValue.add(feeObj[key]);
		}

		return sumValue.done();
	}

})(window);