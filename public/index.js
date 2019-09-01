$(document).ready(() => {
  var socket = io();

  //
  // code của thanh trượt + nút bấm
  //

  function send_cmd(pass, cmd, val) {
    socket.emit('gui-lenh', {
      pass: pass,
      value: {
        lenh: cmd,
        giatri: val
      }
    });
  }

  $('#slider-range').on('input change', () => {
    $('#angle').html($('#slider-range').val());
  });

  $('#slider-range').on('change', () => {
    let value = $('#slider-range').val();
    send_cmd(password, 'thanhtruot', value);
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
    send_cmd(password, 'joystick', {
      x: x,
      y: y,
      tocdo: parseInt($('#speed-range').val())
    });
  });

  //
  // code của password
  //

  var password = "";

  setInterval(() => {
    password = $('#pass').val();
    socket.emit('tim-nguoi-than', password)
  }, 5000);

  socket.on('tim-thay', (obj) => {
    $('#status').html('online <i class="fas fa-globe"></i>').removeClass('w3-red').addClass('w3-green');
    $('#log').html(obj.log.map(mess => mess.time + ": " + mess.content).join("<br/>"));
  });

  socket.on('khong-tim-thay', () => {
    $('#status').html('offline <i class="fas fa-globe"></i>').removeClass('w3-green').addClass('w3-red');
  });

  //
  // code của nút thêm bớt
  //
  var i = 0;

  $('.add-cmd-button').click(function() {
    i += 1;

    const html = `
    <div class="w3-row" id="cmd-row-${i}">
      <div class="w3-col" style="width: auto;">
        <input type="button" value="Nút ${i}" class="w3-button w3-red w3-border w3-border-red" id="btn-${i}"/>
      </div>
      <div class="w3-rest">
        <input type="text" placeholder="Lệnh ${i}" class="w3-input w3-border" id="cmd-${i}" value="${$(this).data().cmd}"/>
      </div>
    </div>`;
    $('#cmd-box').append(html);

    const index = i;
    $(`#btn-${index}`).click(() => {
      send_cmd(password, 'guilenh', $(`#cmd-${index}`).val());
    });

  });

  $('#add-cmd').click();

  $('#remove-cmd').click(() => {
    if (i > 0) {
      $('#cmd-row-' + i).remove();
      i -= 1;
    }
  });
})