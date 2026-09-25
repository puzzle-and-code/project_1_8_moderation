document.querySelector(".btn-primary").addEventListener('click', () => {
  window.location.href = '../main/general.html';
}
)
document.querySelectorAll(".tab-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var tab = this.dataset.tab;

    document.querySelectorAll(".tab-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    document.querySelectorAll(".form-panel").forEach(function (p) {
      p.classList.remove("active");
    });

    this.classList.add("active");
    document.getElementById("panel-" + tab).classList.add("active");
  });
});

// ── Toggle password visibility ─────────────────────────
var eyeOnSvg =
  '<svg class="eye-on" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
var eyeOffSvg =
  '<svg class="eye-off" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';

function togglePass(id, btn) {
  var input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    btn.innerHTML = eyeOnSvg;
  } else {
    input.type = "password";
    btn.innerHTML = eyeOffSvg;
  }
}
