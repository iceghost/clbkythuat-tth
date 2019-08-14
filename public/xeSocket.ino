#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <SocketIoClient.h>

#define AIN1 D5
#define AIN2 D6
#define BIN1 D7
#define BIN2 D8

SocketIoClient socket;

const int capacity = JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + 40;
StaticJsonDocument<capacity> json;

const char * host = "clbkythuattanthonghoi.herokuapp.com";
const int port = 80;


void setup() {
  Serial.begin(115200);

  // Đổi tên và mật khẩu WiFi tại đây:
  WiFi.begin("Vi_Tinh 02", "thpttth_2019");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  socket.on("gui-lenh", event);

  socket.on("connect", [](const char * payload, size_t length) {
    // Đổi mật khẩu của con ESP tại đây: (càng bảo mật càng tốt)
    socket.emit("dang-nhap", "\"25092015\"");
  });
  socket.begin(host, port);
}


void loop() {
  socket.loop();
}


void event(const char * payload, size_t length) {
  deserializeJson(json, payload);
  String lenh = json["lenh"];

  if (lenh == "guilenh") {
    String giatri = json["giatri"];

    if (giatri == "toi"){
      analogWrite(AIN1, 512);
      digitalWrite(AIN2, LOW);
      analogWrite(BIN1, 512);
      digitalWrite(BIN2, LOW);
    }
    else if (giatri == "lui"){
      analogWrite(AIN2, 512);
      digitalWrite(AIN1, LOW);
      analogWrite(BIN2, 512);
      digitalWrite(BIN1, LOW);
    }
    else if (giatri == "dung"){
      analogWrite(AIN1, 0);
      digitalWrite(AIN2, LOW);
      analogWrite(BIN1, 0);
      digitalWrite(BIN2, LOW);
    }

    // Xử lý nút gửi lệnh tại đây:
    Serial.print("Nhan duoc lenh: ");
    Serial.println(giatri);
  }

  else if (lenh == "thanhtruot") {
    int giatri = json["giatri"];

    // Xử lý giá trị thanh trượt tại đây:
    Serial.print("Gia tri thanh truot: ");
    Serial.println(giatri);
  }

  else if (lenh == "joystick") {
    int x = json["giatri"]["x"];
    int y = json["giatri"]["y"];
    int tocdo = json["giatri"]["tocdo"];

    // Xử lý tọa độ x, y, tốc độ tại đây:
    //    Serial.print("x = ");
    //    Serial.print(x);
    //    Serial.print(" y = ");
    //    Serial.print(y);
    //    Serial.print(" tocdo = ");
    //    Serial.println(tocdo);

    tocdo = map(tocdo, 0, 3, 0, 1023);

    if (y > 0 and y <= 100) {
      analogWrite(AIN1, tocdo);
      digitalWrite(AIN2, LOW);
      analogWrite(BIN1, tocdo);
      digitalWrite(BIN2, LOW);
    }
    else if (y == 0)  {
      digitalWrite(AIN1, LOW);
      digitalWrite(AIN2, LOW);
      digitalWrite(BIN1, LOW);
      digitalWrite(BIN2, LOW);
    }
    else {
      digitalWrite(AIN1, LOW);
      analogWrite(AIN2, tocdo);
      digitalWrite(BIN1, LOW);
      analogWrite(BIN2, tocdo);
    }
    if (x > 20 and x <= 100) {
      digitalWrite(AIN1, LOW);
      digitalWrite(AIN2, LOW);
    }
    else if (x < -20 and x >= -100) {
      digitalWrite(BIN1, LOW);
      digitalWrite(BIN2, LOW);
    }
  }
}
