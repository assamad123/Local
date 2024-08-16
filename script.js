let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  dampingFactor = 0.5;

  init(paper) {
    const $paper = $(paper);

    const moveHandler = (e) => {
      let clientX, clientY;

      if (e.type === 'touchmove') { // Touch event
        clientX = e.originalEvent.touches[0].clientX;
        clientY = e.originalEvent.touches[0].clientY;
        this.velX = (clientX - this.prevMouseX) * this.dampingFactor;
        this.velY = (clientY - this.prevMouseY) * this.dampingFactor;
      } else { // Mouse event
        clientX = e.clientX;
        clientY = e.clientY;
        this.velX = clientX - this.prevMouseX;
        this.velY = clientY - this.prevMouseY;
      }

      this.mouseX = clientX;
      this.mouseY = clientY;

      const dirX = clientX - this.mouseTouchX;
      const dirY = clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        $paper.css('transform', `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`);
      }
    };

    $(document).on('mousemove touchmove', moveHandler);

    const startHandler = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      $paper.css('zIndex', highestZ);
      highestZ += 1;

      if (e.type === 'mousedown' || (e.type === 'touchstart' && e.originalEvent.touches.length > 0)) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        // Define the new target location
        const targetX = Math.random() * ($(window).width() - $paper.width());
        const targetY = Math.random() * ($(window).height() - $paper.height());

        // Animate the paper to the new location
        $paper.animate({
          transform: `translateX(${targetX}px) translateY(${targetY}px) rotateZ(${this.rotation}deg)`
        }, 1000);
      }
      if (e.type === 'contextmenu' || (e.type === 'touchstart' && e.originalEvent.touches.length === 2)) {
        this.rotating = true;
      }
    };

    $paper.on('mousedown touchstart', startHandler);

    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    $(window).on('mouseup touchend', endHandler);
  }
}

$('.paper').each(function () {
  const paper = new Paper();
  paper.init(this);
});
