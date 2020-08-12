const inquirer = require("inquirer");
const fs = require("fs");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");

const employees = [];

function initApp() {
    startHtml();
    addMember();
}

function addMember() {
    inquirer.prompt([{
        message: "Enter team member's name",
        name: "name"
    },
    {
        type: "list",
        message: "Select team member's role",
        choices: [
            "Engineer",
            "Intern",
            "Manager"
        ],
        name: "role"
    },
    {
        message: "Enter team member's id",
        name: "id"
    },
    {
        message: "Enter team member's email address",
        name: "email"
    }])
    .then(function({name, role, id, email}) {
        let roleInfo = "";
        if (role === "Engineer") {
            roleInfo = "GitHub username";
        } else if (role === "Intern") {
            roleInfo = "school name";
        } else {
            roleInfo = "office phone number";
        }
        inquirer.prompt([{
            message: `Enter team member's ${roleInfo}`,
            name: "roleInfo"
        },
        {
            type: "list",
            message: "Would you like to add more team members?",
            choices: [
                "yes",
                "no"
            ],
            name: "moreMembers"
        }])
        .then(function({roleInfo, moreMembers}) {
            let newMember;
            if (role === "Engineer") {
                newMember = new Engineer(name, id, email, roleInfo);
            } else if (role === "Intern") {
                newMember = new Intern(name, id, email, roleInfo);
            } else {
                newMember = new Manager(name, id, email, roleInfo);
            }
            employees.push(newMember);
            addHtml(newMember)
            .then(function() {
                if (moreMembers === "yes") {
                    addMember();
                } else {
                    finishHtml();
                }
            });
            
        });
    });
}

function startHtml() {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="stylesheet.css">
        <title>Team Profile Generator</title>
    </head>
    <body>
        <nav id="title">
            <ul>
              
                <a> Team Profiles</a>
            
            </ul>
          </nav>`;
    fs.writeFile("./index.html", html, function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("start");
}

function addHtml(member) {
    return new Promise(function(resolve, reject) {
        const name = member.getName();
        const role = member.getRole();
        const id = member.getId();
        const email = member.getEmail();
        let data = "";
        if (role === "Engineer") {
            const gitHub = member.getGithub();
            data = ` <div id= "card2">
            <h5 class="cardtitle"> ${name}  <br /><br /> Engineer</h5>
            <div class="carddetails">
                <p class="id">ID ${id}</p>
                <p class="email">email ${email}</p>
                <p class="phone">Office Phone</p>
                <p class = "github">Github: ${gitHub}</p>
            </div>
        </div>
    `;
        } else if (role === "Intern") {
            const school = member.getSchool();
            data = `<div id= "card3">
            <h5 class="cardtitle"> ${name}  <br /><br /> Intern</h5>
            <div class="carddetails">
                <p class="id">ID ${id}</p>
                <p class="email">email ${email}</p>
                <p class="school">school: ${school}</p>
                
            </div>
        </div>`;
        } else {
            const officePhone = member.getOfficeNumber();
            data = `     <div id= "card1">
            <h5 class="cardtitle"> ${name} <br /><br /> Manager</h5>
            <div class="carddetails">
                <p class="id">ID ${id}</p>
                <p class="email">email ${email}</p>
                <p class="phone">Office Phone: ${officePhone}</p>
                
            </div>
        </div>`
        }
        console.log("adding team member");
        fs.appendFile("./index.html", data, function (err) {
            if (err) {
                return reject(err);
            };
            return resolve();
        });
    });
    
            
    
        
    
    
}

function finishHtml() {
    const html = ` </div>
    </div>
    
</body>
</html>`;

    fs.appendFile("./index.html", html, function (err) {
        if (err) {
            console.log(err);
        };
    });
    console.log("end");
}

// addMember();
// startHtml();
// addHtml("hi")
// .then(function() {
// finishHtml();
// });
initApp();