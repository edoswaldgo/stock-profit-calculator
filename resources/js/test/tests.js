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
(function(window, $) {

  var maxDiff = 0.0003;

  var defaultInputs = { 
    noOfShares: 8000,
    buyPrice: 1.35,
    sellPrice: 1.40
  };

  QUnit.test( "Test Empty Broker Parameter", function( assert ) {
    assert.throws(
      function() {
        new StockCalculator();
      },
      "Broker must be specified when creating a StockCalculator instance."
    );
  });

  QUnit.test( "[COLFinancial] Test Buy Transaction", function( assert ) {
    var fees = calculateCol(assert);
    assert.close( fees.actualBuy, 1.3540, maxDiff, "Passed!");
  });

  QUnit.test( "[COLFinancial] Test Sell Transaction", function( assert ) {
    var fees = calculateCol(assert);
    assert.close( fees.actualSell, 1.3889, maxDiff, "Passed!" );
  });

  QUnit.test( "[COLFinancial] Test Profit", function( assert ) {
    var fees = calculateCol(assert);
    assert.close( fees.gain, 279.10, maxDiff, "Passed!" );
  });

  QUnit.test( "[COLFinancial] Test Percent Gain", function( assert ) {
    var fees = calculateCol(assert);
    assert.close( fees.gainPercent, 2.5767, maxDiff, "Passed!" );
  });

  QUnit.test( "[COLFinancial] Test Show Transaction Breakdown", function( assert ) {
    var fees = calculateCol(assert, {showDetails: true});
    assert.ok( fees.details != undefined, "Passed!" );
  });


  function calculateCol( assert, inputs ) {
    var lInputs = $.extend({}, inputs, defaultInputs);
    return calculate( assert, lInputs, window.ColBroker );
  }

  function calculate( assert, inputs, broker ) {
    // Calculator declaration
    var calc = new StockCalculator( broker );

    // Use the inputs for computation.
    return calc.compute(inputs.noOfShares, inputs.buyPrice, inputs.sellPrice, inputs.showDetails);
  }

})(window, jQuery);