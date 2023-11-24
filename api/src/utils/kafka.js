const kafkaNode = require("kafka-node");
const {
  Kafka,
  logLevel
} = require('kafkajs')
const MessageKafka = require("../models/MessageKafka");
const TopicService = require("../services/consumer/topic-service");
const CONSTANTS = require("./constant");
const fs = require("fs");
const HANDLERS = {};
let kafkaClient;
let certKakfa;
const kafka_host = process.env.KAFKA_HOST + ':' + process.env.KAFKA_PORT;
class JKafka {
  async connection() {
    try {
       certKakfa = fs.readFileSync(process.env.KAFKA_CRT, 'utf-8');
      await this.connectKafkajs();
      //await this.connectKafkNode();
    } catch (err) {
      logger.error(err);
    }
  }
  /**
   * 
   */
  async connectKafkajs() {
    const optionKafka={
      clientId: process.env.KAFKA_CLIENTID,
      brokers: [kafka_host],
      ssl: {
        rejectUnauthorized: false,
        cert: certKakfa
      },
      sasl: {
        mechanism:process.env.KAFKA_MECHANISM, // scram-sha-256 or scram-sha-512
        username:process.env.KAFKA_USERNAME,
        password:process.env.KAFKA_PASSWORD,
      },
      logLevel: logLevel.ERROR
    };

    kafkaClient = new Kafka(optionKafka);
    const consumer = kafkaClient.consumer({
      groupId: process.env.KAFKA_GROUPID
    });
    if(consumer){
      logger.info("Kafka Consumer on ready");
    }else{
      logger.error("Kafka Consumer not ready");
    }
    await this.run(consumer).catch(logger.error);
    //this.send();
  }

