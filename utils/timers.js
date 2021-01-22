 const wait=(mseconds)=>new Promise((resolve,reject)=>{
    setTimeout(resolve, mseconds, mseconds);
})
module.exports={
    wait
}