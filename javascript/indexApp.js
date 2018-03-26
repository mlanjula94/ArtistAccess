function changePage() {
    artist = $("#searchBar").val();
    console.log(artist);
   // window.location.href = "artistAccess.html";
    localStorage.setItem("artist", artist);
    console.log(artist);
}

function animation() {
                
    setTimeout(function() {
        $('.fly-in-text').removeClass('hidden');
    }, 500);
    
};


$(document).on("click", "#searchBtn", changePage);
animation();