const express = require("express");
const https = require('https');
var cors = require('cors');

var app = express();

app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(express.static("react_app"))

const options = {
        allowedHeaders : [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Authorization',
            'Accept : application/vnd.github+json',
            'X-Access-Token',
            
        ]
}
app.use(cors(options))
app.options('*',cors())

const port = 5001;

var getCommits = function(req, res, next){
    var owner = req.params.owner;
    var repository = req.params.repository;
    var oid = req.params.oid;
    console.log("Owner is : ",owner)
    console.log("Repository is : ",repository)
    console.log("Oid is : ",oid)
    
    var postData = {
        "owner": owner,
        "repository" : repository,
        "oid" : oid
    }
    var gitResponseData = getGitCommits(postData);
    res.send(gitResponseData)
    res.end();
}


function getGitCommits(postData){
    
    var url = `https://api.github.com/repos/${postData.owner}/${postData.repository}/commits/${postData.oid}`

    var gitResponse;
    https.get(`${url}`,res => {
        gitResponse = res;
        console.log(res)
    });
    // var fsResponseData = {
    //     "oid" : postData.oid,
    //     "subject" : gitResponse.base_commit.commit.message,
    //     "body" : gitResponse.base_commit.commit.message,
    //     "parents" : gitResponse.base_commit.parents,
    //     "author" : gitResponse.base_commit.author,
    //     "committer" : gitResponse.base_commit.committer
    // }
    // return fsResponseData;
    
    return gitResponse;
}

var baseCall = function(req, res, next){
    res.send('Hey Victory')
    res.end();
}
function sampleGitCommitCall(){
    // https://api.github.com/repos/OWNER/REPO/compare/BASEHEAD
    //Sample working - need to be removed
    
    var postData = {
        "owner" : "vitoryvp",
        "repository" : "React_Practice",
        "oid" : "1bc2eca552b831ad31a853da816fd455df430ee5",
    }
    console.log("Sample Git hit, post data is : ",postData)
    var gitResponseData = getGitCommits(postData);
    res.send(gitResponseData.json())
}

function getGitUserInfo(req, res, next){
    
    console.log("Coming inside getGitUserInfo ")
    var userName = "golemfactory";
    var url = `https://api.github.com/users/${userName}`

    var gitResponse;
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Content-type","application/json")
    https.get(`${url}`,res => {
        console.log("\n\n response : \n",res)
        gitResponse = res;
    });
    res.send(gitResponse);
    res.end();    
}
app.get(`/`,sampleGitCommitCall)
app.get(`/Victory`,baseCall)
app.get(`/getGitUserInfo`,getGitUserInfo);
app.get(`/repositories/:owner/:repository/commit/:oid`,getCommits);

app.listen(port)

