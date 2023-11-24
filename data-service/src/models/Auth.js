
const AuthModel = {
    id: {
        type:Number,
        default:1
    },
    name:{
        type: String,
        default:""
    },
    loginName:{
        type: String,
        default:""
    },
    secretKey:{
        type: String,
        default:""
    },
    email:{
        type: String,
        default:""
    },
    encrypted:{
        type: String,
        default:""
    },
    role:{
        type: String,
        default:"member"
    },
    status: {        
        type: Number,
        default:0
    },
    created_at: {        
        type: Number,
        default:Date.now()
    },
    updated_at: {        
        type: Number,
        default:0
    },
};
const AuthModelSchema = new Schema(AuthModel);
module.exports = mongoose.model("Auth", AuthModelSchema, "auths");
