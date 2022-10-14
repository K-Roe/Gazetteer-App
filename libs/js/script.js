
// call for the map to show up on the web page.
let map = L.map('map').fitWorld();
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'

}).addTo(map);
var positronLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
    attribution: '©OpenStreetMap, ©CartoDB',
    pane: 'labels'
}).addTo(map);



// end of call for map

// easy button functions









// end of easy button functions
// start of populate search select

// pulls the data from the php file
fetch("./libs/php/countryList.php")
    .then(function (response) {
        return response.json();
    })
    .then(data => list = data)
    .then(success => selectCountrylist(success))
// passes the data in to the fuction selectCounrylist
// functions runs passing the data in to the html file to populate the select process  

function selectCountrylist(success) {
    select = document.getElementById("selectCountry");
    let option = list;
    option.sort() // makes list in to alphabetical order
    for (let i = 0; i < option.length; i++) {
        let opt = option[i];
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el)


    }


    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };




    function success(pos) {
        const crd = pos.coords;
        latitude = crd.latitude;
        longitude = crd.longitude



        $.ajax({
            url: "libs/php/datacloud.php",
            type: 'POST',
            dataType: 'json',
            data: {
                latitude: latitude,
                longitude: longitude

            },
            success: function (result) {



                if (result.status.name == "ok") {

                    usersLocation = result['data']["countryName"];
                    userCode = result['data']["countryCode"];
                    userLocCode = usersLocation + "," + userCode;



                }


                if (usersLocation.indexOf(option) === -1) {
                    let url = ('./libs/php/countryBorder.php?iso_a2=' + userCode); // makes the URL (url + iso_a2)

                    fetch(url) // calls the url from above
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            $(document).ready(() => {

                                $("#selectCountry").val(userLocCode);
                                selectChange()

                            });

                            L.geoJSON(data).addTo(map); // places shape around the county user picks


                        })

                }



            },
            error: function (jqXHR, textStatus, errorThrown) {
                // your error code
            }

        });




    }
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);



};
// end of populate serch bar





