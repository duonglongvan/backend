const SearchModel = {
    id: {
        type:Number,
        default:1
    },
    name:{
        type: String,
        default:""
    },
    description:{
        type: String,
        default:""
    },
    parttern:[],
    queries:[],
    status: Number,
    created: Number,
    updated: Number,
};
const SearchModelSchema = new Schema(SearchModel);
module.exports = mongoose.model("Search", SearchModelSchema, "searchs");
