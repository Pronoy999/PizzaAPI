# PizzaAPI
This is an API to Place Orders for a Pizza Delivery Service.
## To create a new User: 
POST /users/data
Request Body: {"emai":"","password": "", "name":"","address":""}

## To Login
- POST /users/login
- Request Body: {"email":"","password:""}
- Response: {'res':YOUR_TOKEN}

## To Logout
- DELETE /users/login?token=YOUR_TOKEN

## To delete an existing User.
- DELETE /users/data
- Request Body: {"email":""};

## To Update data for an existing user. 
- PUT /users/data?token=YOUR_TOKEN
- Request Body: {"email","",OTHER_DATA_TO_BE_UPDATED};

## To get the menu
- GET /users/menu?token=YOUR_TOKEN

## To generate a new Order. 
- POST /orders/new?token=YOUR_TOKEN
- Request Body: {"order_items":[],"total_price":PRICE};
- Response: {'res':ORDER_ID};

## To complete a payment
- POST /payment?token=YOUR_TOKEN
- Request: {"order_id":ORDER_ID,"total_price":PRICE}

