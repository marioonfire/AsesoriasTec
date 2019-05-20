$('.getInforUser').click(function(e) {
    e.preventDefault();
    var id = $(this).attr('data-id');
     console.log(id)
  $.ajax({
    url: '/user/' + id,
    method: 'GET',
  }).done(function(res) {
    if (res.success) {
      console.log(res.response);
    } else {
      console.log('error...ajax');
    }
  });
});