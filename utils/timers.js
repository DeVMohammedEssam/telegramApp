 const wait=(seconds)=>new Promise((resolve,reject)=>{
    setTimeout(resolve, seconds*1000, seconds);
})
module.exports={
    wait
}