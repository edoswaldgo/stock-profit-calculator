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
   * This object represents COLFinancial (http://colfinancial.com/) 
   * and contains the transaction fees stated from 
   * https://www.colfinancial.com/ape/Final2/home/faq.asp#how_much_are_the_trade_charges
   */
  var ColBroker = new Broker('COL Financial');

  // Commission
  ColBroker.addFee({
    name: 'commission',
    descrip: 'Commission',
    handler: function() { return 'max(0.0025 * grossTradeAmt, 20)'; }
  }, FeeType.BUY, FeeType.SELL);

  // VAT
  ColBroker.addFee({
    name: 'vat',
    descrip: 'Value Added Tax (VAT)',
    handler: function() { return '0.12 * commission'; }
  }, FeeType.BUY, FeeType.SELL);

  // PSE Transaction Fee
  ColBroker.addFee({
    name: 'pseTransFee',
    descrip: 'Philippine Stock Exchange Transaction Fee (PSE Trans Fee)',
    handler: function() { return '0.00005 * grossTradeAmt'; }
  }, FeeType.BUY, FeeType.SELL);

  // SCCP
  ColBroker.addFee({
    name: 'sccp',
    descrip: 'Securities Clearing Corporation of The Philippines Fee (SCCP)',
    handler: function() { return '0.0001 * grossTradeAmt'; }
  }, FeeType.BUY, FeeType.SELL);

  // Sales Tax
  ColBroker.addSellFee({
    name: 'salesTax',
    descrip: 'Sales Tax',
    handler: function() { return '0.005 * grossTradeAmt'; }
  });

  // Expose to public.
  // TODO: Creation of stock broker manager / factory.
  window.ColBroker = ColBroker;

})(window);