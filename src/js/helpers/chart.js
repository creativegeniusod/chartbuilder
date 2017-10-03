module.exports = {
	properties: {
		model: {
			type: "object",
			description: "model that is passed to Chartbuilder",
			required: !0,
			properties: {
				metadata: {
					type: "object",
					description: "chart metadata",
					required: !0,
					properties: {
						title: {
							required: !0,
							allowEmpty: !1,
							type: "string",
							maxLength: 70,
							messages: {
								allowEmpty: "Chart title is required in #6 above.  ",
								maxLength: "Title is too long. 70 character limit.  "
							}
						},
						credit: {
							type: "string"
						},
						description: {
							type: "string"
						},
						source: {
							type: "string"
						},
						size: {
							type: "string"
						},
						tags: {
							required: !0,
							minItems: 1,
							type: "array",
							messages: {
								required: "At least one tag is required in #6 above.  ",
								minItems: "At least one tag is required in #6 above.  "
							}
						}
					}
				}
			}
		}
	}
}
