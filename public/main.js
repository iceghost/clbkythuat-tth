$(document).ready(() => {
  var socket = io();
  var joystick	= new VirtualJoystick({
  				container	: document.getElementById('touchpad'),
  				mouseSupport	: true,
	});

  setInterval(function(){
    $('#x').html(Math.trunc(joystick.deltaX()));
    $('#y').html(Math.trunc(-joystick.deltaY()));
  }, 1/30 * 1000);

  $('#speed-range').on('input change', () => {
    $('#speed').html($('#speed-range').val());
  });

  $('#servo-range').on('input change', () => {
    $('#angle').html($('#servo-range').val());
  });

  $('#btn-1').click(() => {
    text = $('#cmd-1').val();
    // socket.emit($('#'))
  })
})
