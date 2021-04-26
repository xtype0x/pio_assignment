# Assignment

## Environment

Node.js v15.11.0^  
Frontend: React(React Hooks) + Redux  
Backend: Node.js express + Postgresql (My first try with Node.js + Postgresql )  
Port `3000` and `4000` will be used in this project.
## Setup

1. Install package by running `npm install`
2. Put the data file `placements_teaser_data.json` in the root directory.
3. Rename `.env.example` in the api-server folder to `.env`. Then, edit `.env` file for postgresql database config.
4. Run `npm run dbsetup` to setup database. You should see message like `Create tables done. Insert campaigns and lineitems done.`

## Start

Run `npm start` then open(if not automatically open) `http://localhost:3000` in the browser

## FINISHED USE CASE
**Bucket 1:**
- ✅ The user should be able browse through the line-item data as either a list or table (ie. pagination or infinite-scrolling).
- ✅ The user should be able to edit line-item "adjustments".
- ✅ The user should be able to see each line-item's billable amount (sub-total = actuals + adjustments).
- ✅ The user should be able to see sub-totals grouped by campaign (line-items grouped by their parent campaign).
- ✅ The user should be able to see the invoice grand-total (sum of each line-item's billable amount).
- ✅ Multiple users should be able to edit the same invoice concurrently.
- ✅ The user should be able to sort the data.
- ✔️ The user should be able to browse/filter/sort the invoice history, as well. -- Only browse
- ✅ The user should be able to output the invoice to *.CSV, *.XLS, etc.
- ⬜️ The user should be able to customize the layout.
- ✅ The user should be able flag individual line-items as "reviewed" (meaning they are disabled from further editing).
- ✅ The user should be able flag "campaigns" as being reviewed, as well.
- ✅ The user should be able to archive line-items

**Bucket 2:**  
- ⬜️ An integration into an external service that makes sense (eg. a currency conversion service, an export to Amazon S3, etc)
- ✅ The user should be able to filter the data (ie. by campaign name, etc., should affect the grand-total).
- ✅ The user should be able to share and reuse filters between users. -- Using filter code (JSON string)
- ✅ The user should be able to add comments on an individual line-item.
- ✅ The user should be able to see a history of all the adjustments/comments/changes/etc. made to the invoice by different users.

