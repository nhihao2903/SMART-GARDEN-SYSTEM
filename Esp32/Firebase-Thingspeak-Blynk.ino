
#define BLYNK_PRINT Serial 
#define BLYNK_TEMPLATE_ID "TMPL61yYOuY5Y"
#define BLYNK_TEMPLATE_NAME "SMART GARDEN SYSTEM"
#define BLYNK_AUTH_TOKEN "74fCJRXdCC324PYEQHiAxeEEHFcHlaFr"


#include <WiFi.h>
#include <FirebaseESP32.h>
#include <ThingSpeak.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>
#include <BlynkSimpleEsp32.h>



// Địa chỉ I2C là 0x27, màn hình LCD 16x2
LiquidCrystal_I2C lcd(0x3F, 16, 2); 

// Thông tin Wi-Fi
const char* ssid = "HAO04";
const char* password = "123123123";

// Khai báo kênh và API key của ThingSpeak
unsigned long myChannelNumber = 2699593;
const char* myWriteAPIKey = "YS48QIIRN5J5CH5H";

// Thông tin Firebase
#define FIREBASE_HOST "smart-garden-system-6b468-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "kVgHlzbojnYq7clkwZtTbTfVJyPeeET9HvogFm1N"

// Định nghĩa cảm biến DHT22
#define DHTPIN 23         
#define DHTTYPE DHT22     
DHT dht(DHTPIN, DHTTYPE);

const int SentDataStatus = 13;
const int ButtonPin = 34;
int ButtonValue = 0;
int LastButtonValue = 0;
bool ButtonPressed = false;

int DeviceState[8] = {0};
int LastDeviceState[8] = {-1};
const int DevicePins[8] = {15, 2, 0, 4, 16, 17, 5, 18};

FirebaseConfig config;
FirebaseAuth auth;
WiFiClient client;

// Các mảng đường dẫn
FirebaseData firebaseData, firebaseData1, firebaseData2, firebaseData3, firebaseData4, firebaseData5, firebaseData6, firebaseData7, firebaseData8;
FirebaseData* firebaseDataArray[8] = {&firebaseData1, &firebaseData2, &firebaseData3, &firebaseData4, &firebaseData5, &firebaseData6, &firebaseData7, &firebaseData8};

const char* devicePaths[8] = {
  "/GardenA/Fan-1/status",
  "/GardenA/Light-A/status",
  "/GardenA/Light-B/status",
  "/GardenA/Light-C/status",
  "/He_Thong_Tuoi/May_Bom",
  "/He_Thong_Tuoi/Khu_A",
  "/He_Thong_Tuoi/Khu_B",
  "/He_Thong_Tuoi/Khu_C"
};

// Khởi tạo task handles
TaskHandle_t TaskSentData, TaskButtonHandler, TaskFirebaseUpdate;



// Hàm đọc dữ liệu cảm biến và gửi lên Firebase, ThingSpeak và Blynk
void SentDataTaskCode(void* parameter) {
  for (;;) {
    digitalWrite(SentDataStatus, HIGH);
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    
    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("Failed to read from DHT sensor!");
    }

    lcd.setCursor(6, 0);
    lcd.print(temperature);
    lcd.setCursor(6, 1);
    lcd.print(humidity);

    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.print(" %\t");
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" *C");
    
    int soilMoistureValue = random(300, 700); 
    int lightValue = random(40, 100); 
    int Volt = random(180, 230); 
    int Ampe = random(15, 30); 

    Firebase.setFloat(firebaseData, "/GardenA/Temperature/", temperature);
    Firebase.setFloat(firebaseData, "/GardenA/Humidity/", humidity);
    Firebase.setFloat(firebaseData, "/GardenA/Light/", lightValue);
    Firebase.setFloat(firebaseData, "/GardenA/Soil/", soilMoistureValue);
    Firebase.setFloat(firebaseData, "/Power/Voltage/", Volt);
    Firebase.setFloat(firebaseData, "/Power/Ampe/", Ampe);

    ThingSpeak.setField(1, temperature);
    ThingSpeak.setField(2, humidity);
    ThingSpeak.setField(3, soilMoistureValue);
    ThingSpeak.setField(4, lightValue);
    ThingSpeak.setField(5, Volt);
    ThingSpeak.setField(6, Ampe);
    ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);

    Blynk.virtualWrite(V8, temperature);
    Blynk.virtualWrite(V9, humidity);
    Blynk.virtualWrite(V10, soilMoistureValue);
    Blynk.virtualWrite(V11, lightValue);
    Blynk.virtualWrite(V12, Volt);
    Blynk.virtualWrite(V13, Ampe);

    for (int i = 0; i < 8; i++){
        Blynk.virtualWrite(V0 + i, DeviceState[i]);
        Firebase.setInt(firebaseData, devicePaths[i], DeviceState[i]);
    }

    digitalWrite(SentDataStatus, LOW);
    vTaskDelay(5000 / portTICK_PERIOD_MS); // Delay 60 giâyaz
  }
}