function selectChange() { // will change all data when you change the selected country

    // Start of border data
    var iso_a2 = document.getElementById("selectCountry").value // saves the value of which country the user has picked
    var isoCode = iso_a2.slice(-2); // takes only the iso_a2 code by pick the last 2 letters from the user select
    var countryMain = iso_a2.slice(0, -3)


    let url = ('./libs/php/countryBorder.php?iso_a2=' + isoCode); // makes the URL (url + iso_a2)

    fetch(url) // calls the url from above
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            $(".leaflet-interactive").remove() // removes all shades before placing a new one
            L.geoJSON(data).addTo(map); // places shape around the county user picks
        })



    // end of border data

    // Start of info data

    $.ajax({
        url: "libs/php/countryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lang: "eng",
            country: isoCode

        },
        success: function (result) {



            if (result.status.name == "ok") {


                fipsCode = result["data"][0]["fipsCode"]
                lowerFipsCode = fipsCode.toLowerCase();
                north = result["data"][0]["north"]
                south = result["data"][0]["south"]
                east = result["data"][0]["east"]
                west = result["data"][0]["west"]
                areaInSqKm = result['data'][0]["areaInSqKm"];
                population = result['data'][0]["population"];
                capital = result['data'][0]["capital"];
                country = result['data'][0]["countryName"];
                fipscountryCode = result["data"][0]["countryCode"]
                lowercountryCode = fipscountryCode.toLowerCase();

            }




        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
        }

    });






    $.ajax({
        url: "libs/php/Weather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            q: countryMain

        },
        success: function (result) {


            if (result.status.name == "ok") {

                
                lat = result["data"]["coord"]["lat"]
                lng = result["data"]["coord"]["lon"]
                temp = result["data"]["main"]["temp"]
                weather = result["data"]["weather"][0]["description"]


            }




        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
        }

    });





    $.ajax({
        url: "libs/php/Wikipedia.php",
        type: 'POST',
        dataType: 'json',
        data: {
            q: countryMain

        },
        success: function (result) {


            if (result.status.name == "ok") {

                wiki = result["data"][1]["summary"]

            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
        }

    });




    $.ajax({
        url: "libs/php/OpenCage.php",
        type: 'POST',
        dataType: 'json',
        data: {
            q: isoCode,

        },
        success: function (result) {




            if (result.status.name == "ok") {

                latlng = result["data"]["results"][0]["geometry"];
                lat = result["data"]["results"][0]["geometry"]["lat"];
                lng = result["data"]["results"][0]["geometry"]["lng"];
                currency = result['data']["results"][0]["annotations"]["currency"]["name"];
                countryName = result['data']["results"][0]["annotations"]["timezone"]["name"];
                countryMainTogther = countryMain.split(" ").join("");

                wikiLink = `<a href="https://en.wikipedia.org/wiki/${countryName}">Wikipedia Link</a>`













            }


            L.easyButton('fa-globe', function (btn, map) {
                
                info.update = function (result) {
                    this._div.innerHTML = 
                    
                    '<h4>Country Information</h4>'
                        + "Country Name: " + country + "<br>"
                        + "Country Capital: " + capital + "<br>"
                        + "Country Population: " + population + "<br>"
                        + "Area in SqKm: " + areaInSqKm + "<br>"
                        + "Currency: " + currency + "<br>"
                        + "Latitude: " + lat + "<br>"
                        + "Longitude: " + lng + "<br>"
                        + "Weather in capital: " + weather + "<br>"
                        + "Temperature in capital: " + temp + "<br>"
                        + wikiLink + "<br>"

                };
                info.addTo(map);
            }).addTo(map);

            map.setView(latlng, maxzoom = 3) // zoom to locaton selected


            var greatPyramid = L.marker([29.979, 31.1342]).addTo(map);
            greatPyramid.bindPopup("<b>Great Pyramid of Giza<b>")

            var statueofZeusatOlympia = L.marker([37.38163, 21.3748]).addTo(map);
            statueofZeusatOlympia.bindPopup("<b>Statue of Zeus at Olympia<b>")
            var hangingGardensofBabylon = L.marker([32.5355, 44.4275]).addTo(map);
            hangingGardensofBabylon.bindPopup("<b>Hanging Gardens of Babylon<b>")
            var templeOfArtemisAtEphesus = L.marker([37.5659, 27.2150]).addTo(map);
            templeOfArtemisAtEphesus.bindPopup("<b>Temple of Artemis at Ephesus<b>")
            var mausoleumatHalicarnassus = L.marker([37.0379, 27.4241]).addTo(map);
            mausoleumatHalicarnassus.bindPopup("<b>Mausoleum at Halicarnassus<b>")
            var colossusOfRhodes = L.marker([36.2704, 28.1340]).addTo(map);
            colossusOfRhodes.bindPopup("<b>Colossus of Rhodes<b>")
            var lighthouseOfAlexandria = L.marker([31.1250, 29.5308]).addTo(map);
            lighthouseOfAlexandria.bindPopup("<b>Lighthouse of Alexandria<b>")


            L.easyButton('fa-star', function (btn, map) {
                $.ajax({
                    url: "libs/php/POI.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        countrycode: lowerFipsCode

                    },


                    success: function (result) {
                        if (result["data"]["code"] == 8) {

                            $.ajax({
                                url: "libs/php/POI.php",
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    countrycode: lowercountryCode

                                },


                                success: function (result) {



                                    markers = new L.MarkerClusterGroup();

                                    if (result.status.name == "ok") {




                                        pointsOfIntrest = result["data"]["results"]






                                        for (var i = 0; i < pointsOfIntrest.length - 1; i++) {
                                            if (pointsOfIntrest[i]["images"][0] === undefined) { continue; }

                                            poiImage = (pointsOfIntrest[i]["images"][0]["sizes"]["thumbnail"]["url"])

                                            poiName = pointsOfIntrest[i]["name"]
                                            poiSnippet = pointsOfIntrest[i]["snippet"]

                                            poiIUrl = `<img src="${poiImage}" alt="image" />`









                                            markers.addLayer(L.marker([pointsOfIntrest[i]["coordinates"]["latitude"], pointsOfIntrest[i]["coordinates"]["longitude"]]).bindPopup(`<h1>${poiName}</h1>` + `<p>${poiSnippet}</p>` + poiIUrl).openPopup())





                                        }








                                        map.addLayer(markers);








                                    }


                                },

                                error: function (jqXHR, textStatus, errorThrown) {
                                    // your error code





                                }

                            });



                        }


                        markers = new L.MarkerClusterGroup();

                        if (result.status.name == "ok") {




                            pointsOfIntrest = result["data"]["results"]






                            for (var i = 0; i < pointsOfIntrest.length - 1; i++) {
                                if (pointsOfIntrest[i]["images"][0] === undefined) { continue; }

                                poiImage = (pointsOfIntrest[i]["images"][0]["sizes"]["thumbnail"]["url"])

                                poiName = pointsOfIntrest[i]["name"]
                                poiSnippet = pointsOfIntrest[i]["snippet"]

                                poiIUrl = `<img src="${poiImage}" alt="image" />`









                                markers.addLayer(L.marker([pointsOfIntrest[i]["coordinates"]["latitude"], pointsOfIntrest[i]["coordinates"]["longitude"]]).bindPopup(`<h1>${poiName}</h1>` + `<p>${poiSnippet}</p>` + poiIUrl).openPopup())





                            }






                            map.addLayer(markers);








                        }





                    },

                    error: function (jqXHR, textStatus, errorThrown) {
                        // your error code





                    }

                });
            }).addTo(map);


            L.easyButton('fa-home', function (btn, map) {

                var Home = [latitude, longitude];
                map.setView(Home, 13);
                var circle = L.circle([latitude, longitude], {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 50
                }).addTo(map);

            }).addTo(map);












        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
        }



    });


    // end of info data





}



var info = L.control();

info.onAdd = function (map) {

    
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};




// =============================================================================== \\

