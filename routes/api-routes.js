//const Find = require("../models/find.js"); 
var db = require("../models");
var fetch = require("node-fetch");

module.exports = (app) => {

  app.get("/api/getAllItems", (req, res) => {
      
  
    db.Find.findAll({}).then((result) => {
      res.json(result);
    });
});

// Returns th Lat/Lang Array from the DB
// Will be used by the Google Map marker clustering
app.get("/api/getFindsFromDB", (req, res) => {
      
  
  db.Find.findAll({}).then((result) => {
    
    
    var testString = result;

    var locationArray = [];

    for(var i=0; i < result.length;i++){
      var singleLocationLatLong = {"lat":result[i].lattitude, "lng":result[i].longitude, "item":result[i].item, "description":result[i].description, "reward":result[i].reward,  "isLost":result[i].isLost };
      locationArray.push(singleLocationLatLong);
    }

    
    //console.log(locationArray);
    
    
    res.json(locationArray);
  });
});


    app.get("/api/:item?", (req, res) => {
      
      //Trim the extra spaces and stuff from the requested item
      var strippedItemSearchName = req.params.item.replace(/\s+/g, "").toLowerCase();


      if (strippedItemSearchName){
        db.Find.findAll({
          where:{
            item: strippedItemSearchName
          }
        }).then((result) => {
          return res.json(result);
        }); 
      }
      else {
        db.Find.findAll({}).then((result) => {
          return res.json(result);
        });
      }
    });
    
    

    app.post("/api/new", (req, res) => {
        
        const find = req.body;
    
        //let routeName = Find.item.replace(/\s+/g, "").toLowerCase();
        
        // Strip the spaces and extra white space from the passed in item name

        var shortItemName = find.item.replace(/\s+/g, "").toLowerCase();

        db.Find.create({
          //routeName: routeName,
          user: find.user,
          item: shortItemName,
          description: find.description,
          longitude: find.longitude,
          lattitude:find.lattitude,
          reward: find.reward,
          isLost: find.isLost
        });

        res.send(true);
      });


      app.post("/api/geoCode", (req, res) => {
        
        const locationlookup = req.body.providedLocation;
        const googleMapsAPIKey = "AIzaSyB7-e66d1Ugm1L5ZirOtq_fj6nMsYieeZ0";

        console.log("My Passed in Location is " + locationlookup);
    
        var tempURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + locationlookup + "&key=" + googleMapsAPIKey;

        // $.ajax({ 
        //   type: "GET",
        //   dataType: "json",
        //   url: tempURL,
        //   success: function(data){        
        //     console.log("*****RESULTS from GOOGLE GEOCODE****");
        //     console.log(data);
        //   }
        // });

        // fetch(tempURL, {
	      //     method: 'get'
        // }).then(function(response) {
        //       console.log("*****RESULTS from GOOGLE GEOCODE****");
        //       console.log(response);
        // }).catch(function(err) {
	      //     // Error :(
        // });

        fetch(tempURL, function (){
          console.log("****FETCH*****");
          console.log(json.results[0].geometry.location);
        })
      .then(res => res.json())
      //.then(json => console.log(json.results[0].geometry.location));
      .then(json => res.send(json.results[0].geometry.location));

        // fetch(tempURL)
        // .then((res) => {
        //   console.log("*****RESULTS from GOOGLE GEOCODE****");
        //   console.log(res);
        // })
        // .then(json => console.log(json));
        

        // db.Find.create({
        //   //routeName: routeName,
        //   user: find.user,
        //   item: shortItemName,
        //   description: find.description,
        //   longitude: find.longitude,
        //   lattitude:find.lattitude,
        //   reward: find.reward,
        //   isLost: find.isLost
        // });

        //res.send("HDHDHDHDHDH");
      });
    


  
}