#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <SocketIoClient.h>

// Khai báo chân của bánh xe, A là trái, B là phải
const int AIN1 = D1;
const int AIN2 = D2;
const int BIN1 = D3;
const int BIN2 = D4;

// Khai báo tệp JSON
const int capacity = JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + 40;
StaticJsonDocument<capacity> json;

// Khai báo kết nối tới socket server
SocketIoClient socket;
const char *host = "tanthongiot.herokuapp.com";
const int port = 80;

void setup()
{
  Serial.begin(115200);

  motorInit();

  // Đổi tên và mật khẩu WiFi tại đây:
  // WiFi.begin("ten WiFi", "mat khau WiFi");
  WiFi.begin("WiFi", "...");

  // Chờ kết nối
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  // In ra địa chỉ IP
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Mỗi khi nhận được sự kiện "gui-lenh" thì gọi thủ tục xử lý "event"
  socket.on("gui-lenh", event);

  // Mỗi khi nhận được sự kiện "connect" (khi kết nối tới server)
  // thì gọi lệnh xử lý này (đăng nhập tới server)
  socket.on("connect", [](const char *payload, size_t length) {
    // Đổi mật khẩu của con ESP tại đây: (càng bảo mật càng tốt)
    socket.emit("dang-nhap", "\"xewifi\"");
  });

  // Bắt đầu kết nối tới socket server
  socket.begin(host, port);
}

void loop()
{
  // Lắng nghe sự kiện từ server
  socket.loop();
}

/* Thủ tục xử lý "event"
 * Dữ liệu gửi về sẽ có dạng JSON
 * {
 *  lenh: ...
 *  giatri: ...
 * }
 */
void event(const char *payload, size_t length)
{
  // Giải mã JSON
  deserializeJson(json, payload);

  // Lấy giá trị của "lenh" trong JSON
  String lenh = json["lenh"];

  // Nếu lệnh được gửi từ các nút lệnh thì lệnh là "guilenh"
  if (lenh == "guilenh")
  {
    String giatri = json["giatri"];

    // Xử lý giá trị lệnh tại đây
    if (giatri == "toi")
    {
      out(512, 512);
    }
    else if (giatri == "lui")
    {
      out(-512, -512);
    }
    else if (giatri == "dung")
    {
      out(0, 0);
    }
    else if (giatri == "trai")
    {
      out(0, 512);
    }
    else if (giatri == "phai")
    {
      out(512, 0);
    }

    Serial.print("Nhan duoc lenh: ");
    Serial.println(giatri);
  }

  // Nếu lệnh được gửi từ thanh trượt thì lệnh là "thanhtruot"
  else if (lenh == "thanhtruot")
  {
    int giatri = json["giatri"];

    // Xử lý giá trị thanh trượt tại đây:
    Serial.print("Gia tri thanh truot: ");
    Serial.println(giatri);
  }

  // Nếu lệnh được gửi từ touchpad thì lệnh là "joystick"
  else if (lenh == "joystick")
  {
    int x = json["giatri"]["x"];
    int y = json["giatri"]["y"];
    int tocdo = json["giatri"]["tocdo"];

    // Xử lý tọa độ x, y, tốc độ tại đây:
    // Biến tốc độ từ 0 -> 3 thành từ 0 -> 1023
    tocdo = map(tocdo, 0, 3, 0, 1023);

    if (x > 50 and x <= 100)
    {
      // rẽ phải
      out(tocdo, 0);
    }
    else if (x < -50 and x >= -100)
    {
      // rẽ trái
      out(0, tocdo);
    }
    else
    {
      if (y > 0 and y <= 100)
      {
        // Chạy tới
        out(tocdo, tocdo);
      }
      else if (y == 0)
      {
        // Đứng yên
        out(0, 0);
      }
      else
      {
        // Chạy lùi
        out(-tocdo, -tocdo);
      }
    }

    Serial.print("x = ");
    Serial.print(x);
    Serial.print(" y = ");
    Serial.print(y);
    Serial.print(" tocdo = ");
    Serial.println(tocdo);
  }
}

// Hàm điều khiển bánh trái
void outLeft(int lspeed)
{
  if (lspeed >= 0)
  {
    analogWrite(AIN1, lspeed);
    digitalWrite(AIN2, LOW);
  }
  else
  {
    digitalWrite(AIN1, LOW);
    analogWrite(AIN2, abs(lspeed));
  }
}

// Khai báo chân OUTPUT cho motor
void motorInit()
{
  pinMode(AIN1, OUTPUT);
  pinMode(AIN2, OUTPUT);
  pinMode(BIN1, OUTPUT);
  pinMode(BIN2, OUTPUT);
}

// Hàm điều khiển bánh phải
void outRight(int rspeed)
{
  if (rspeed >= 0)
  {
    analogWrite(BIN1, rspeed);
    digitalWrite(BIN2, LOW);
  }
  else
  {
    digitalWrite(BIN1, LOW);
    analogWrite(BIN2, abs(rspeed));
  }
}

// Hàm điều khiển cả hai bánh
void out(int lspeed, int rspeed)
{
  outLeft(lspeed);
  outRight(rspeed);
}
