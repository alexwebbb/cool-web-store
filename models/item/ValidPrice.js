"use strict";

const ValidPrice = RegExp(
		/(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/
    );
    
module.exports = ValidPrice;