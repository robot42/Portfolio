var main = function () {
    /* we need to track if the colors are specified by the user or if they are our ouwn initial values */
    var isColorListUserDefined = false;

    function cancel() {
        /* restore the old user entries or bring the dummy entries back */
    }

    function save() {
        var colorCount = $(".color-list").length;

        if ((colorCount === 1) && ($(".color-list").children().first().text().length === 0)) {
            /* restore the dummy entries and set the apropriate style */
            isColorListUserDefined = false;
            $(".color-list").append("<li class=\"color-entry\">RGB(255,100,23)</li>");
            $(".color-list").append("<li class=\"color-entry\">HSL(34,200,19)</li>");
            $(".color-list").append("<li class=\"color-entry\">#FF05A3</li>");
            $("#edit-function").removeClass("function-area-invisible");
            $("#tap-function").addClass("function-area-invisible");
        }
        else {
            /* check the input and update the result view */
            isColorListUserDefined = true;
            $(".color-list").append("<li class=\"color-entry\">t r u e</li>");
        }
        $(".color-list").append("<li class=\"color-entry\">" + $(".color-list").children().first().text() + "</li>");
    }

    /* the color list looses the input focus, we treat this the same as the save button */
    $(".color-list").focusin(function() {
        $("#tap-function").addClass("function-area-invisible");
        if (isColorListUserDefined === false) {
            $(".color-entry").remove();
        }
        $("#edit-function").removeClass("function-area-invisible");
    });

    $("#tap-function").click(function() {
        $("#tap-function").addClass("function-area-invisible");
        $(".color-entry").remove();
        $(".color-list").focus();
        $("#edit-function").removeClass("function-area-invisible");
    });

    $("#save-button").click(function() {
       save();
    });
}

$('document').ready(main);
