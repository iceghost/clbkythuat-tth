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

  $('#speed-range').on('change', () => {
    let value = $('#speed-range').val();
    socket.emit('gui-lenh', {pass: $('#pass').val(), value: {lenh: 'tocdo', giatri: value}});
  });

  $('#slider-range').on('input change', () => {
    $('#angle').html($('#slider-range').val());
  });

  $('#slider-range').on('change', () => {
    let value = $('#slider-range').val();
    socket.emit('gui-lenh', {pass: $('#pass').val(), value: {lenh: 'thanhtruot', giatri: value}});
  });

  $('#btn-1').click(() => {
    let text = $('#cmd-1').val();
    socket.emit('gui-lenh', {pass: $('#pass').val(), value: {lenh: 'guilenh', giatri: text}});
  });

  $('#btn-2').click(() => {
    let text = $('#cmd-2').val();
    socket.emit('gui-lenh', {pass: $('#pass').val(), value: {lenh: 'guilenh', giatri: text}});
  });

  $('#btn-3').click(() => {
    let text = $('#cmd-3').val();
    socket.emit('gui-lenh', {pass: $('#pass').val(), value: {lenh: 'guilenh', giatri: text}});
  });

  $('#btn-4').click(() => {
    let text = $('#cmd-4').val();
    socket.emit('gui-lenh', {pass: $('#pass').val(), value: {lenh: 'guilenh', giatri: text}});
  });
})
