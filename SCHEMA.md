## Users
id INT PRIMARY KEY NOT NULL
name VARCHAR(30) NOT NULL

## Campaigns
id int
name varchar
is_reviewed boolean

## Lineitems
id int
campaign_id int
name varchar
booked_amount decimal
actual_amount decimal
adjustments decimal
is_reviewed boolean
is_archived boolean

## LineitemComments
id int
lineitem_id int
user_id int
content text
created_at timestamp

## History
id int
type 
user_id 
log JSON
created_at timestamp