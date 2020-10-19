const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const openingSchema = new Schema({
    projectname: {type: String, required: true, maxlength: 100},
    clientname: {type: String, required: true, maxlength: 100},
    technologies: {type: String, required: true, maxlength: 250},
    role: {type: String, required: true, maxlength: 100},
    jobdescription: {type: String, required: true, maxlength: 250},
    status: {type: String, required: true, enum:['Open', 'Closed'], default: 'Open'},
    createdby: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    applicants: {type: Schema.Types.ObjectId, ref: 'User'},
    dateadded: {type: Date, default: Date.now},
    datemodified: {type: Date, default: Date.now}
})

// virtual for opening's URL
openingSchema.virtual('url').get(function(){
    return '/catalog/opening/'+this._id;
});


module.exports = mongoose.model('Opening', openingSchema);