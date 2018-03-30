var artist = "";
var artistName = "";
var count = 0.0;
var maxCount = 0;
var slide = [];
var showImage;


  artistMain();


function artistMain() {
  artist = localStorage.getItem("artist");
  localStorage.removeItem("artist")

  $("#tours").empty();
  $("#weather").empty();
  $("#artist_news").empty();
  $("#spotify").empty();
  $(".weatherDiv").css("display", "none");

  stopSlideshow();
  startSlideshow();
  displayNews();
  displayTicketInfo();
  //showSlides(slideIndex);
  displayPlaylist()
};

$("#searchBtn").click(function (event) {
  event.preventDefault();
  slide = [];
  count = 0.0;
  maxCount = 0;
  artist = $("#searchBar").val();
  $("#tours").empty();
  $("#weather").empty();
  $("#artist_news").empty();
  $("#spotify").empty();
  $(".weatherDiv").css("display", "none");

  displayNews();
  displayTicketInfo();
  //showSlides(slideIndex);
  displayPlaylist()
});

function displayNews() {
  $.ajax({
    url: "https://newsapi.org/v2/everything?sources=mtv-news&" +
      "apiKey=b9afaea6d5c54fb6a1de0115048012ee&q=" + artist,
    method: 'GET',
    dataType: "json"
  }).done(function (result) {
    //console.log(result);

    maxCount = parseInt(result.totalResults);

    for (var i = 0; i < parseInt(result.totalResults) - 1; i++) {
      var article = result.articles[i];
      var articleNum = i + 1;
      var articleDiv = $("<a target='blank' href='" + article.url + "'>");
      //articleDiv.addClass("mySlides");
      //articleDiv.addClass("fade");
      articleDiv.addClass("text-white slide-content");
      articleDiv.addClass("text-left");
      articleDiv.attr("id", "article-" + i + 1);

      var img = $('<img />', {
        id: 'news-' + articleNum,
        src: article.urlToImage,
        width: "100%",
        height: "auto",
        alt: 'news image',
        float: 'left'
      });
      articleDiv.append(img);

      // if the article has a headline, log and append to articleDiv
      var headline = article.title;

      if (headline) {
        //console.log(headline.main);
        articleDiv.append(
          "<h3 class='text-left'>" +
          "<strong> " + headline + "</strong></h3>"
        );
      }

      var byline = article.description;
      if (byline) {
        articleDiv.append("<p>" + byline + "</p>");
      }

      // log published date, and append to document if exists
      var pubDate = article.publishedAt;
      //console.log(article.pub_date);
      if (pubDate) {
        articleDiv.append("<h5>" + pubDate + "</h5>");
      }

      slide.push(articleDiv);
    }
    startSlideshow();

  }).fail(function (err) {
    throw err;
  });
}

function startSlideshow() {
  showImage = setInterval(nextImage, 5000);
}

function displayImage() {
  console.log(count);
  $("#artist_news").html(slide[count]);
}

function nextImage() {
  count = 1 + count;

  $("#artist_news").html("<img src='./images/loading.gif' width='100%'/>");

  setTimeout(displayImage, 1000);
  if (count === slide.length) {
    count = 1;
  }
}

function stopSlideshow() {
  clearInterval(showImage);
  while (slide.length > 0) {
    slide.pop();
  }
}

function nextClick() {
  clearInterval(showImage);
  count = count + 1.0;
  displayImage();
};

function prevClick() {
  count = count - 1.0;
  clearInterval(showImage);
  console.log("righty");
  displayImage();
};


function displayTicketInfo() {
  $("#tours").empty();
  $(".weatherDiv").css("display", "none");
  $.ajax({
    type: "GET",
    url: "https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=lVYGpSlPaCHOUOJwywjUkjDcjfNmbrUR" +
      '&keyword=' + artist,
    async: true,
    dataType: "json"
  }).done(function (result) {
    console.log(result);

    var event = result._embedded.events;

    for (var i = 0; i < event.length; i++) {
      var eventName = event[i].name;
      var location = "";
      if (event[i].dates.timezone) {
        location = event[i].dates.timezone.split("/");
      } else {
        location = "TBA"
      }
      eventDate = event[i].dates.start.localDate;


      var eventBtn = $("<a>");
      eventBtn.addClass("tour text-left");
      eventBtn.attr("name", eventName);
      eventBtn.attr("date", eventDate);
      eventBtn.attr("location", location);
      eventBtn.attr("time", event[i].dates.localTime);
      eventBtn.attr("info", event[i].info);
      eventBtn.attr("url", event[i].url);
      eventBtn.attr("img", event[i].images[0].url);

      eventBtn.attr("id", "event-" + i + 1);

      eventNum = i + 1;

      $("#tours").append(eventBtn);
      //console.log(location);
      if (eventName) {

        eventBtn.append(
          '<p type="button" class="bg-dark">' + eventDate + ' | ' + eventName + ' | ' +
          location + ' </p>'
        );
      }
    }
  })

}

