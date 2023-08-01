const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema(
    {
        title: {type: String, required: [true, 'title is required']},
        category: {type: String, required: [true, 'category is required'], enum: [ "Sports", "VideoGame", "Board", "Card", "Other"],},
        hostName: {type: Schema.Types.ObjectId, ref:'User'},
        details: {type: String, required: [true, 'details are required'],
            minLength: [10, 'the details should have at least 10 characters']},
        startDate: {type: Date, required: [true, 'start date is required']},
        endDate: {type: Date, required: [true, 'end date is required']},
        location: {type: String, required: [true, 'location is required']},
        image: {type: String, required: [true, 'image is required']}
    },
    {timestamps: true}
)

module.exports = mongoose.model('Event', eventSchema);