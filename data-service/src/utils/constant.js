 const CONSTANTS={
    EXPIRE_ACCESS_TOKEN:31536000,
    MAX_TIME_REQUEST_STORAGE:30,
    APP:{
        KEY:"rule-api-service-v1"
    },
    CODE200:200,
    CODE500:500,
    CODE:{
        cod2000:{
            key:2000,
            name:"Success",
            description:"Thành công",
        },
        code2001:{
            key:2001,
            name:"empty",
            description:"rỗng",
        },
        code2002:{
            key:2002,
            name:"format",
            description:"định dạng",
        },
        code2003:{
            key:2003,
            name:"length",
            description:"độ dài",
        },
        code2004:{
            key:2004,
            name:"uniqueness",
            description:"tính duy nhất",
        },
        code2008:{
            key:2008,
            name:"duplicate data",
            description:"dữ liệu đã tồn tại",
        },
        code2009:{
            key:2009,
            name:"login unsuccessful",
            description:"đăng nhập không thành công",
        },
        code4000:{
            key:4000,
            name:"Bad Request",
            description:"Yêu cầu không hợp lệ",
        },
        code4001:{
            key:4001,
            name:"Unauthorized",
            description:"Không được phép",
        },
        code4002:{
            key:4002,
            name:"",
            description:"",
        },
        code4003:{
            key:4003,
            name:"Forbidden",
            description:"cấm truy cập",
        },
        code4004:{
            key:4004,
            name:"NotFound",
            description:"Không tìm thấy",
        },
        code5000:{
            key:5000,
            name:"error exception",
            description:"Lỗi ngoại lệ",
        }
    },
    USER:{
        loginName:"21232f297a57a5a743894a0e4a801fc3",//admin
        pwd:"6822460c558bff5bfbc0900a71806d1f",//123456@imip.com
        secret:"mYjdmath",
        role:"member"
    },
    KAFKA:{
        host:"192.168.3.33",
        port:9095,
        enable:true,
        groupId:"detection-engine-consumer-group",
        clientId:"kafkascram",
        mechanism:"scram-sha-512",
        username:"kafkascram",
        password:"F9R1he3ygX7SMAlVcfiqMCyVQGr9XzUh",
        TOPICS:{
            test:"duong-test"
        }
    },
    TOPICS:[
        {name:"event",description:""},
        {name:"raw-event",description:""},
        {name:"raw-log",description:""},
        {name:"raw-events",description:""},
        {name:"duong-test",description:""},
    ],
    REDIS:{
        enable:true,
        port: 6379,
        host: "127.0.0.1",
        password: "",
        dbname: 1,
        prefix: "monitoring",
        username:"",
        max_insert:30
    }
}
module.exports= CONSTANTS;