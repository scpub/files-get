
import scGets from "./index.js";  

    const sc=new scGets()
    await sc.init({path:'./test/'});
   

console.log(sc.tag('test').got('jane'))

//console.log(sc)
