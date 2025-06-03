┌────────────────────────────┐
│        Client Access       │
└────────────┬───────────────┘
             ▼
    ┌────────────────────┐
    │  GET /signup        │
    └────────┬────────────┘
             ▼
  [Render signup.ejs form]
             │
             ▼
    ┌────────────────────┐
    │ POST /user          │
    └────────┬────────────┘
             ▼
  [handleUserSignup controller]
             │
      Create User in DB
             ▼
     Redirect to /login
             │
             ▼
    ┌────────────────────┐
    │  GET /login         │
    └────────┬────────────┘
             ▼
  [Render login.ejs form]
             │
             ▼
    ┌────────────────────┐
    │ POST /user/login    │
    └────────┬────────────┘
             ▼
  [handleUserLogin controller]
             │
      Validate credentials
             │
   Generate JWT -> set cookie(uid)
             ▼
     Redirect to homepage `/`
             │
             ▼
 ┌──────────────────────────────┐
 │    GET / (Homepage View)     │
 └───────────┬──────────────────┘
             ▼
 [restrictToLoggedInUserOnly middleware]
             │
       Check JWT in cookie
             ▼
    If valid → req.user attached
             ▼
   [Render home.ejs with user URLs]

┌────────────────────────────────────────────────────────────┐
│                        SHORT URL OPS                       │
└────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │ POST /visit           │
    └────────┬─────────────┘
             ▼
 [handleGetNewShortId controller]
             │
 Generate shortId using `shortid`
 Save to DB: {shortId, redirectURL, userId}
             ▼
 [Render home.ejs with new shortId]

    ┌──────────────────────┐
    │ GET /view             │
    └────────┬─────────────┘
             ▼
   [checkAuth middleware → req.user]
             ▼
   Fetch all URLs from DB
             ▼
 [Render home.ejs with full URL list]

    ┌────────────────────────────┐
    │ GET /visit/:shortId        │
    └────────────┬───────────────┘
                 ▼
 [handleGetIdAndGenerateLink controller]
                 │
   Find by shortId in DB
   Push current timestamp to visitHistory
                 ▼
   Redirect to original redirectURL
   (Ensure http/https prefix)

    ┌────────────────────────────┐
    │ GET /analytics/:shortId    │
    └────────────┬───────────────┘
                 ▼
 [handleGetAnalytics controller]
                 ▼
 Return JSON:
 {
   totalClicks,
   analytics: [timestamps]
 }

    ┌────────────────────────────┐
    │ DELETE /delete/:shortId    │
    └────────────┬───────────────┘
                 ▼
 [handledeleteRequest controller]
                 ▼
 Delete from DB
 Return { status: "Deletion Done" }

