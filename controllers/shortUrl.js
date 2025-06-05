const URL = require("../models/urlShort");
const shortid = require("shortid");

function notUser(req,res){
    if(!req.user){
        return res.render("login");
    }
};

async function handleGetShortId(req,res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error: "URL is required"});

    const existingURL = await URL.findOne({redirectURL: body.url});
    if(existingURL){
        const allurls = await URL.find({createdBy: req.user._id});
        return res.render("home", {
            user: req.user,
            id: existingURL.shortId,
            urls: allurls
        });
    }
    
    const shortID = shortid.generate(8);
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id
    });

    const allurls = await URL.find({createdBy: req.user._id});
    return res.render("home", {
        user: req.user,
        id: shortID,
        urls: allurls
    });
}

async function handleGetIdAndGenerateLink(req,res){
    const shortID = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        //either name the main Id variable(using which we are searching) as in the schema or you have to use the below method
        {shortId: shortID},  //shortId to first find the data with this id
        {
            $push: {    // after finding update visitHistory
                visitHistory: {
                    timestamp: Date.now(),
                }
            },
        },
         {new: true}
    );

    /*
    ***Important point to remember with this "redirectURL" function, it can only redirect to you, if the connection is "https" otherwise it will redirect to the code again with shortId = <name of the website>
    
    ***i.e if you would give an URL with just a www header, it won't redirect so, to solve it, we'll use an if-else statement to look for those URL who don't have http and add it,
    */

    if (entry && entry.redirectURL) {
        console.log("Entry found:", entry);
        let url = entry.redirectURL;
        if(!(url.startsWith('http://') || url.startsWith('https://'))) {
            url = 'http://'+url;
        }
        
        return res.redirect(url);
        //return res.end(entry.redirectURL);
    } 
    else {
        console.log('Entry or redirectURL not found');
        return res.status(404).send('Short URL not found');
    }
    // console.log(entry.redirectURL);
    // res.redirect(entry.redirectURL);    //redirecting to the original URL
};

async function handleGetAnalytics(req,res){
    const shortId = req.params.shortId; //since shortId is the name in the schema , that will be fetched from the model
    const result = await URL.findOne({shortId});
    return res.json({ "totalClicks": result.visitHistory.length, 
        "analytics": result.visitHistory,
    });
};

async function handledeleteRequest(req,res){
    const shortId = req.params.shortId;
    await URL.findOneAndDelete({shortId});
    return res.json({"status":"Deletion Done"});
};

async function handleView(req,res){
    console.log('handleView was called');
        const allUrls = await URL.find({});
        return res.render('home',{
            urls: allUrls,
        });

        // return res.end(`
        //     <html>
        //         <head></head>
        //         <body>
        //             <ol>
        //                 ${allUrls.map(url => `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}</li>`).join("")}
        //             </ol>
        //         </body>
        //     </html>
        //     `);
};

module.exports = {
    handleGetShortId,
    handleGetIdAndGenerateLink,
    handleGetAnalytics,
    handledeleteRequest,
    handleView,
};