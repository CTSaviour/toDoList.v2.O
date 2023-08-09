//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/toDoListDB", { useNewUrlParser : true });

// creating a schema
const itemsSchema = {

  name : String

};

// creating a mongoose model...
const Item = mongoose.model("Item", itemsSchema);

//creating documents by using mongoose
const item1 = new Item ( {

  name: "Welcome to your toDoList"

}); 

const item2 = new Item ( {

  name: "Hit the + button to add an element."

}); 

const item3 = new Item ( {

  name: "<- check this box to delete item."

}); 

//making an array using mongoose
const defaultItems = [item1, item2, item3];

 //Item.insertMany(defaultItems)
   //   .then(function () {
        
     //   console.log("Successfully saved defult items to DB");
      
      //})
      // .catch(function (err) {
        
        //console.log(err);
      
      // }); 


app.get("/", async(req, res) => {

  // In mongoose new update, it no longer accepts the callbacks

  try {
    
    const foundItems = await Item.find({ });
  
    if (foundItems.length === 0 ) {

      Item.insertMany(defaultItems)
      .then(function () {
        
        console.log("Successfully saved defult items to DB");
      
      })
      .catch(function (err) {
        
        console.log(err);
      
      });

      res.redirect("/");

    } else{
    
      res.render("list", {listTitle : "Today", newListItems : foundItems});
    //res.send(models);
    
    }
  } catch(err){

    console.log(err);
 
  }

});



app.post("/", function(req, res){

  const itemName = req.body.newItem;

  // creating the mongoose documents

  const item = new Item({
    name : itemName
  });

  // alternative method of insert many
  item.save();

  // to display it on the home screen
  res.redirect("/");

});


// to delete an item from the list
app.post("/delete", function(req, res){
  
  const checkedByID = req.body.deleteItem;

  Item.findByIdAndRemove(checkedByID)
  .then(function ( ){
  
    console.log("Successfully deleted the item ");
  
  })

  .catch(function (err){
    
    console.log(err);
  
  })

  res.redirect("/");

});

app.get("/work", function(req,res){

  res.render("list", {listTitle: "Work List", newListItems: workItems});

});

app.get("/about", function(req, res){

  res.render("about");

});

app.listen(7733, function() {

  console.log("Server started on port 7733");

});
