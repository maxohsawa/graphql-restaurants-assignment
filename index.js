var { graphqlHTTP } = require('express-graphql');
var { buildSchema, assertInputType } = require('graphql');
var express = require('express');

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    "name": "WoodsHill",
    "description": "American cuisine, farm to table, with fresh produce every day",
    "dishes": [
      {
        "name": "Swordfish grill",
        "price": 27
      },
      {
        "name": "Roasted Broccily ",
        "price": 11
      }
    ]
  },
  {
    "name": "Fiorellas",
    "description": "Italian-American home cooked food with fresh pasta and sauces",
    "dishes": [
      {
        "name": "Flatbread",
        "price": 14
      },
      {
        "name": "Carbonara",
        "price": 18
      },
      {
        "name": "Spaghetti",
        "price": 19
      }
    ]
  },
  {
    "name": "Karma",
    "description": "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    "dishes": [
      {
        "name": "Dragon Roll",
        "price": 12
      },
      {
        "name": "Pancake roll ",
        "price": 11
      },
      {
        "name": "Cod cakes",
        "price": 13
      }
    ]
  }
];
var schema = buildSchema(`

type Query {
  restaurant(name: String): Restaurant
  restaurants: [Restaurant]
},

type Restaurant {
  name: String
  description: String
  dishes: [Dish]
}

type Dish {
  name: String
  price: Int
}

input RestaurantInput {
  name: String
  description: String
}

type Response {
  ok: Boolean
}

type Mutation {
  createRestaurant(input: RestaurantInput): Response
  updateRestaurant(name: String, input: RestaurantInput): Response
  deleteRestaurant(name: String): Response
}
`);
// The root provides a resolver function for each API endpoint


var root = {
  restaurant : (name) => {
    return restaurants.filter( (item) => {
      item.name === name;
    })
  },
  restaurants : ()=> restaurants,
  createRestaurant : ({input}) => {

    const prevLength = restaurants.length;
    restaurants.push({
      name: input.name,
      description :input.description,
      dishes: input.dishes
    });
    const ok = Boolean(restaurants[prevLength]);
    return {ok};
  },
  updateRestaurant: ({name, input}) => {

    const newRestaurants = restaurants.map( (item) => {
      if(item.name === name){
        return {...item, ...input};
      } else return item;
    });

    restaurants = newRestaurants;

    const ok = Boolean(restaurants.filter( item => item.name === input.name && item.description === input.description
    ).length === 1);
    return {ok};
  },
  deleteRestaurant : ({name})=>{

    restaurants = restaurants.filter(item => item.name !== name)
    const ok = Boolean(restaurants.filter(item => item.name === name).length === 0);
    return {ok};
  }  
}
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
var port = 5500
app.listen(5500,()=> console.log('Running Graphql on Port:'+port));