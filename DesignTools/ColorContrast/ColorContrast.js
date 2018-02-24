var main = function() {

    var settings = {
        minimumContrast: 4.5
    }

    function Color(colorAsText) {
        this.originalColor = colorAsText.trim();
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.isValid = false;

        this.asHex = function() {
            if (this.isValid === false) {
                return "";
            }

            var redHex = this.red.toString(16);
            var greenHex = this.green.toString(16);
            var blueHex = this.blue.toString(16);

            if (redHex.length < 2) {
                redHex = "0" + redHex;
            }
            if (greenHex.length < 2) {
                greenHex = "0" + greenHex;
            }
            if (blueHex.length < 2) {
                blueHex = "0" + blueHex;
            }

            return "#" + redHex + greenHex + blueHex;
        }

        this.init = function() {
            var hexThreeDigitPattern = /^#?([A-Fa-f\d])([A-Fa-f\d])([A-Fa-f\d])$/i;
            var hexSixDigitPattern = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
            var rgbPattern = /^[rR][gG][bB]\((\d+),\s*(\d+),\s*(\d+)\)$/i;
            var hsvPattern = /^[hH][sS][vV]\((\d+),\s*(\d+),\s*(\d+)\)$/i;

            this.isValid = true;

            // #3F5
            if (hexThreeDigitPattern.test(this.originalColor)) {
                var result = hexThreeDigitPattern.exec(this.originalColor);
                this.red = parseInt(result[1] + result[1], 16);
                this.green = parseInt(result[2] + result[2], 16);
                this.blue = parseInt(result[3] + result[3], 16);

                if (this.red < 0 || this.green < 0 || this.blue < 0 ||
                    this.red > 255 || this.green > 255 || this.blue > 255) {
                    this.isValid = false;
                }

                return;
            }

            // #34EF78
            if (hexSixDigitPattern.test(this.originalColor)) {
                var result = hexSixDigitPattern.exec(this.originalColor);
                this.red = parseInt(result[1], 16);
                this.green = parseInt(result[2], 16);
                this.blue = parseInt(result[3], 16);

                if (this.red < 0 || this.green < 0 || this.blue < 0 ||
                    this.red > 255 || this.green > 255 || this.blue > 255) {
                    this.isValid = false;
                }

                return;
            }

            if (rgbPattern.test(this.originalColor)) {
                var result = rgbPattern.exec(this.originalColor);
                this.red = parseInt(result[1], 10);
                this.green = parseInt(result[2], 10);
                this.blue = parseInt(result[3], 10);

                if (this.red < 0 || this.green < 0 || this.blue < 0 ||
                    this.red > 255 || this.green > 255 || this.blue > 255) {
                    this.isValid = false;
                }

                return;
            }

            this.isValid = false;
        }

        this.init();
    }

    function contrastForColors(color1, color2) {
        return 12;
    }

    function calculateContrast() {
        var colorList = [];

        for (i = 1; i < 6; i++) {
            var color = new Color($("#color-" + i).val());

            if (!color.isValid) {
                continue;
            }

            colorList.push(color);
        }

        if (colorList.length < 2) {
            // hide contrast selection and result
            $("#result-card").addClass("hidden");
            $("#contrast-selection-card").addClass("hidden");
            return;
        }

        $("#result-card").empty();

        var numberOfValidCombinations = 0;
        var contrastResultHtml = "";

        for (var i = 0; i < colorList.length - 1; ++i) {
            for (var j = i + 1; j < colorList.length; ++j) {

                if (contrastForColors(colorList[i], colorList[j]) < settings.minimumContrast) {
                    continue;
                }

                contrastResultHtml +=
                    "<div class=\"row\">" +
                    "    <div class=\"col-xs-12 result\" style=\"background: " + colorList[i].asHex() + "; color: " + colorList[j].asHex() + "\">" +
                    "        <div>" + colorList[i].originalColor + "<br/>" + colorList[j].originalColor + "</div>" +
                    "        <div>5,6</div>" +
                    "    </div>" +
                    "</div>";
                ++numberOfValidCombinations;
            }
        }

        $("#result-card").append(
            "<h2>" + numberOfValidCombinations + " Matches</h2>" +
            contrastResultHtml);
        $("#contrast-selection-card").removeClass("hidden");
        $("#result-card").removeClass("hidden");
    }

    $("input").focusin(function() {
        if ($(this).hasClass("color-input-empty")) {
            $(this).removeClass("color-input-empty");
        }
    });

    $("input").focusout(function() {
        var color = new Color($(this).val());

        if (color.originalColor === "") {
            $(this).addClass("color-input-empty");
            $("#" + $(this).attr("id") + "-preview").css('background-color', 'white');
            calculateContrast();
            return;
        }

        if (!color.isValid) {
            $(this).addClass("color-input-error");
            $("#" + $(this).attr("id") + "-preview").css('background-color', 'white');
            calculateContrast();
            return;
        }

        if ($(this).hasClass("color-input-error")) {
            $(this).removeClass("color-input-error");
        }

        // alert("#" + $(this).attr("id") + "-preview");
        $("#" + $(this).attr("id") + "-preview").css('background-color', color.originalColor);

        calculateContrast();
    });

    $("#contrast-1").click(function() {
        $("#contrast-1").addClass("contrast-button-active");
        $("#contrast-2").removeClass("contrast-button-active");
        $("#contrast-3").removeClass("contrast-button-active");
        $("#contrast-4").removeClass("contrast-button-active");
        settings.minimumContrast = 1;
        calculateContrast();
    });

    $("#contrast-2").click(function() {
        $("#contrast-1").removeClass("contrast-button-active");
        $("#contrast-2").addClass("contrast-button-active");
        $("#contrast-3").removeClass("contrast-button-active");
        $("#contrast-4").removeClass("contrast-button-active");
        settings.minimumContrast = 3;
        calculateContrast();
    });

    $("#contrast-3").click(function() {
        $("#contrast-1").removeClass("contrast-button-active");
        $("#contrast-2").removeClass("contrast-button-active");
        $("#contrast-3").addClass("contrast-button-active");
        $("#contrast-4").removeClass("contrast-button-active");
        settings.minimumContrast = 4.5;
        calculateContrast();
    });

    $("#contrast-4").click(function() {
        $("#contrast-1").removeClass("contrast-button-active");
        $("#contrast-2").removeClass("contrast-button-active");
        $("#contrast-3").removeClass("contrast-button-active");
        $("#contrast-4").addClass("contrast-button-active");
        settings.minimumContrast = 7;
        calculateContrast();
    });
};

$('document').ready(main);