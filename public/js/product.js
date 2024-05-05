$('.carousel').carousel()



//ביטול החלקה 


function prevSlide() {
    $('.carousel').carousel('prev');
    $('.carousel').carousel('pause');
  }

  function nextSlide() {
    $('.carousel').carousel('next');
    $('.carousel').carousel('pause');
  }



