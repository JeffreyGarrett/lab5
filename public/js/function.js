$(document).ready(function () {

    $(".favoriteIcon").on("click", function () {

        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let keyword = urlParams.get("keyword");

        let imageUrl = $(this).prev().attr("src");

        if ($(this).attr("src") == "img/favorite.png") {
            $(this).attr("src", "img/favorite_on.png");
            updateFavorite("add", imageUrl, keyword);
        } else {
            $(this).attr("src", "img/favorite.png");
            updateFavorite("delete", imageUrl);
        }
    });

    function updateFavorite(action, umageUrl, keyword) {
        $.ajax({
            method: "get",
            url: "/api/updateFavorites",
            data: {
                "action": action,
                "imageUrl": imageUrl,
                "keyword": keyword
            },
            success: function (data, status) {

            }
        });
    }
});