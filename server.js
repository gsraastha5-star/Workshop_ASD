const express=require('express');
const path=require('path');
const fs=require('fs');
const pathfile=path.join(__dirname,'db.json');
const app=express();

async function readfile() {
    try{
        let data=await fs.promises.readFile(pathfile,'utf-8');
        return JSON.parse(data);
    }catch(err){
        console.error("Error reading file:",err);
        return [];
    }
}
app.get('/products',async (req,res)=>{
  let products=await readfile();
  res.json(products);
});

app.get('/products/:id',(req,res)=>{
  const productId=parseInt(req.params.id);
  const product=[
    { "id": 1, "name": "Keyboard", "price": 49.99 },
    { "id": 2, "name": "Mouse", "price": 19.99 },
    { "id": 3, "name": "Monitor", "price": 199 },
    { "id": 4, "name": "Mouse", "price": 19 }
  ].find(p=>p.id===productId);
  if(product){
    res.json(product);
  }else{
    res.status(404).json({error:"Product not found"});
  }
});


app.listen(3000,()=>{console.log(`Server running on port 3000`);});