function displayWeather() {
  $("#weather").empty();
  $(".weatherDiv").css("display", "block");
  var APIKey = "166a433c57516f51dfab1f7edaed8413";
  var city = $(this).attr("location");
  if (city === "TBA") {
    var weatherDiv = $("<div>");
    weatherDiv.addClass("text-center h2 text-warning");
    weatherDiv.text("Sorry location hasnt been decided yet");
    $("#weather").append(weatherDiv);
  } else {
    var date = $(this).attr("date");
    // Here we are building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
      "date=" + date + "&q=" + city + "=imperial&appid=" + APIKey;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
      })
      // We store all of the retrieved data inside of an object called "response"
      .then(function (response) {
        //console.log(response);

        var locationDiv = $("<div>");
        locationDiv.addClass("text-center font-weight-bold h3 text-white");
        locationDiv.append(city + " on " + date);
        $("#weather").append(locationDiv);

        //var dateDiv = $("<div>");
        //locationDiv.addClass("text-right font-weight-bold h3 text-white");
        //locationDiv.text(date);

        $("#weather").append(locationDiv);
        //$("#weather").append(dateDiv);
        $("#weather").append("<hr>");

        var weatherDiv = $("<div>");
        weatherDiv.addClass("text-center h2 text-white");
        weatherDiv.text('Weather summary : ' + response.weather[0].description);
        //console.log(response.weather[0].description);
        $("#weather").append(weatherDiv);

        var faranhite = 1.8 * (parseInt(response.main.temp) - 273) + 32;

        var weatherDiv2 = $("<div>");
        weatherDiv2.addClass("text-center h2 text-white");
        weatherDiv2.css("display", "inline-block")
        weatherDiv2.text('Temperature : ' + faranhite + 'F');
        //console.log(faranhite);
        $("#weather").append(weatherDiv2);

        var weatherDiv2 = $("<div>");
        weatherDiv2.addClass("text-center h2 text-white");
        weatherDiv2.text('Humidity : ' + response.main.humidity);
        //console.log(response.main.humidity + "cccc" + response.main.temp);
        $("#weather").append(weatherDiv2);
      })
  }
}

function displaySelectedEvent() {
  $("#tours").empty();
  var city = $(this).attr("location");
  var eventName = $(this).attr("name");
  var date = $(this).attr("date");
  var time = $(this).attr("time");
  var info = $(this).attr("info");
  var url = $(this).attr("url");
  var imgsrc = $(this).attr("img");

  var heading = "<h3 class='text-center font-weight-bold h3 text-white'>" + eventName + "</h3>";
  var body_img = "<img class='text-center' width=50% height=auto src='" + imgsrc + "' alt='event image'>";
  var date_time = "<div class='text-center text-white'>DATE :" + date + "    TIME" + time + " </div>"
  var body_info = "<div class='text-center text-white font-italic'>DATE :" + date + "    TIME" + time + " </div>"
  var body_url = "<a href='" + url + "'>Buy tickets here</a>";
  var back_btn = "<img class='text-center backToEvents' width=10% height=auto src='./images/back-button.png' alt='back btn'>";

  $("#tours").append(heading, body_img, date_time, body_info, body_url, "<br><br>", back_btn);

}

function displayPlaylist() {


  // console.log('this.state', this.state);
  const BASE_URL = 'https://api.spotify.com/v1/search?';
  const FETCH_URL = BASE_URL + 'q=' + artist + '&type=artist&limit=1';
  var accessToken = 'BQD9FYWdgJE71E05xgjJFmUHEimKQWRWPS0yqPme4SzquNczERQjyGgFBDrmz67otjAfVNiiQxxw-Ak_RCmUxxMhvoY2k0kjsTyCxZIlUed0A0_nBuNx_SE3t0oOM1ZdJuxjruxxusofsHQ2z5IBaFl0XYQCHbD_4tGc2iA'
  var myHeaders = new Headers();

  var myOptions = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    mode: 'cors',
    cache: 'default'
  };

  fetch(FETCH_URL, myOptions)
    .then(response => response.json())
    .then(function (response) {

      var iframe = '<iframe src="https://open.spotify.com/embed/' +
        'artist/' + response.artists.items[0].id +
        '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';
      $("#spotify").append(iframe);

    })
}

$(document).on("click", "#arrow-left", prevClick);
$(document).on("click", "#arrow-right", nextClick);
$(document).on("click", ".tour", displayWeather);
$(document).on("click", ".tour", displaySelectedEvent);
$(document).on("click", ".backToEvents", displayTicketInfo);