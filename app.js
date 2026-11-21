// 한 걸음씩 넘기기, 평수 고르기, 인쇄. 스크립트가 꺼져 있어도 모든 내용은 그대로 읽힌다.
(function () {
  var root = document.documentElement;
  root.classList.add("js");

  document.querySelectorAll("[data-stepper]").forEach(function (box) {
    var steps = [].slice.call(box.querySelectorAll("[data-step]"));
    var prog = box.querySelector("[data-prog]");
    var cells = box.querySelectorAll(".bar i");
    var prev = box.querySelector("[data-prev]");
    var next = box.querySelector("[data-next]");
    var nav = box.querySelector("[data-nav]");
    var allWrap = box.querySelector("[data-allwrap]");
    var allBtn = box.querySelector("[data-all]");
    var cur = 0;
    function show(i) {
      cur = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach(function (s, k) { s.classList.toggle("cur", k === cur); });
      cells.forEach(function (c, k) { c.classList.toggle("on", k <= cur); });
      prog.textContent = "걸음 " + (cur + 1) + " / " + steps.length;
      prev.disabled = cur === 0;
      next.textContent = cur === steps.length - 1 ? "처음으로" : "다음";
    }
    nav.hidden = false;
    allWrap.hidden = false;
    prev.addEventListener("click", function () { show(cur - 1); });
    next.addEventListener("click", function () { show(cur === steps.length - 1 ? 0 : cur + 1); });
    allBtn.addEventListener("click", function () {
      var all = box.classList.toggle("all");
      nav.hidden = all;
      allBtn.textContent = all ? "한 걸음씩 보기" : "한 번에 다 보기";
      prog.textContent = all ? "모두 " + steps.length + "걸음" : "걸음 " + (cur + 1) + " / " + steps.length;
      cells.forEach(function (c, k) { c.classList.toggle("on", all || k <= cur); });
    });
    show(0);
  });

  // 평수별 비교: 평수를 고르면 필요한 양과 기준선을 보여 준다
  document.querySelectorAll("[data-cov]").forEach(function (box) {
    var max = parseFloat(box.getAttribute("data-max"));
    var answer = box.querySelector("[data-cov-answer]");
    var rooms = box.querySelectorAll("[data-room]");
    rooms.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var r = parseFloat(btn.getAttribute("data-room"));
        rooms.forEach(function (x) { x.setAttribute("aria-pressed", String(x === btn)); });
        answer.textContent = r + "평이면 시간당 약 " + btn.getAttribute("data-need") + "mL가 필요합니다. 점선이 " + r + "평입니다.";
        box.querySelectorAll(".cov-row").forEach(function (row) {
          var ok = parseFloat(row.getAttribute("data-py")) >= r;
          row.classList.toggle("dim", !ok);
          row.querySelector("[data-cov-fit]").hidden = !ok;
          var line = row.querySelector("[data-cov-line]");
          line.hidden = false;
          line.style.left = Math.min(100, (r / max) * 100) + "%";
        });
      });
    });
  });

  var printBtn = document.querySelector("[data-print]");
  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
})();
