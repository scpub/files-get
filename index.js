import { basename,extname,join } from 'node:path';
import fs from 'node:fs';

class scGets {
    #sc;
    #readopt;
    #scget
    constructor(opt) {
        if(!opt)return
        if(opt.data)this.#sc=opt.data
        (async () => {await this.init(opt)})()
    }

    async #read(e){
      e=e||this.#readopt
      if(!e)return
        return new Promise((resolve, reject) => {    
            const s = fs.createReadStream(e, 'utf8');
            let f = '';   
            s.on('data', (k) => {f += k});
            s.on('end', () => {resolve(f)});    
            s.on('error', (r) => {reject(r)});
        })     
    }

    async #reads(e) {
        const t=this
        e= Object.keys(e).length ?e: t.ext.read
        if(!e)return
        const m={}, g=[]
        const files=await fs.promises.readdir(e.path, { withFileTypes: true })
        for (const dirent of files){if(dirent.isFile()){g.push(dirent.name)}}
        for(let i=0;i<g.length;i++){
          const file=g[i]
          const ext=extname(file);
          const f= basename(file, ext);      
          const n= await t.#read(join(`${e.path}`,`${file}`))
          if(ext=='.json'){
            m[f]={
              e:JSON.parse(n),
              ext:ext.slice(1)
            }
          } else{
            m[f]={
              e:n,
              ext:ext.slice(1)
            }
          }      
        }return m
    }
  async #format(e){
    const t=this
    await t.#reads(e).then(function(o){ 
        t.#sc=o
        t.#scget=function(id){
            const sc=t.#sc;
            const got=(e)=>{return e?sc[id][e]:sc[id]}
            return {got}
        }
        t.tag=function(e){return t.#scget(e)}
    });  
  }  
  
  async init(e){await this.#format(e)}
}

export default scGets
