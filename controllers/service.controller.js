let transformNumber=(number)=>{
     //011x -> 3
     let firstXIndex=number.indexOf("x")
     //011x-> 011
     let numbersBeforeX=number.slice(0,firstXIndex)
     //011x-> x1
     let firstNumber=numbersBeforeX.slice(numbersBeforeX.length-1,numbersBeforeX.length)
     //011x-> x
     let xChars=number.slice(firstXIndex,number.length)
     //011x-> 10
     let begin=firstNumber+xChars.split("").map((char)=>0).join("")
   
   
    return begin
}
let getStaticDynamicNumberRange=(from,to)=>{
    //011x -> 3
    let firstXIndex=from.indexOf("x")
    //011x-> 011
    let numbersBeforeX=from.slice(0,firstXIndex-1)
    let _from=transformNumber(from)
    let _to=transformNumber(to)
    return {
        staticPart:numbersBeforeX,
        from: _from,
        to:_to,
        count:_to-_from
}
}

const generateNumbers=(req,res,err)=>{
const {from,to}=req.body
res.json(getStaticDynamicNumberRange(from,to))
//from : 2010118xxxxx
//to :   2010119xxxxx


}
module.exports={
    generateNumbers
}