var objCountries = [];
var biggestCountry = [];
var smallestCountries = [];
var biggestCountries = [];


$(document).ready(function() {
    $.getJSON('https://restcountries.eu/rest/v2/all', function(countries) {
        objCountries = countries;
        $.each(countries, function(index, country) {

            $('#cmbCountry').append($('<option>', {
                value: index,
                text: country.name
            }));
        });
    biggestCountry = objCountries.sort(function(a, b) { return b.area - a.area });
    // console.log(biggestCountry);
    // biggestCountry = biggestCountry[0];
    smallestCountry = objCountries.sort(function(a, b) { return a.area - b.area });
    // console.log(smallestCountry);
    $.each(smallestCountry, function(i, country) {
      if(country.area == null) {
        smallestCountry = smallestCountry.slice(i);
      }
    });
    // smallestCountry = smallestCountry[0];

    // Create array of 5 smallest countires
    for(var i= 0, l = 5; i < l; i++){
      smallestCountries.push(smallestCountry[i]);
    }
    // console.log(smallestCountries);
    //
    // Create array of 5 biggest countires
    for(var i= 0, l = 5; i < l; i++){
      biggestCountries.push(biggestCountry[i]);
    }
    console.log(biggestCountries);
    //
    // smallestCountry = smallestCountry[0];
    // console.log(biggestCountry);
    // console.log(smallestCountry);


    $("#biggest-country").append(
      $("<img>", {
        src: biggestCountry.flag
      }
    ));

    $("#smallest-country").append(
      $("<img>", {
        src: smallestCountry.flag
      }
    ));

    $.each(objCountries, function(i, country) {
      if(country.region == "Europe") {
        $("#country-list").append(
          $("<li>", {
            text: country.name
          }
        ));
      };
    });

    $.each(smallestCountries, function(i, country) {
      $("#smallest-countries").append(`
          <img src="${country.flag}"> </img>
          <p>${country.name}</p>
        `)
    });

  });



    $('#cmbCountry').on('change', function() {
        var indexCountry = $(this).val();
        $('#mainCity').empty();
        $('#countryFlag').empty();
        $('#countryLanguages').empty();
        $('#population').empty();
        $.each(objCountries[indexCountry].languages, function(index, language) {
            $('#countryLanguages').append($('<li>', {
                'data-key': index,
                html: language.name + ' (' + language.nativeName + ')'
            }))
        })
        $('#population').append(`
          <p>${objCountries[indexCountry].population} ${objCountries[indexCountry].demonym}s</p>`)
        $('#mainCity').append(`
              <h1>${objCountries[indexCountry].capital}</h1>
            `)
        $('#countryFlag').append(`<img id="flag" src="${objCountries[indexCountry].flag}">`)

        initMap(objCountries[indexCountry].latlng[0], objCountries[indexCountry].latlng[1]);

        function initMap(latitude, longitude) {
            var mapCenter = { lat: latitude, lng: longitude };

            var zoomObj = 7;

            if (objCountries[indexCountry].area > 400000) {
                zoomObj = 6;
            } else if (objCountries[indexCountry].area > 200000) {
                zoomObj = 7;
            } else if (objCountries[indexCountry].area > 50000) {
                zoomObj = 8;
            } else if (objCountries[indexCountry].area > 25000) {
                zoomObj = 9;
            } else if (objCountries[indexCountry].area < 10000) {
                zoomObj = 10;
            }

            var map = new google.maps.Map($('#map')[0], {
                center: mapCenter,
                zoom: zoomObj
            });
            var icon = {
                url: objCountries[indexCountry].flag, // url
                scaledSize: new google.maps.Size(35, 25), // scaled size
            };

            var objMarker = new google.maps.Marker({
                position: mapCenter,
                map: map,
                icon: icon
            });

            var objInfoWindow = new google.maps.InfoWindow({
                content: `<h1>${objCountries[indexCountry].nativeName}</h1>`
            });

            objMarker.addListener('click', function() {
                objInfoWindow.open(map, objMarker);
            });

        }


    });







});
