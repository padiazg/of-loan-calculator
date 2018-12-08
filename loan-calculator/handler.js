"use strict"
const LoanCalc = require('loan-calc');
const querystring = require("querystring");

const calculator = (amount, rate, termMonths) => {
  const payment = LoanCalc.paymentCalc({ amount, rate, termMonths });
  const totalInterest = LoanCalc.totalInterest({ amount, rate, termMonths });
  const totalPayment = payment * termMonths;

  return {
    payment,
    totalInterest,
    totalPayment
  } // return ...
} // calculator ...

module.exports = (context, callback) => {
  const { Http_Method, Http_Query, Http_Content_Type } = process.env;

    // check method
    if (Http_Method != "GET" && Http_Method != "POST") {
        callback("Method not allowed", null);
        return;
    } // (Http_Method != "GET" && Http_Method != "POST")  ...

    // check if parameters are present
    if ((Http_Method =="GET" && !Http_Query) || (Http_Method =="POST" && !Http_Query && !context)) {
        callback("Missing parameters", null);
        return;
    }

    // validate parameters passed in body
    // if (Http_Method =="POST" && !Http_Query && context && Http_Content_Type != "application/x-www-form-urlencoded") {
    //     callback("Content_Type not especified/allowed", null);
    //     return;
    // }

    const payload = Http_Query ? Http_Query : context;
    let parameters = querystring.parse(payload);


    if (!parameters.amount || !parameters.rate || !parameters.term) {
        callback('amount, rate & term (in months) parameters are required', undefined);
        return;
    } // if (!parameters.amount || !parameters.rate || !parameters.term) ...
    callback(undefined, calculator(
      Number(parameters.amount),
      Number(parameters.rate),
      Number(parameters.term)
    ));
}
