### JavaScript Stock Profit Calculator

----------------------------------------------------

#### Overview

A JavaScript library for calculating the gain / loss of stock market transactions.


#### Features

* Simple API
* Dynamic Stockbroker Creation
* Customizable Transaction Fees
* Uses BigNumber of Math.js
* Transaction Fee Breakdown

#### Road Map

* Addition of stockbroker manager.
* Add options to the `StockCalculator` class.
* Additional stockbrokers. 

#### Getting Started

1. Import the JavaScript files.

        <!--  Dependencies -->
        <script src="http://cdnjs.cloudflare.com/ajax/libs/mathjs/1.6.0/math.min.js"></script>

        <!-- Core library files -->
        <script src="broker.js"></script>
        <script src="stock.calculator.js"></script>

        <!-- [Optional] -->
        <script src="brokers/broker-col.js"></script>

    * Dependencies:
        * [Math.js][mathjs]
    * Core library files:
        * broker.js - contains the `Broker` class.
        * stock.calculator.js - contains the `StockCalculator` class.
    * Optional files:
        * broker-col.js - contains the `Broker` implementation for [COLFinancial][col] named as `ColBroker`.
        * *Note: As of the moment, this is the only pre-created broker available.*

2. Create a custom / use a pre-created stockbroker.

        var broker = new Broker("Broker Name");

    or

        var broker = window.ColBroker;

3. Add transaction fees to broker instance.

        broker.addFee({
          name: 'commission',
          descrip: 'Commission',
          handler: function() { 
            return 'max(0.0025 * grossTradeAmt, 20)'; 
          }
        }, FeeType.BUY, FeeType.SELL);

    * `Broker#addFee( feeObj, feeType... )` function accepts at least two parameters.
        * Fee
            * name - The variable name of the transaction fee that can be used by other fee handlers during evaluation.
            * descrip - The description of the transaction fee.
            * handler - A function that returns a String to be evaluated by [Math.js][mathjs].
        * Fee Type(s)
            * `BUY`
            * `SELL`
        * *Note: `grossTradeAmt` is the default available variable for fee handlers.*

4. Create an instance of the calculator.

        var calc = new StockCalculator( broker );

5. Compute gain / loss.

        calc.compute( 8000, 1.35, 1.40);

    * `StockCalculator#compute(noOfShares, buyPrice, sellPrice [, showDetails])` function requires three parameters.
        * `noOfShares` - The total number of shares involved in the transaction.
        * `buyPrice` - The price of the stock bought. 
        * `sellPrice` - The price of the stock sold.
        * `showDetails` - *[Optional]* - A boolean flag that indicates whether transaction fee breakdown will be included or not. Default is `false`.

6. Check the results.

        { 
          "gain" : 279.1,
          "gainPercent" : 2.5766581178117147,
          "actualBuy" : 1.3539825,
          "actualSell" : 1.38887
        }

    For the detailed result, click [here][detailed-result] to view it. (*Extracted it to a separate link due to its verbosity.*)

[mathjs]: http://mathjs.org/
[col]: http://colfinancial.com/
[stock-calc]: /project/stock-profit-calculator/
[detailed-result]: /assets/txt/project/stock-profit-calculator/detailed-result.txt