
function login() {

  var password = "";
  var name = "user"
  var userPassword = document.getElementById('userPassword').value
  var email = document.getElementById('userEmail').value
  var roleId = "1"
  var password = userPassword.toString().substring(0, 4);

  var info = {
    name, password, email, roleId
  }
  console.log(info)

  fetch("https://issuetracker-web.herokuapp.com/users/login", {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    //make sure to serialize your JSON body
    body: JSON.stringify(info)
  }).then(response => response.json())
    .then((data) => {
      if (data[0].id !== -1) {

        localStorage.setItem("user", JSON.stringify(data[0]));
        window.location = "index.html"



      }
      else {
        window.alert(data[0].name)

      }
    })


}
function logout() {
  localStorage.removeItem("user")
  window.location.reload();
}

function goLogin() {
  
  window.location="login.html";
}
function goHome() {
  
  window.location="index.html";
}
function registerUser() {
  var parsedPassword = [];

  var password = "";
  var name = document.getElementById('userName').value
  var userPassword = document.getElementById('userPassword').value
  var selects = document.getElementById('roleSelect')
  var email = document.getElementById('userEmail').value
  var roleId = selects.value
  var stringPassword = userPassword.toString().substring(0, 4).split("");

  for (var i = 0; i < stringPassword.length; i++) {
    if (i < stringPassword.length - 1) {

      parsedPassword.push(stringPassword[i] + "@")
    }
    else {

      parsedPassword.push(stringPassword[i])
    }
  }
  parsedPassword.forEach(item => {
    password += item
  })
  var info = {
    name, password, email, roleId
  }
  var info2 = {
    name, password: "", email, roleId
  }
  console.log(info2)

  fetch("https://issuetracker-web.herokuapp.com/users/create", {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    //make sure to serialize your JSON body
    body: JSON.stringify(info)
  }).then(data => data.json())
    .then((response) => {

      window.alert(response[0])
      if (response[0] === "User record created successfully.") {
        localStorage.setItem("user", JSON.stringify(info2));

        window.location = "index.html"
      }
    })
}

function changeView(id) {
  var viewToShow;
  var issue = document.getElementById('issue')
  var welcome = document.getElementById('welcome')
  var about = document.getElementById('about')
  var equipment = document.getElementById('equipment')
  var views = [issue, welcome, about, equipment]
  var user = JSON.parse(localStorage.getItem("user"))
  var viewsFiltered = views.filter((item) => item.id != id.split("View")[0]);
  viewToShow = views.filter((item) => item.id === id.split("View")[0])[0];

  if (user === null && viewToShow.id !== "about" && viewToShow.id !== "welcome") {
    window.alert("Login first")
  }
  else if (viewToShow.id === "about" || viewToShow.id === "welcome") {

    viewsFiltered.forEach(item => { item.className = "disappear" })
    viewToShow.className = ""
  }
  else {
    viewsFiltered.forEach(item => { item.className = "disappear" })
    viewToShow.className = ""
  }
}
function addEquip() {

  var description = document.getElementById('equipmentDesc').value;

  var name = document.getElementById('equipmentName').value;


  fetch("https://issuetracker-web.herokuapp.com/equips/read")
    .then(response => response.json())
    .then(equips => {

      var equipsId = 0;
      if (equips.length > 0) {
        equipsId = equips[equips.length - 1].id + 1;
      }



      var info = {
        description, name, id: equipsId
      }

      console.log(info)

      fetch("https://issuetracker-web.herokuapp.com/equips/create", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

        //make sure to serialize your JSON body
        body: JSON.stringify(info)
      }).then(data => data.json())
        .then((response) => {

          window.alert(response[0]);

          var rows = "";


          rows += `<tr><td>` + info.id + `</td><td>` + info.name + `</td><td>` + info.description + `</td></tr>`;
          $(rows).appendTo("#equipmentList tbody");
        });
    })





}

