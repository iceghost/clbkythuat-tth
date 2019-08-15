$(document).ready(() => {
  var socket = io();

  function send_cmd(pass, cmd, val) {
    socket.emit('gui-lenh', {
      pass: pass,
      value: {
        lenh: cmd,
        giatri: val
      }
    });
  }

  // code password
  var password = "";
  setInterval(() => {
    password = $('#pass').val();
    socket.emit('tim-nguoi-than', password);
  }, 5000);

  socket.on('tim-thay', () => {
    $('#status').html('Online <i class="fas fa-globe w3-text-blue"></i>')
  });

  socket.on('khong-tim-thay', () => {
    $('#status').html('Offline <i class="fas fa-globe w3-text-red"></i>')
  });

  if (annyang) {
    // Let's define a command.
    // var commands = {
    //     '*words': (words) => { $('#command').append('<p>' + words + '</p>') }
    // };

    annyang.setLanguage("vi-VN");
    annyang.debug();

    // Add our commands to annyang
    function add_commands() {

      var commands = {};
      for (var j = 1; j <= i; j++) {
        if ($(`#voice-${j}`).val()) {
          const index = j;
          commands[$(`#voice-${index}`).val()] = () => {
            send_cmd(password, 'guilenh', $(`#cmd-${index}`).val());
          }
        }
      }

      annyang.removeCommands();
      annyang.addCommands(commands);
    }

    annyang.addCallback('resultNoMatch', (phrases) => {
      $('#result').html(`Không hợp lệ (hình như bạn nói <span class="w3-red">${phrases.join(', ')}</span>)`)
    });
    annyang.addCallback('resultMatch', (user_said, command_text, phrases) => {
      $('#result').html(`Nhận được lệnh <span class="w3-green">${user_said}</span>`)
    });

    annyang.start();


  }

  //
  // code của nút thêm bớt
  //
  var i = 0;

  $('#add-cmd').click(() => {
    i += 1;

    const html = `
  <div class="w3-row" id="cmd-row-${i}">
    <div class="w3-col" style="width: auto">
      <input type="button" value="Gửi" class="w3-button w3-red" id="btn-${i}" />
    </div>
    <div class="w3-rest w3-row">
        <div class="w3-col l6 m6 s6">
            <input type="text" placeholder="Lệnh gửi ${i}" class="w3-input w3-border" id="cmd-${i}" />
        </div>
        <div class="w3-col l6 m6 s6">
            <input type="text" placeholder="Lệnh nói ${i}" class="w3-input w3-border" id="voice-${i}" />
        </div>
    </div>
  </div>`;
    $('#cmd-box').append(html);

    const index = i;
    $(`#btn-${index}`).click(() => {
      send_cmd(password, 'guilenh', $(`#cmd-${index}`).val());
    });
    $(`#voice-${index}`).focusout(add_commands);

  }).click();

  $('#remove-cmd').click(() => {
    if (i > 0) {
      if (annyang) annyang.removeCommands($('#voice-' + i).val());
      $('#cmd-row-' + i).remove();
      i -= 1;
    }
  });
});
