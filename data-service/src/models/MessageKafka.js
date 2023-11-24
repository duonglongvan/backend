const MessageKafkaModel = {
    to: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    from:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    action:{
        type: String,
        required: true,
        default:"activity"
    },
    data:{},
    ip: String,
    location: String,
    userAgent: String,
    appVersion: String,
    device: String,
    status: Number,
    created: Number,
    updated: Number,
};
const MsgKafkaModel = new Schema(MessageKafkaModel);
module.exports = mongoose.model("MessageKafka", MsgKafkaModel, "messageKafkas");