  async sendTest(max) {
    if (!max && max < 1) max = 1000;
    for (let i = 0; i < max; i++) this.send(i);
  }
  /**
   * 
   */
  async send(i = 1) {
    try {
      const producer = kafkaClient.producer();
      // Producing
      await producer.connect();
      const ni = i + 3;
      // logger.info("producer is");
      await producer.send({
        topic: CONSTANTS.KAFKA.TOPICS.test,
        messages: [{
          value: `<${ni}>${i} 2023-11-09T09:06:43.5922020000Z [ddos_domain_tcpflag_traffic] [240.103.90.245] time="2023-11-09 09:06:43" machine_name=BLUEMAX domain_id=57 domain_name=*.test.com inbound_syn_pps=181 inbound_detect_syn_pps=317 inbound_fin_pps=389 inbound_detect_fin_pps=35 inbound_rst_pps=159 inbound_detect_rst_pps=218 inbound_push_pps=459 inbound_detect_push_pps=148 inbound_ack_pps=107 inbound_detect_ack_pps=151 inbound_urg_pps=204 inbound_detect_urg_pps=488 inbound_etc_pps=221 inbound_detect_etc_pps=96 outbound_syn_pps=151 outbound_detect_syn_pps=146 outbound_fin_pps=99 outbound_detect_fin_pps=96 outbound_rst_pps=352 outbound_detect_rst_pps=237 outbound_push_pps=354 outbound_detect_push_pps=464 outbound_ack_pps=242 outbound_detect_ack_pps=499 outbound_urg_pps=419 outbound_detect_urg_pps=281 outbound_etc_pps=411 outbound_detect_etc_pps=491 inbound_syn_bps=354 inbound_detect_syn_bps=339 inbound_fin_bps=375 inbound_detect_fin_bps=41 inbound_rst_bps=124 inbound_detect_rst_bps=54 inbound_push_bps=228 inbound_detect_push_bps=160 inbound_ack_bps=437 inbound_detect_ack_bps=168 inbound_urg_bps=396 inbound_detect_urg_bps=134 inbound_etc_bps=338 inbound_detect_etc_bps=495 outbound_syn_bps=72 outbound_detect_syn_bps=213 outbound_fin_bps=499 outbound_detect_fin_bps=91 outbound_rst_bps=454 outbound_detect_rst_bps=59 outbound_push_bps=247 outbound_detect_push_bps=86 outbound_ack_bps=310 outbound_detect_ack_bps=68 outbound_urg_bps=393 outbound_detect_urg_bps=139 outbound_etc_bps=11 outbound_detect_etc_bps=110 `
        }, ],
      })
    } catch (err) {
      logger.error(err);
    }
  }
  /**
   * 
   * @param {*} consumer 
   */
  async run(consumer) {
    try {
      //consumer
      await consumer.connect()
      // logger.info("conntion consumer is");
      // Subscribe can be called several times
      const topics = CONSTANTS.TOPICS.map(e => {
        return e.name;
      });
      logger.info("topics is", topics);
      await consumer.subscribe({
        topics: topics,
        fromBeginning: true
      });
      // It's possible to start from the beginning:
      // await consumer.subscribe({ topic:  CONSTANTS.KAFKA.TOPICS.test, fromBeginning: true })      
      await consumer.run({
        eachMessage: async ({
          topic,
          partition,
          message
        }) => {
          // logger.info("consumer is ",topic,partition,message.value.toString())
          // if (timerIdentifier) clearTimeout(timerIdentifier);
          // timerIdentifier = setTimeout(async function () {
          TopicService.initIalize({
            topic,
            partition,
            offset: message.offset,
            timestamp: message.timestamp,
            key: message.key,
            data: message.value.toString()
          });
          // },1000);
        },
      })
      // before you exit your app
    } catch (err) {
      logger.error(err);
    }
    //await consumer.disconnect()
  }
  /**
   * 
   */
  async connectKafkNode() {
    this.client = new kafkaNode.KafkaClient({
      clientId: process.env.KAFKA_CLIENTID,
      kafkaHost: kafka_host,
      idleConnection: true,
      reconnectOnIdle: true,
      maxAsyncRequests: 10,
      connectRetryOptions: {
        retries: 2,
      },
      sslOptions: {
        rejectUnauthorized: false,
        cert: certKakfa
      },
      sasl: {
        mechanism:process.env.KAFKA_MECHANISM, // scram-sha-256 or scram-sha-512
        username:process.env.KAFKA_USERNAME,
        password:process.env.KAFKA_PASSWORD,
      }
    });
    this.registerConsumer();

    //await this.initIalize();
  }
  /**
   *
   * @param key
   * @param dir
   */
  set(key, dir) {
    HANDLERS[key] = require(dir);
  }
  /**
   *
   */
  async initIalize() {
    try {
      this.producer = new kafkaNode.Producer(this.client, {
        requireAcks: 1,
        // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
        partitionerType: 1,
      });
      this.producer
        .on("ready", () => {
          logger.trace("Kafka is running on port ", process.env.KAFKA_PORT);
          logger.trace("Producer is ready.");
          this.createTopics();
          //this.sendMsgDemo();
        })
        .on("error", (err) => {
          logger.trace("Kafka not connection port ", process.env.KAFKA_PORT);
          logger.trace("Producer is error.", err);
        });
    } catch (err) {
      logger.error(err.message);
    }
  }
  /**
   * 
   */
  sendMsgDemo() {
    setTimeout(() => {
      let message = new MessageKafka();
      message.data = "Hello";
      message.to = message._id;
      message.from = message._id;
      message.action = "test";
      this.push(CONSTANTS.KAFKA.TOPICS.test, message);
    }, 10000);
  }
  /**
   *
   * @param message
   * @returns
   */
  static setMessage(message) {
    try {
      //logger.info("API - kafka response", message);
      let topic = message.topic;
      // if (!HANDLERS.hasOwnProperty(topic)) return;
      logger.info("topic is ", topic);
      if (topic) {
        topic = topic.toLocaleLowerCase();
        topic = topic.replace(/-/gi, "_");
        // TopicService.initIalize({
        //   topic,
        //   data: msg,
        //   key: message.key
        // });
        TopicService.initIalize({
          topic,
          partition,
          offset: message.offset,
          timestamp: message.timestamp,
          key: message.key,
          data: message.value.toString()
        });
      }
    } catch (err) {
      logger.error(err.message);
    }
  }
  /**
   * @createTopics
   */
  createTopics() {
    const topics = CONSTANTS.TOPICS.map(e => {
      return e.name;
    });
    this.producer.createTopics(
      topics,
      false,
      this.registerConsumer,
    );
  }
  /**
   * @registerConsumer
   */
  registerConsumer() {
    const topics = CONSTANTS.TOPICS.map(topic=>topic.name);
    logger.info("registerConsumer is createTopics.", topics);
    this.consumer = new kafkaNode.ConsumerGroup({
        kafkaHost: kafka_host,
        groupId:  process.env.KAFKA_GROUPID,
        sessionTimeout: 10000,
        ssl: true,
        protocol: ["roundrobin"],
        fromOffset: "latest",
      },
      topics,
    );
    this.consumer.on("message", (message) => {
      logger.trace("on message",message);
      //JKafka.setMessage(message);
    });
    this.consumer.on("error", (err) => {
      logger.error(err);
    });

    process.on("SIGINT", () => {
      this.consumer.close(true, () => {
        process.exit();
      });
    });
  }
  /**
   *
   * @param topic
   * @param msg
   * @param key
   */
  push(topic, msg, key = null) {
    // let messageData = msg;
    logger.info("msg instanceof MessageKafka is ", msg instanceof MessageKafka);
    const mstType = msg instanceof MessageKafka;
    if (!mstType) {
      jerror.setTypeOject("Message not object MessageKafka");
    }
    topic = config.kafka.key + "_" + topic.toLocaleUpperCase();
    //if (typeof msg == "object") {
    let messageData = JSON.stringify({
      ...msg._doc,
      times: {
        apiSend: Date.now(),
      },
    });
    //}
    const produceRequest = {
      topic: topic,
      messages: messageData,
      // partition: 0,
      timestamp: Date.now(),
    };
    if (key) {
      produceRequest.key = key;
    }
    const payloads = [produceRequest];
    this.producer.send(payloads, (err, result) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info("Kafka send message to Topic is ", topic);
      }
    });
  }
  /**
   *
   */
  async disconnect() {
    if (this.producer) await this.producer.disconnect();
  }
}
module.exports = new JKafka();
