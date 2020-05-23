Topic
-----

Let's assume we are building a reservation system of restaurants, every restaurant have their tickets (kind of coupons) that 
guest will use for promotion.


Requirements: 
-----

- The restaurant owner can log in to the website and create tickets on their restaurant, the owner can have several restaurants.
- Each restaurant has their page URL like /<Resturant name>/tickets.
- When the owner logins to the website, he will be visited one of his restaurant's pages.
- The owner can go to another restaurant page he has access to by clicking the restaurant name in the dropdown.
- The owner can create/delete/edit/list tickets on the ticket page of the restaurant.
- Each ticket will have the name, max purchase count
- On the list page, we should show the ticket name as well as how many tickets were purchased.
- Each ticket should be their public page URL where guest can buy the ticket without login, URL - /<resturant name>/purchase/<ticket_code>
- On the purchase page, there will be a dropdown of available tickets amount (1 ~ N) where guests can choose to purchase and the `buy` button.
- When guests buy the purchase and if it exceeds the max purchase, we should show an error message to the guest.
- We should prevent concurrency issues for purchases. For example, if two guests purchase the remaining one ticket at the same time, only one request should succeed as there is only one ticket is remaining.
- Build a unit test for concurrency requests of ticket purchase using Tread, the default setting should be 10.
- We don't have to make UI beauty, just use pure html/css.
  
Page URL:
-----
- https://domain<resturant id>/tickets - Ticket list page (default page)
- https://domain<resturant id>/tickets/id - Ticket details page
- https://domain<resturant id>/purchase/<ticket uuid> - Ticket purchase page

Note: 
-----
We only review the coding style, that's said we don't check any UI or functionalies. So no need to spend time for making app work, just focusing on coding style.

Technical stack:
-----

Django Rest Framework, React and Mobx, Typescript
