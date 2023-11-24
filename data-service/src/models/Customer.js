const CustomerModels = {
    customer_id: {
      type: Number,
      default: 0,
      index: true
    },
    id:{
        type: String,
        default: "",
    },
    ip:{
        type: String,
        default: "",
    },
    kafka_offset:{
        type: Number,
        default: 0
    },
    kafka_partition:{
        type: Number,
        default: 0
    },
    kafka_topic: {
      type: String,
      default: "",
      index: true
    },
    machine_id: {
      type: Number,
      default: 0,
      index: true
    },
    parsed_data: {},
    payload: {
        type: String,
        default: "",
    },
    processed: {
      type: Boolean,
      default: false,
    },
    payload: {
        type: String,
        default: "",
    },
    raw_log: {
        type: String,
        default: "",
    },
    sha256sum: {
        type: String,
        default: "",
    },
    ts_created_at: {
      type: Number,
      default: Date.now(),
      index: true
    },
    ts_kafka_received_at: {
      type: Number,
      default: 0,
      index: true
    },
    ts_updated_at: {
      type: Number,
      default: Date.now(),
      index: true
    },
  };
  const CustomerModelSchema = new Schema(CustomerModels);
  module.exports = CustomerModelSchema;
  