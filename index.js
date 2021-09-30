var { graphqlHTTP } = require('express-graphql');
var { buildSchema, assertInputType } = require('graphql');
var express = require('express');

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    "id": 1,
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
    "id": 2,
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
    "id": 3,
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
  restaurant(id: Int): Restaurant
  restaurants: [Restaurant]
},

type Restaurant {
  id: Int
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
  setRestaurant(input: RestaurantInput): Response
  editRestaurant(id: Int, input: RestaurantInput): Response
  DeleteRestaurant(id: Int): Response
}
`);
// The root provides a resolver function for each API endpoint


var root = {
  restaurant : ({id}) => {

    const result = restaurants.filter( item => item.id === id)[0];
    console.log(result);
    return {...result};
  },
  restaurants : ()=> restaurants,
  setRestaurant : ({input}) => {

    const prevLength = restaurants.length;
    const date = new Date();
  
    restaurants.push({
      id: Math.floor(Math.random()*1000000),
      name: input.name,
      description :input.description,
      dishes: input.dishes
    });
    const ok = Boolean(restaurants[prevLength]);
    return {ok};
  },
  editRestaurant: ({id, input}) => {

    const newRestaurants = restaurants.map( (item) => {
      if(item.id === id){
        return {...item, ...input};
      } else return item;
    });

    restaurants = newRestaurants;

    const ok = Boolean(restaurants.filter( item => item.name === input.name && item.description === input.description
    ).length === 1);
    return {ok};
  },
  DeleteRestaurant : ({id})=>{

    restaurants = restaurants.filter(item => item.id !== id)
    const ok = Boolean(restaurants.filter(item => item.id === id).length === 0);
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