// Hàm xử lý nút nhấn
void ButtonHandlerTaskCode(void* parameter) {
  for (;;) {
    ButtonValue = analogRead(ButtonPin);  // Đọc giá trị điện áp từ chân analog
    // Kiểm tra xem giá trị analog có thay đổi lớn không
    if (abs(ButtonValue - LastButtonValue) > 100) {
      if (!ButtonPressed && ButtonValue > 200 && ButtonValue < 400) {
        ButtonPressed = true;
        Serial.println("Nút 1 được nhấn");
        DeviceState[0] = !DeviceState[0];
        digitalWrite(DevicePins[0], DeviceState[0] ? HIGH : LOW);  // Cập nhật trạng thái thiết bị
        Firebase.setInt(firebaseData, "/GardenA/Fan-1/status", DeviceState[0]);
      }

      if (!ButtonPressed && ButtonValue >= 400 && ButtonValue < 750) {
        ButtonPressed = true;
        Serial.println("Nút 2 được nhấn");
        DeviceState[1] = !DeviceState[1];
        digitalWrite(DevicePins[1], DeviceState[1] ? HIGH : LOW);  // Cập nhật trạng thái thiết bị
        Firebase.setInt(firebaseData, "/GardenA/Light-A/status", DeviceState[1]);
      }

      if (!ButtonPressed && ButtonValue >= 750 && ButtonValue < 1100) {
        ButtonPressed = true;
        Serial.println("Nút 3 được nhấn");
        DeviceState[2] = !DeviceState[2];
        digitalWrite(DevicePins[2], DeviceState[2] ? HIGH : LOW);  // Cập nhật trạng thái thiết bị
        Firebase.setInt(firebaseData, "/GardenA/Light-B/status", DeviceState[2]);
      }

      if (!ButtonPressed && ButtonValue >= 1100 && ButtonValue < 1500) {
        ButtonPressed = true;
        Serial.println("Nút 4 được nhấn");
        DeviceState[3] = !DeviceState[3];
        digitalWrite(DevicePins[3], DeviceState[3] ? HIGH : LOW);  // Cập nhật trạng thái thiết bị
        Firebase.setInt(firebaseData, "/GardenA/Light-C/status", DeviceState[3]);
      }

      if (!ButtonPressed && ButtonValue >= 1500 && ButtonValue < 1950) {
        ButtonPressed = true;
        Serial.println("Nút 5 được nhấn");
        DeviceState[4] = !DeviceState[4];
        digitalWrite(DevicePins[4], DeviceState[4] ? HIGH : LOW);  // Cập nhật trạng thái thiết bị
        Firebase.setInt(firebaseData, "/He_Thong_Tuoi/May_Bom", DeviceState[4]);
      }

      if (!ButtonPressed && ButtonValue >= 1950 && ButtonValue < 2500) {
        ButtonPressed = true;
        Serial.println("Nút 6 được nhấn");
        DeviceState[5] = !DeviceState[5];
        digitalWrite(DevicePins[5], DeviceState[5] ? HIGH : LOW);  // Cập nhật trạng thái thiết bị
        Firebase.setInt(firebaseData, "/He_Thong_Tuoi/Khu_A", DeviceState[5]);
      }

      if (!ButtonPressed && ButtonValue >= 2500 && ButtonValue < 3500) {
        ButtonPressed = true;
        Serial.println("Nút 7 được nhấn");
        DeviceState[6] = !DeviceState[6];
        digitalWrite(DevicePins[6], DeviceState[6] ? HIGH : LOW);  // Cập nhật trạng thái thiết bị
        Firebase.setInt(firebaseData, "/He_Thong_Tuoi/Khu_B", DeviceState[6]);
      }

      if (!ButtonPressed && ButtonValue >= 3500) {
        ButtonPressed = true;
        Serial.println("Nút 8 được nhấn");
        DeviceState[7] = !DeviceState[7];
        digitalWrite(DevicePins[7], DeviceState[7] ? HIGH : LOW);  // Cập nhật trạng thái thiết bị
        Firebase.setInt(firebaseData, "/He_Thong_Tuoi/Khu_C", DeviceState[7]);
      }

      ButtonPressed = false;
    }
    LastButtonValue = ButtonValue;  // Cập nhật giá trị analog cuối cùng
    vTaskDelay(150 / portTICK_PERIOD_MS);
  }
}

