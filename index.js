const { faker, RandomModule, tr } = require('@faker-js/faker');
const mysql = require('mysql2');
const methodOverride = require('method-override');

const express = require("express");
const app = express();
const path = require("path");
const { count } = require('console');
const { constants } = require('buffer');
const { resolveSoa } = require('dns');

const { v4: uuidv4 } = require('uuid');
const { connected } = require('process');


app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: "9905682968rk"
  });

  //inserting new data

 
  



let getRandomUser = ()=>{
     
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ] 
};

// let data = [];
// for(let i =0;i<=100;i++){
// data.push(getRandomUser());
// }



  app.get("/",(req,res)=>{
    let q  =` select count(*) from user`;
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        let count = result[0]["count(*)"];
        res.render("home",{ count });
      })

    }catch(err){
      console.log(err);
      res.send("some error in db")
    }
   
  });

//SHOW ROUTE

  app.get("/user",(req,res)=>{
    let q = 'select * from user';
    try{
      connection.query(q,(err,users)=>{
        if(err) throw err;
        
        res.render("showusers",{users});
      })

    }catch(err){
      res.send('some issue in db')
    }
  });

  //EDIT ROUTE

  app.get("/user/:id/edit",(req,res)=>{
    let {id} = req.params;
   let q = `select * from user where id='${id}'`;
   try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = result[0]
      res.render("edit",{user});
    })

   }catch(err){
    console.log(err);
    res.send('some error in db')
   }
    
  });

  //UPDATE ROUTE
  app.patch("/user/:id",(req,res)=>{
    let {id} = req.params;
    let {password :formPass, username :newUserName}= req.body;
   let q = `select * from user where id='${id}'`;
   try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = result[0]
      if(formPass != user.password){
      res.send("wrong password");
      }else{
      let q2 = `update user set username='${newUserName}' where id='${id}' `;
      connection.query(q2,(err,result)=>{
      if(err) throw err;
      res.redirect("/user");
      })
      }

     
    })

   }catch(err){
    console.log(err);
    res.send('some error in db')
   }
    
   
  });



  //POST ROUTE
  app.get("/user/new",(req,res)=>{
    res.render("new")
  });

  app.post("/user",(req,res)=>{
    let {username, email, password} = req.body;
    let id = uuidv4();
    let q = `insert into user (id, username, email, password) values ('${id}','${username}','${email}','${password}')`;
    //let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;
   
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        console.log("added new user")
        res.redirect("/user")
      });

    }catch(err){
      console.log(err);
      res.send("some error in db")
    }
  });

    //DELETE ROUTE

    app.get("/user/delete",(req,res)=>{
      res.render("delete");
    });

    app.delete("/user",(req,res)=>{
      let {email:formemail,password:formpassword} = req.body;
      // let q = `delete from user where email='${formemail}' and password='${formpassword}'`;
      // try{
      //     connection.query(q,(err,result)=>{
      //       if(err) throw err;
      //       console.log("deleted the user")
      //       res.redirect("/user");
      //  })
        
      // }catch(err){
      //   console.log(err);
      //   res.send("wrong password or email");
      // }
     
      let q = `select * from user where password='${formpassword}' and email='${formemail}'`;
      try{
        connection.query(q,(err,result)=>{
          if(err) throw err;
          let user = result[0];
          if((user.email == formemail) && (user.password == formpassword)){
            let q2 = `delete from user where password='${formpassword}' and email='${formemail}' `;
            connection.query(q2,(err,result)=>{
              if(err) throw err;
              console.log("user deleted")
              res.redirect("/user");
            }) 
          }else{
            res.send("wrong password or email");
          }
      })

      }catch(err){
        res.send('some error occured in db')
      }

    })

//     app.delete("/user/:id",(req,res)=>{
//       let {id} = req.params;
//       let q = `delete from user where id='${id}'`;
//       try{
//         connection.query(q,(err,result)=>{
//           if(err) throw err;
//           res.redirect("/user")
//         })
//       }catch(err){
//         res.send('some error in db')
//       }
// });

app.listen("8080",()=>{
  console.log("server responding well");
});

let q = "INSERT INTO user (id,username,email,password) VALUES ?";


