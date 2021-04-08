//1.search
var UI={};
//IF pressed Enter
UI.pressEnter=function(){
    document.querySelector('.js-search').addEventListener("keyup",function(k){
        if(k.which === 13){
            var inputValue = k.target.value;
            SoundCloudAPI.getTracks(inputValue);
        }
    })
};
//IF pressed submit Icon
UI.pressSubmit= function(){
    document.querySelector('.js-submit').addEventListener("click",function(){
        var input = document.querySelector('.js-search').value;
        SoundCloudAPI.getTracks(input);
    });
};
UI.pressSubmit();
UI.pressEnter();


//2.Information from soundcloud API

var SoundCloudAPI = {};
SoundCloudAPI.init = function () {
  SC.initialize({
    client_id: "cd9be64eeb32d1741c17cb39e41d254d",
  });
};

SoundCloudAPI.init();


//Search - https://developers.soundcloud.com/docs/api/guide#search

SoundCloudAPI.getTracks = function (inputvalue) {
  // find all sounds of buskers licensed under 'creative commons share alike'
  SC.get("/tracks/", {
    q: inputvalue,
  }).then(function (tracks) {
    // console.log(tracks);
    var searchResult = document.querySelector('.js-search-results');
			searchResult.innerHTML = "";
    SoundCloudAPI.renderTracks(tracks,searchResult);
  });
};

//3.Display the sound cards

SoundCloudAPI.renderTracks = function (tracks,searchResults) {
  tracks.forEach(function (track) {
    // console.log(track);

    //creating Elements
    var card = document.createElement("div");
    var imagesdiv = document.createElement("div");
    var imagesdiv_img = document.createElement("img");
    var content = document.createElement("div");
    var header = document.createElement("div");
    var playlistBTN = document.createElement("div");

    //assigning Class names to created elements
    card.classList.add("card");
    imagesdiv.classList.add("image");
    imagesdiv_img.src =
      track.artwork_url || " https://source.unsplash.com/collection/190727/100x100";
    content.classList.add("content");
    header.classList.add("header");
    playlistBTN.classList.add(
      "ui",
      "bottom",
      "attached",
      "button",
      "js-button"
    );

    //appending them to dom
    searchResults.appendChild(card);
    card.appendChild(imagesdiv);
    imagesdiv.appendChild(imagesdiv_img);
    card.appendChild(content);
    content.appendChild(header);
    header.innerHTML = '<a href="'+track.permalink_url+'" target="_blank">"' + track.title + '"</a>';
    card.appendChild(playlistBTN);
    playlistBTN.innerHTML =
      '<i class="add icon"></i>  <span>Add to playlist</span>';
    playlistBTN.addEventListener('click',function(){
        SoundCloudAPI.Oembed(track.permalink_url);
    });
});
};

//4.Add to the playlist(left side black bg)


//embedding
//https://developers.soundcloud.com/docs/api/sdks#embedding

SoundCloudAPI.Oembed=function(trackURL){
    // console.log("Clicked");
    
    SC.oEmbed(trackURL, {
        auto_play: true,
}).then(function (embed) {
    console.log("oEmbed response: ", embed);
    
    var side_bar = document.querySelector(".js-playlist");
    var box = document.createElement('div');
    box.innerHTML = embed.html;
    side_bar.insertBefore(box,side_bar.firstChild);
    localStorage.setItem("key",side_bar.innerHTML);

});

}


var side_bar = document.querySelector(".js-playlist");
side_bar.innerHTML=localStorage.getItem("key");



document.querySelector('.resetbtn').addEventListener('click',function(){
  localStorage.clear();
  var side_bar = document.querySelector(".js-playlist");
  side_bar.innerHTML="";
})