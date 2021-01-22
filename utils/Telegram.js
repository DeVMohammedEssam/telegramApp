const { EventEmitter } = require("events");
let cuid=require("cuid")
const { StringSession } = require("../services/gramjs").sessions;
const apiId = 79865;
const apiHash = "d4e5e5a9635854cf8a807297da389d75";
let {wait} =require("./timers.js")

const {
    TelegramClient,
    tl,
    utils,
    LocalStorageSession,
    Api,
  } = require("../services/gramjs");
 class Telegram extends EventEmitter{
     
     filterBulkOfNumbers = async (numbers, token, hash, source = 0) => {
        let internalEvent = new EventEmitter();
        internalEvent.emit("filterBulkOfNumbersStart", new Date());
        let now = new Date();
        let intervalCheckSuccess;
      
        if (numbers.length == 0) {
          return [];
        }
      
        let random = cuid();
        const stringSession = new StringSession(token);
        console.log("TOKEN ,",token)

        let client;
        try{
          let result=1000
          let retry=async ()=>{
            result=await Promise.race([new TelegramClient(stringSession, apiId, apiHash),wait(1000)])
          //  console.log("RETRY" , result)
            if(result==1000){
            await retry()
            }
          };
          await retry();
          
          console.log("AFTER RETRY");
          client = result;
        } catch (e) {
          console.log("ERROR ", e);
        }
        let retryConnect=async ()=>{
          
          let result=await Promise.race([client.connect(),wait(2000)])
        //  console.log("RETRY" , result)
        console.log("RETURY REREYCONNEXT")
        console.log(result)
          if(result==2000){
          await retryConnect()
          }
        };
        await retryConnect();
        console.log("AFTER RETRY CONNECT");
        let _numbers = numbers.map(
          (number) =>
            new Api.InputPhoneContact({
              clientId: new Date().getTime(),
              phone: number,
              firstName: "Name" + random,
              lastName: "Last" + random,
            })
        );
        //console.log("NUMBERS ",_numbers)
        const ImportContacts = tl.requests.contacts.ImportContacts;
        //console.log(ImportContacts)
      
        const filterResult = await client.invoke(
          new ImportContacts({
            contacts: _numbers,
          })
        );
        let result = JSON.parse(JSON.stringify(filterResult)).users.map((user) => ({
          id: user.id,
          wasOnline: user.status && user.status.wasOnline * 1000,
          phone: user.phone,
        }));
        //console.log(result)
        internalEvent.emit("filterBulkOfNumbersEnd", new Date());
        client.disconnect();
        return result;
      };
      
       filterTelegramNumbers=async(data,tokens,i=0,hash)=>{
      
        // let data={
        //     "staticPart": "201011",
        //     "from": "800000",
        //     "to": "900000",
        //     "count": 100000,
        // }
      
        data.staticPart = data.staticPart.replace("+", "");
        console.log("DATA ", data);
        if (Number(data.from) > Number(data.to)) {
          return;
        }
        let bulkCounter=0
        let numberCounter=Number(data.from)
        let builkOfNumbers=[]
        console.log("Number(data.from)<=Number(data.to) ",Number(data.from) ,":",Number(data.to))
        while(Number(data.from)<=Number(data.to)&&bulkCounter<5){
            bulkCounter++;
            numberCounter++;
          builkOfNumbers.push(`${data.staticPart}${numberCounter}`)
        }
        //console.log("TOKEN "+tokens[i%tokens.length])
        //console.log("builkOfNumbers ",builkOfNumbers)
        let _tokens = tokens[i % tokens.length];
      
        let result = await this.filterBulkOfNumbers(builkOfNumbers, _tokens, hash);
      
      
        
        console.log("RESULT ",result)
        if(builkOfNumbers.length==0)
          return
        this.emit("data",{result,hash});
       // console.log("ITER NUMBER: "+i)
        //console.log("builkOfNumbers.length: "+builkOfNumbers.length)
      //await wait(0)
      this.filterTelegramNumbers({...data,from:numberCounter},tokens,++i,hash)
      }
}
module.exports={
    Telegram
}