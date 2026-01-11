(function () {
    const reversed = "ed.24gitteuhe@tcatnoc";

    function unreversed(str) {
        return str.split("").reverse().join("");
    }

    function reveal(btn) {
        const email = unreversed(reversed);
        if (!email) return;
        const a = document.createElement("a");
        a.href = "mailto:" + email;
        a.textContent = email;
        a.className = "cta";
        a.setAttribute("role", "link");

        // replace the button with the mailto link
        btn.replaceWith(a);
        a.focus();

        // try copying to clipboard for convenience (optional)
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).catch(() => {});
        }
    }

    document.querySelectorAll(".reveal-email-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            reveal(btn);
        });
        btn.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                reveal(btn);
            }
        });
    });
})();
