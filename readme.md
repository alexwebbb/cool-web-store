# Item Store
[Visit the site now!](https://itemstore.info/store/)
![Website home Page](https://res.cloudinary.com/execool/image/upload/v1520276124/home_page_kyxgyd.png)
Item Store is a generic implementation of a rest based web store, utilizing Node JS, Express, Passport, Mongo, and Stripe, among other things. Designed as a plug and play alternative to services such as Etsy, Item Store requires only an active Stripe key in order to go live. Item Store offers commercial grade security with minimal technical overhead. DDOS protection is provided by Cloudflare.
Item Store generates a session feed, allowing the admin to view user view trends and create charts based on what items users view when visiting the site. The format is an array of item objects which are dated. Each session ends after 15 minutes of inactivity.

The API is a very straightforward REST API that only accepts submission by html form and stored in a Mongo database. Any data type, such as coupons or items, can be created with an appropriate form by an admin. Additionally, end users can add and remove items from their shopping cart, as well as submit actual orders, which are stored seperately. Orders are stored in such a way that even if you delete the original items that were purchased, a record of what they were called and their price will remain.

## Tech Used
+ HTML
+ CSS
+ JavaScript
+ jQuery
+ Bootstrap
+ Node.js
+ Express
+ MongoDB
+ Passport
+ Stripe
+ Chart.js
+ Cloudinary
