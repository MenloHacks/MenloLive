$.ajax({
    url: "https://api.parse.com/1/classes/Announcement",
    headers: {
        "X-Parse-Application-Id": "nice",
        "X-Parse-REST-API-Key": "try"
    },
    data: {"order":"fireTime"}
}).success (function(e) {
    loadAnnouncements(e.results);
});


function loadAnnouncements(results) {
    for(var i in results) {
        j = results.length - i - 1;
        console.log(Date.now() > Date.parse(results[j].fireTime.iso));
        console.log(Date.parse(results[j].fireTime.iso));
        console.log(Date.now());
        if(results[j].armed == true && Date.now() > Date.parse(results[j].fireTime.iso)) {
            $("#announcementList").append(
                "<tr><td>" + results[j].messageContents + "</td>" + 
                "<td>" + isoToHumanString(results[j].fireTime.iso) + "</td></tr>"
            );
        }
    }
}



$.ajax({
    url: "https://api.parse.com/1/classes/EventLocation",
    headers: {
        "X-Parse-Application-Id": "nice",
        "X-Parse-REST-API-Key": "try"
    }
}).success (function(e) {
    console.log(e);
    loadEvents(e.results);
});

function loadEvents(results) {
    locations = {};
    for(var i in results) {
        locations[results[i].objectId] = results[i];
    }
    $.ajax({
        url: "https://api.parse.com/1/classes/Event",
        headers: {
            "X-Parse-Application-Id": "nice",
            "X-Parse-REST-API-Key": "try"
        },
        data: {"order":"start_time"}
    }).success (function(e) {
        console.log(e);
        loadResults(e.results, locations);
    });
}

function loadResults(results, locations) {
    var now = Date.now();//1460837400000
    for(var i in results) {
        if(now < Date.parse(results[i].end_time.iso) + 3600000) {
            if(now > Date.parse(results[i].start_time.iso) && now < Date.parse(results[i].end_time.iso))
                ongoing = "event-ongoing";
            else
                ongoing = "";

            $("#eventList").append(
                "<tr class=\"" + ongoing + "\">" + 
                "<td><a href=\"#\" data-toggle=\"modal\" data-target=\"#myModal\" data-desc=\"" + results[i].long_description + "\" data-map=\"" + locations[results[i].location.objectId].map_image.url + "\">" + 
                results[i].short_description + "</a></td>" +
                "<td>" + locations[results[i].location.objectId].location_name + "</td>" +
                "<td>" + isoToHumanString(results[i].start_time.iso) + "</td></tr>");
        }
    }
    addEventListeners();
}

function isoToHumanString(isoTime) {
    var dt = new Date(isoTime);
    var hours = dt.getHours();
    var minutes = dt.getMinutes();
    var ampm = "AM";
    console.log(hours + " " + minutes);

    if (hours >= 12) {
        ampm = "PM";
    }
    hours = hours % 12

    if (hours == 0)
        hours = 12

    if (minutes < 10) 
     minutes = '0' + minutes;
    
    return "" + hours + ":" + minutes + " " + ampm
}

function addEventListeners() {
    $("a").click(function(e) {
        $("#myModalLabel").html(e.currentTarget.innerHTML);
        $("#mainDescription").html(e.currentTarget.getAttribute("data-desc"));
        $("#mainMap").attr("src", e.currentTarget.getAttribute("data-map"));
    });
}


setTimeout(function () {
    location.reload();
}, 30000);