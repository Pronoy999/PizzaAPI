# PizzaAPI
This is an API to Place Orders for a Pizza Delivery Service.
# License
Copyright 2019 Pronoy Mukherjee

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
### Other Libraries:    
This application use SQL to store the data. 
- Used [mailgun](https://www.mailgun.com) as mail agent using free account.
- Used [strip](https://www.strip.com) as payment gateway with dummy tokens.

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

