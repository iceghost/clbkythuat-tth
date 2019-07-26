$(document).ready(() => {
  var socket = io();

  //
  // code của thanh trượt + nút bấm
  //

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

  //
  // code cho joystick, dung nipplejs:
  //

  var joystick = nipplejs.create({
        zone: document.getElementById('touchpad'),
        color: 'blue',
        size: 200,
  });

  var tocdo = ['đứng yên', 'chầm chậm', 'vừa vừa', 'nhanh!']
  $('#speed-range').on('input change', () => {
    $('#speed').html(tocdo[$('#speed-range').val()]);
  });

  var x, y;
  joystick.on('move', (event, nipple) => {
    // console.log(nipple.instance.frontPosition);
    x = Math.round(nipple.instance.frontPosition.x);
    y = Math.round(nipple.instance.frontPosition.y) * (-1);
  }).on('end', (event, nipple) => {
    x = 0;
    y = 0;
  }).on('move end', (event, nipple) => {
    $('#x').html(x);
    $('#y').html(y);
    socket.emit('gui-lenh', {pass: $('#pass').val(), value: {lenh: 'joystick', giatri: {x: x, y: y, tocdo: parseInt($('#speed-range').val())}}});
  });
})