// Hàm cập nhật trạng thái mới từ Firebase
void FirebaseUpdateTaskCode(void* parameter) {
  for (;;) {
     for (int i = 0; i < 8; i++) {
      if (Firebase.readStream(*firebaseDataArray[i])) {
        int NewDeviceState = firebaseDataArray[i]->intData();
        if (NewDeviceState != LastDeviceState[i]) {
          DeviceState[i] = NewDeviceState;
          digitalWrite(DevicePins[i], DeviceState[i] ? HIGH : LOW);  // Cập nhật trạng thái thiết bị
          Serial.printf("Device %d state updated: %d\n", i + 1, DeviceState[i]);
          LastDeviceState[i] = NewDeviceState;
          // Cập nhật trạng thái thiết bị lên Blynk 
          Blynk.virtualWrite(V0 + i, DeviceState[i]);
        }
      } else {
        Serial.print("Stream error for Device ");
        Serial.print(i + 1);
        Serial.print(": ");
        Serial.println(firebaseDataArray[i]->errorReason());
      }
    }
    vTaskDelay(500 / portTICK_PERIOD_MS);
  }
}

// Hàm thiết lập stream cho từng thiết bị
void setupStream(FirebaseData* firebaseData, const char* path) {
  if (Firebase.beginStream(*firebaseData, path)) {
    Serial.println("Stream started successfully for path: " + String(path));
  } else {
    Serial.print("Error starting stream for path: ");
    Serial.println(firebaseData->errorReason());
  }
}


void setup() {
  Serial.begin(115200);
  dht.begin();
  lcd.init(); //Khởi động LCD                    
  lcd.backlight(); //Mở đèn
  lcd.setCursor(4,0);
  lcd.print("WELCOME!");
  lcd.setCursor(2,1);
  lcd.print("SMART GARDEN");
  delay(2000);

  lcd.setCursor(0,0);
  lcd.print("CONNECTING WIFI!");

  // Kết nối Wi-Fi
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\nWiFi connected\nIP address: ");
  Serial.println(WiFi.localIP());
  lcd.setCursor(0,1);
  lcd.print(" WIFI CONNECTED ");

  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, password);

  // Cấu hình Firebase
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  ThingSpeak.begin(client);

  // Khởi tạo các chân OUTPUT cho thiết bị
  for (int i = 0; i < 8; i++) {
    pinMode(DevicePins[i], OUTPUT);
    digitalWrite(DevicePins[i], LOW); // Thiết lập mặc định là tắt
  } 

  pinMode(SentDataStatus, OUTPUT);

  // Khởi tạo các stream cho từng thiết bị sử dụng mảng `devicePaths`
  for (int i = 0; i < 8; i++) {
    setupStream(firebaseDataArray[i], devicePaths[i]);
  }

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("TEMP:");
  lcd.setCursor(12, 0);
  lcd.print((char)223);
  lcd.print("C");
  lcd.setCursor(0, 1);
  lcd.print("HUMI:       %");

  // Tạo các task và gán vào từng lõi
  xTaskCreatePinnedToCore(SentDataTaskCode, "SentDataTask", 25000, NULL, 1, &TaskSentData, 0);
  xTaskCreatePinnedToCore(ButtonHandlerTaskCode, "ButtonHandlerTask", 15000, NULL, 2, &TaskButtonHandler, 1);
  xTaskCreatePinnedToCore(FirebaseUpdateTaskCode, "FirebaseUpdateTask", 15000, NULL, 1, &TaskFirebaseUpdate, 1);
}