function addIssue() {

  var description = document.getElementById('issueDesc').value;

  var role = parseInt(JSON.parse(localStorage.getItem("user")).id);
  var location = document.getElementById('issueLocation').value;
  var selects = document.getElementById('equipmentSelect');
  var equipmentId = parseInt(selects.value);
  var equipmentName = selects.options[selects.selectedIndex].text;

  var dateObject = new Date().getFullYear().toString();
  var month = new Date().getMonth().toString();
  var day = new Date().getDate().toString();

  fetch("https://issuetracker-web.herokuapp.com/issues/read")
    .then(response => response.json())
    .then(issues => {
      var issuesId = 0;
      if (issues.length > 0) {
        issuesId = issues[issues.length - 1].id + 1;
      }

      var info = {
        description, location, equipmentId, userId: role, status: "", id: issuesId, date: dateObject + "-" + "0" + month + '-' + "0" + day
      }

      console.log(info)
      fetch("https://issuetracker-web.herokuapp.com/issues/create", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

        //make sure to serialize your JSON body
        body: JSON.stringify(info)
      }).then(data => data.json())
        .then((response) => {
          window.alert(response[0]);
          var rows = ""
          rows += `<tr ><td> ` + info.id + `</td><td>` + equipmentName + `</td><td>` + info.description + `</td><td>` + info.location + `</td><td>` + info.status + `<p style="font-size:16px;padding:5px;display:inline-block; text-decoration:underline;
  cursor: pointer;color:green;" id=${info.id} onClick="logStuff()" data-bs-toggle="modal" data-bs-target="#issueModal">Edit</p>` + `</td><td>` + info.date + `</td></tr>`;


          $(rows).appendTo("#issueList tbody");

        });

    })




}
function cancelIssuePost() {

  console.log("reset form")

}
function getEquips() {


  var logout = document.getElementById('logout')
  
  var login = document.getElementById('login')
  var user = JSON.parse(localStorage.getItem("user"));

  if (user === null) {
    logout.className = "d-none";
    login.className="nav-item side-nav-option";

  }
  fetch("https://issuetracker-web.herokuapp.com/equips/read")
    .then(response => response.json())
    .then(data => {

      equipmentSelect = document.getElementById('equipmentSelect');
      data.map(item => {

        equipmentSelect.options[equipmentSelect.options.length] = new Option(`${item.name}`, `${item.id}`);
      })

      var rows = "";
      $.each(data, function () {

        rows += `<tr><td>` + this.id + `</td><td>` + this.name + `</td><td>` + this.description + `</td></tr>`;
      });

      $(rows).appendTo("#equipmentList tbody");
    });



}
function getIssues() {

  var equipment = [];

  fetch("https://issuetracker-web.herokuapp.com/equips/read")
    .then(response => response.json())
    .then(data => {
      equipment = data;
      fetch("https://issuetracker-web.herokuapp.com/issues/read")
        .then(response => response.json())
        .then(issues => {



          var rows = "";
          $.each(issues, function () {

            var equip = equipment.find(e => e.id === parseInt(this.equipmentId));

            var name = equip === undefined ? "unknwown" : equip.name;
            rows += `<tr ><td> ` + this.id + `</td><td>` + name + `</td><td>` + this.description + `</td><td>` + this.location + `</td><td>` + this.status + `<p style="font-size:16px;padding:5px;display:inline-block; text-decoration:underline;
  cursor: pointer;color:green;" id=${this.id} onClick="logStuff()" data-bs-toggle="modal" data-bs-target="#issueModal">Edit</p>` + `</td><td>` + this.date + `</td></tr>`;


          });

          $(rows).appendTo("#issueList tbody");

        });
    });
  $('#issueList tbody').on('click', e => {
    //Get the clicked row ID

    var zaf = $('#issueList tbody').attr("id");
    //Log the ID to the console
    console.log(e.target.id);

    var table = document.getElementById("statusId");
    table.innerHTML = e.target.id

  })
  $('#equipmentList tbody').on('click', e => {
    //Get the clicked row ID

    //Log the ID to the console
    console.log(e.target.id + "eq");


  })

}
function logStuff() {
  console.log("struff")
}

function deleteIssue(e) {


  var dateObject = new Date().getFullYear().toString();
  var month = new Date().getMonth().toString();
  var day = new Date().getDate().toString();
  var id = parseInt(e);
  var info = {
    description: "des", location: "ello", equipmentId: "12", userId: 1, status: "status", id, date: dateObject + "-" + "0" + month + '-' + "0" + day
  }

  console.log(info)

  fetch("https://issuetracker-web.herokuapp.com/issues/delete", {
    method: "delete",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    //make sure to serialize your JSON body
    body: JSON.stringify(info)
  }).then(data => data.json())
    .then((response) => {
      window.alert(response[0]);

    });

}
function deleteEquip(e) {


  var id = parseInt(e);
  var info = {
    name: "name", id, description: "sdsds"
  }

  console.log(info)

  fetch("https://issuetracker-web.herokuapp.com/equips/delete", {
    method: "delete",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    //make sure to serialize your JSON body
    body: JSON.stringify(info)
  }).then(data => data.json())
    .then((response) => {
      window.alert(response[0]);

    });

}
function updateIssue() {


  var dateObject = new Date().getFullYear().toString();
  var month = new Date().getMonth().toString();
  var day = new Date().getDate().toString();
  var id = parseInt(document.getElementById("statusId").innerHTML);

  var status = document.getElementById("issueStatus").value;
  var info = {
    description: "des", location: "ello", equipmentId: "12", userId: 1, status, id, date: dateObject + "-" + "0" + month + '-' + "0" + day
  }

  var role = JSON.parse(localStorage.getItem("user"));

  if (role.roleId !== '1') {
    window.alert("Only Supervisor can provide feedback.Please log in as superviser")
  }
  else {
    fetch("https://issuetracker-web.herokuapp.com/issues/update", {
      method: "put",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

      //make sure to serialize your JSON body
      body: JSON.stringify(info)
    }).then(data => data.json())
      .then((response) => {
        window.alert(response[0]);



      });
  }

}