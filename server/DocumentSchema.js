import mongoose from "mongoose";

const documentSchema = mongoose.Schema({
    _id : {
        type: String,
        required: true
    },
    data : {
        type: Object,
        required: true
    }
});

const Document = mongoose.model('document', documentSchema);

export default Document;
