const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const verbGroupSchema = new Schema({
	group: {type: String, required: true},
	verbs: [{
		fr: String,
		en: String,
		present: {
			singular: [String],
			plural: [String],
		},
		imperfect: {
			singular: [String],
			plural: [String],
		},
		future: {
			singular: [String],
			plural: [String],
		},
		conditional: {
			singular: [String],
			plural: [String],
		},
		subjunctive: {
			singular: [String],
			plural: [String],
		}
	}]
});

const VerbGroup = mongoose.model('verbgroups', verbGroupSchema);

module.exports = { VerbGroup };