"use strict";

const ItemSchema = require("./schema");

ItemSchema.virtual("formattedGroups").get(function() {
	if (this.item_groups.length > 1) {
		const last = this.item_groups.pop();
		return (
			this.item_groups.map(e => e.name).join(", ") + " and " + last.name
		);
	} else if (this.item_groups.length === 1) {
		return this.item_groups[0].name;
	} else {
		return "";
	}
});