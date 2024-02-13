# TypeORM issue: sql error
This repository is a minimal reproduction of an issue I'm having with TypeORM.

In this repository there are two entities: `Product` and `ProductType`. `Product` has a many-to-one relationship with `ProductType`.

When I `take` a number of products, `select` some fields, and set `order` to order on a field that is not in the select, I get a SQL error.