// Các hàm BLYNK_WRITE cho từng Virtual Pin để nhận trạng thái từ Blynk
BLYNK_WRITE(V0) { updateDeviceState(0, param.asInt()); }
BLYNK_WRITE(V1) { updateDeviceState(1, param.asInt()); }
BLYNK_WRITE(V2) { updateDeviceState(2, param.asInt()); }
BLYNK_WRITE(V3) { updateDeviceState(3, param.asInt()); }
BLYNK_WRITE(V4) { updateDeviceState(4, param.asInt()); }
BLYNK_WRITE(V5) { updateDeviceState(5, param.asInt()); }
BLYNK_WRITE(V6) { updateDeviceState(6, param.asInt()); }
BLYNK_WRITE(V7) { updateDeviceState(7, param.asInt()); }

// Hàm cập nhật trạng thái thiết bị và lưu lên Firebase
void updateDeviceState(int deviceIndex, int state) {
    DeviceState[deviceIndex] = state;
    digitalWrite(DevicePins[deviceIndex], state ? HIGH : LOW);
    Firebase.setInt(firebaseData, devicePaths[deviceIndex], state);
}

void checkBlynkConnection() {
  // Kiểm tra kết nối WiFi trước
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Mất kết nối WiFi. Đang thử kết nối lại...");
    WiFi.begin(ssid, password);
    unsigned long startAttemptTime = millis();

    // Chờ tối đa 10 giây để kết nối lại WiFi
    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {
      delay(500);
      Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\nĐã kết nối lại WiFi.");
    } else {
      Serial.println("\nKhông thể kết nối lại WiFi.");
      return;  // Nếu không kết nối được WiFi thì dừng lại
    }
  }

  // Kiểm tra kết nối Blynk
  if (!Blynk.connected()) {
    Serial.println("Mất kết nối Blynk. Đang thử kết nối lại...");
    Blynk.connect();  // Thử kết nối lại Blynk

    if (Blynk.connected()) {
      Serial.println("Đã kết nối lại Blynk.");
    } else {
      Serial.println("Không thể kết nối lại Blynk.");
    }
  }
}


void monitorTaskStack(TaskHandle_t taskHandle, const char* taskName) {
    UBaseType_t stackRemaining = uxTaskGetStackHighWaterMark(taskHandle);
    Serial.printf("Task [%s] stack remaining: %d bytes\n", taskName, stackRemaining);
}


void loop() {
    // Gọi hàm checkBlynkConnection để kiểm tra và kết nối lại nếu cần
  checkBlynkConnection();

  // monitorTaskStack(TaskSentData, "SentDataTask");
  // monitorTaskStack(TaskButtonHandler, "ButtonHandlerTask");
  // monitorTaskStack(TaskFirebaseUpdate, "FirebaseUpdateTask");


  // Chạy Blynk nếu kết nối đang hoạt động
  if (Blynk.connected()) {
    Blynk.run();
  }
  // Serial.print("Free Heap: ");
  // Serial.println(ESP.getFreeHeap());
  // Serial.print("Total Heap: ");
  // Serial.println(ESP.getHeapSize());
  // Serial.print("Flash Chip Size: ");
  // Serial.println(ESP.getFlashChipSize());
  // Serial.print("Sketch Size: ");
  // Serial.println(ESP.getSketchSize());
  // Serial.print("Free Sketch Space: ");
  // Serial.println(ESP.getFreeSketchSpace());
  delay(500);
}
