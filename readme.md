# Vendor Machine Backend :smiley:
Build a backend for a vending machine using **Node.js** and **Mongodb** as database.
Implemented **JWT authentication** and protected routes.
Coverred following parts:
* Implement product model with amountAvailable. cost, productName and sellerld fields
* Implement user model with username, password, deposit and role fields
* Implement an authentication method JWT
* All of the endpoints are authenticated unless stated otherwise
* Implement CRUD for users 
* Implement CRUD for a product model (GET can be called by anyone, while POST, PUT and
DELETE can be called only by the seller user who created the product)
* Implement /deposit endpoint so users with a "buyer" role can deposit only 5, 10, 20, 50 and
100 cent coins into their vending machine account

* Implement /buy endpoint (accepts productld. amount of products) so users with a 'buyer-
role can buy products with the money they've deposited. API should return total they've
spent. products they've purchased and their change if there's any (in an array of 5, 10, 20, 50
and 100 cent coins)
* Implement /reset endpoint so users with a "buyer" role can reset their deposit back to 0
