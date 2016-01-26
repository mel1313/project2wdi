/* global Auth0Lock, AUTH0_CLIENT_ID, AUTH0_DOMAIN, FB */
document.addEventListener('DOMContentLoaded', function () {
  var lock = new Auth0Lock(
      // These properties are set in auth0-variables.js
      AUTH0_CLIENT_ID,
      AUTH0_DOMAIN
  )
  document.getElementById('btn-login').addEventListener('click', function () {
    lock.show(function (err, profile, token) {
      if (err) {
        // Error callback
        console.error('Something went wrong: ', err)
        window.alert('Something went wrong, check the Console errors')
      } else {
        // Successful callback
        // Save the JWT token.
        window.localStorage.setItem('userToken', token)
        // Save the profile
        // userProfile = profile
        document.getElementById('login-box').style.display = 'none'
        document.getElementById('logged-in-box').style.display = 'inline'
        document.getElementById('nick').textContent = profile.nickname
      }
    })
  })
  // Go Dashboard Button
  document.getElementById('btn-api').addEventListener('click', function () {
    document.getElementById('top').style.display = 'none'
    document.getElementById('logged-in-box').style.display = 'none'
    document.getElementById('wrapper').style.display = 'inline-block'
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        var adnum
        var adstring
        FB.api('/me', {fields: 'adaccounts'}, function (response) {
          adnum = response.adaccounts.data[0].account_id
          adstring = '/act_' + adnum + '/campaigns'
          // Get campaign
          FB.api(
            adstring,
            'GET',
            {'fields': 'id,name,start_time,stop_time,effective_status,created_time,adlabels,objective,spend_cap'},
            function (response) {
              var arr = response.data
              arr.forEach(function (obj) {
                var panel = document.createElement('div')
                panel.className = 'panel panel-default'
                var panelhead = document.createElement('div')
                panelhead.className = 'panel-heading'
                var newtable = document.createElement('table')
                newtable.className = 'table'
                // var tabl = document.getElementById('tabl')
                var thead = document.createElement('thead')
                var tbody = document.createElement('tbody')

                var tr = document.createElement('tr')
                // Table Cell
                var leftRow = document.createElement('td')
                leftRow.innerHTML = 'Name'
                tr.appendChild(leftRow)
                var rightRow = document.createElement('td')
                rightRow.innerHTML = 'Value'
                tr.appendChild(rightRow)
                thead.appendChild(tr)
                newtable.appendChild(thead)
                // Add the table rows
                // use for of
                // Object.keys(obj).forEach(...)
                // for (const [key, val] of Object.entries(obj)) { ... }
                for (var name in obj) {
                  var value = obj[name]
                  var tr = document.createElement('tr')
                  var leftRow = document.createElement('td')
                  leftRow.innerHTML = name
                  tr.appendChild(leftRow)
                  var rightRow = document.createElement('td')
                  rightRow.innerHTML = value
                  tr.appendChild(rightRow)
                  tbody.appendChild(tr)
                }
                newtable.appendChild(tbody)
                panel.appendChild(panelhead)
                panel.appendChild(newtable)
                var mytable = document.getElementById('tabl')
                mytable.appendChild(panel)
              })
            }
          )
        })
      } else if (response.status === 'not_authorized') {
        // the user is logged in to Facebook,
        // but has not authenticated your app
      } else {
        // the user isn't logged in to Facebook.
      }
    })
  })
  // Aussie Map
  document.getElementById('getcon').addEventListener('click', function () {
      document.getElementById('aussie').style.display = 'block'
      document.getElementById('mytable').style.display = 'none'
      document.getElementById('mytable1').style.display = 'none'
      document.getElementById('form1').style.display = 'none'
      FB.api(
        '/6022602838905/insights',
        'GET',
        {"breakdowns":"region"},
        function(response) {
            // Insert your code here
            console.log(response)
            function addText(p, conversions) {

                var t = document.createElementNS("http://www.w3.org/2000/svg", "text")

                //Get Bounding Box of Path
                var b = p.getBBox()

                //Center Text
                t.setAttribute("transform", "translate(" + (b.x + b.width/2) + " " + (b.y + b.height/2) + ")")
                t.textContent = conversions

              //insert text into path
                p.parentNode.insertBefore(t, p.nextSibling)
            }


            var paths = document.querySelectorAll("path");

            Array.from(paths).forEach(path => {
                response.data.forEach(function(e){
                  if(e.region === path.attributes.title.value) {
                    addText(path, e.actions[3].value)
                  }
                })
            })
        }
      );
  })

  // campaign detailss
  document.getElementById('getcam').addEventListener('click', function () {
      document.getElementById('mytable').style.display = 'block'
      document.getElementById('aussie').style.display = 'none'
      document.getElementById('mytable1').style.display = 'none'
      document.getElementById('form1').style.display = 'none'
  })

  // Contact Form
  document.getElementById('contactform').addEventListener('click', function () {
      document.getElementById('form1').style.display = 'block'
      document.getElementById('mytable').style.display = 'none'
      document.getElementById('aussie').style.display = 'none'
      document.getElementById('mytable1').style.display = 'none'
  })


  // Profile Picture
  document.getElementById('profilepic').addEventListener('click', function () {
      FB.api(
          "/10153830800188453/picture",
          function (response) {
            if (response && !response.error) {
              /* handle the result */
              console.log(response.data.url)
              document.getElementById('profile1').innerHTML ='<img src="'+ response.data.url +'"/>'
              document.querySelector('img').style.width = '150px'
              document.querySelector('img').style.height = '150px'

            }
          }
      );
  })
  // Region
   document.getElementById('region').addEventListener('click', function () {
      FB.api(
        '/6022602838905/insights',
        'GET',
        {"breakdowns":"region"},
        function(response) {
            // Insert your code here
            console.log(response)
        }
      );
  })


  document.getElementById('getinsights').addEventListener('click', function () {
      document.getElementById('mytable1').style.display = 'block'
      document.getElementById('mytable').style.display = 'none'
      document.getElementById('aussie').style.display = 'none'
      document.getElementById('form1').style.display = 'none'
      FB.api(
        '/6022602838905/insights',
        'GET',
        {},
        function(response) {
            // Insert your code here
            console.log(response.data)
            console.log(response.data[0].cpm)
            var arr = response.data
                    arr.forEach(function(obj){
                      console.log(obj)
                      var panel = document.createElement('div')
                      panel.className = 'panel panel-default'
                      var panelhead = document.createElement('div')
                      panelhead.className = 'panel-heading'
                      var newtable = document.createElement('table')
                      newtable.className = 'table'
                      // var tabl = document.getElementById('tabl')
                      var thead = document.createElement('thead')
                      var tbody = document.createElement('tbody')

                      var tr = document.createElement('tr')
                      // Table Cell
                      var leftRow = document.createElement('td')
                      leftRow.innerHTML = "Name"
                      tr.appendChild(leftRow)
                      var rightRow = document.createElement('td')
                      rightRow.innerHTML = "Value"
                      tr.appendChild(rightRow)
                      thead.appendChild(tr)
                      newtable.appendChild(thead)
                      // Add the table rows
                      // use for of
                      // Object.keys(obj).forEach(...)
                      // for (const [key, val] of Object.entries(obj)) { ... }
                      for (var name in obj) {
                          var value = obj[name]
                          var tr = document.createElement('tr')
                          var leftRow = document.createElement('td')
                          leftRow.innerHTML = name
                          tr.appendChild(leftRow)
                          var rightRow = document.createElement('td')
                          rightRow.innerHTML = value
                          tr.appendChild(rightRow)
                          tbody.appendChild(tr)
                      }
                      newtable.appendChild(tbody)
                      panel.appendChild(panelhead)
                      panel.appendChild(newtable)
                      var mytable = document.getElementById('tabl1')
                      mytable.appendChild(panel)
                    })
        }
      )
  })
  document.getElementById('btn-profile').addEventListener('click', function () {
    document.location.href='/profile'
  })
  window.onbeforeunload = function (e) {
    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'WARNING! Reloading will cause you to logout.';
    }

    // For Safari
    return 'WARNING! Reloading will cause you to logout.';
  }
  $("#loginformA").submit(function(e) {

    var url = "/"; // the script where you handle the form input.

    $.ajax({
           type: "POST",
           url: url,
           data: $("#loginformA").serialize(), // serializes the form's elements.
           success: function(data)
           {
               alert(data); // show response from the php script.
           }
         })

      e.preventDefault(); // avoid to execute the actual submit of the form.
  })
})
