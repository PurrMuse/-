document.addEventListener('DOMContentLoaded', function() {
  var img1Box = document.querySelector('.img1Box .pic');
  var right = document.querySelector('.img1Box .rightBtn');
  var intervalMs = 8000; // 8 seconds
  var timer = null;

  function startAuto() {
    if (timer) return;
    timer = setInterval(function() {
      if (right) {
        try { right.click(); } catch (e) { /* fallback */ }
      }
    }, intervalMs);
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  if (img1Box) {
    img1Box.addEventListener('mouseenter', stopAuto);
    img1Box.addEventListener('mouseleave', startAuto);
  }

  startAuto();
});
