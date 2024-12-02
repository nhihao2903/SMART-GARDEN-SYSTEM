// Sử lý chọn của thanh NavBar
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.sidebar a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Nút nhấn ẩn thanh NavBar
function toggleNav() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('main-content');
    sidebar.classList.toggle('collapsed');
    content.classList.toggle('collapsed');
}


// Thêm sự kiện khi tài liệu đã được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    // Ẩn tất cả các phần ban đầu
    document.querySelectorAll('.navbar').forEach(section => {
        section.style.display = 'none';
    });

    // Hiển thị phần Home mặc định
    const homeSection = document.getElementById('Home');
    homeSection.style.display = 'block';
    homeSection.classList.add('show');
});

// Thêm sự kiện cho các liên kết điều hướng
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
        const targetId = this.getAttribute('data-target'); // Lấy ID của phần cần hiển thị
        // Ẩn tất cả các phần
        document.querySelectorAll('.navbar').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('show');
        });
        // Hiển thị phần được chọn
        const targetSection = document.getElementById(targetId);
        targetSection.style.display = 'block';
        setTimeout(() => {
            targetSection.classList.add('show');
        }, 10); // Thêm một chút độ trễ để đảm bảo chuyển đổi hoạt động
    });
});






//Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAP32IhkHv3b61GgsKF-5WU_7td576j100",
    authDomain: "smart-garden-system-6b468.firebaseapp.com",
    databaseURL: "https://smart-garden-system-6b468-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smart-garden-system-6b468",
    storageBucket: "smart-garden-system-6b468.appspot.com",
    messagingSenderId: "60112766198",
    appId: "1:60112766198:web:a050921dfd50ed3d4858d7",
    measurementId: "G-5D8JB02RX0"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();



// Auto load Temperature
function setupTemperature(ValueId, imgId, firebasePath) {
    database.ref(firebasePath).child('Temperature').on("value", function (snapshot) {
        var Temperature = snapshot.val();
        document.getElementById(ValueId).innerHTML = Temperature;
        if (Temperature < 20) {
            document.getElementById(imgId).src = 'img/temperature-low.png';
        } else if (Temperature < 30) {
            document.getElementById(imgId).src = 'img/temperature-normal.png';
        } else {
            document.getElementById(imgId).src = 'img/temperature-high.png';
        }

    });
}


// Auto load Humidity
function setupHumidity(ValueId, imgId, firebasePath) {
    database.ref(firebasePath).child('Humidity').on("value", function (snapshot) {
        var Humidity = snapshot.val();
        document.getElementById(ValueId).innerHTML = Humidity;
        if (Humidity < 40) {
            document.getElementById(imgId).src = 'img/humidity-low.png';
        } else if (Humidity < 60) {
            document.getElementById(imgId).src = 'img/humidity-normal.png';
        } else {
            document.getElementById(imgId).src = 'img/humidity-high.png';
        }
    });
}

// Auto load Soil Moisture
function setupSoil(ValueId, imgId, firebasePath) {
    database.ref(firebasePath).child('Soil').on("value", function (snapshot) {
        var Soil = snapshot.val();
        document.getElementById(ValueId).innerHTML = Soil;
        if (Soil < 50) {
            document.getElementById(imgId).src = 'img/plant_wilt.png';
        } else {
            document.getElementById(imgId).src = 'img/plant_good.png';
        }
    });
}

// Auto load Light Sensor
function setupLight(ValueId, imgId, firebasePath) {
    database.ref(firebasePath).child('Light').on("value", function (snapshot) {
        var Light = snapshot.val();
        document.getElementById(ValueId).innerHTML = Light;
        if (Light < 50) {
            document.getElementById(imgId).src = 'img/dark.png';
        } else {
            document.getElementById(imgId).src = 'img/bright.png';
        }
    });
}


// Auto load Voltage
database.ref("/Power/Voltage").on("value", function (snapshot) { var volt = snapshot.val();
    gauge_Voltage.value = volt
});

// Auto load Voltage
database.ref("/Power/Ampe").on("value", function (snapshot) { var ampe = snapshot.val();
    gauge_Ampe.value = ampe
});
    
    
// Khởi tạo AC Volt Sensor
var gauge_Voltage = new RadialGauge({
    renderTo: 'gauge-voltage',
    width: 270,
    height: 270,
    units: "Voltage",
    minValue: 0,
    maxValue: 440,
    majorTicks: [
        "0","40","80","120","160","200","240","280","320","360","400","440"
    ],
    minorTicks: 4,
    strokeTicks: true,
    highlights: [
        { from: 0, to: 180, color: 'rgba(255, 0, 0, .3)' },
        { from: 180, to: 240, color: 'rgba(0, 255, 0, .3)' },
        { from: 240, to: 440, color: 'rgba(255, 255, 0, .3)' }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 1,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 500,
    animationRule: "linear"
}).draw();


// Khởi tạo AC Current Transformer Sensor
var gauge_Ampe = new RadialGauge({
    renderTo: 'gauge-ampe',
    width: 270,
    height: 270,
    units: "Ampe",
    minValue: 0,
    maxValue: 100,
    majorTicks: [
        "0","10","20","30","40","50","60","70","80","90","100"
    ],
    minorTicks: 4,
    strokeTicks: true,
    highlights: [
        { from: 0, to: 15, color: 'rgba(0, 255, 0, .3)' },
        { from: 15, to: 60, color: 'rgba(255, 255, 0, .3)' },
        { from: 60, to: 100, color: 'rgba(255, 0, 0, .3)' }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 1,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 500,
    animationRule: "linear"
}).draw();








// Setting
// Box Devices With Auto 
//initializeAutoControl(Nút auto, Box nhập ngưỡng vào, Nút nhấn bật thiết bị, Ảnh on, Ảnh off, Trạng thái, Box nhập thời gian autoOff, Link firebase của Khu vực, link giá trị cảm biến, biểu thức so sánh)
function initializeAutoControl(autoSwitchId, thresholdInputId, deviceSwitchId, imageOnId, imageOffId, statusId, autoOffTimer, firebasePath, sensorPath, comparisonOperator) {
    // Lấy các phần tử từ giao diện dựa trên ID của chúng
    var autoSwitch = document.getElementById(autoSwitchId); // Checkbox để bật/tắt chế độ tự động
    var thresholdInput = document.getElementById(thresholdInputId); // Input để nhập giá trị ngưỡng cảm biến
    var deviceSwitch = document.getElementById(deviceSwitchId); // Nút nhấn để điều khiển thiết bị (bật/tắt thủ công)
    var deviceStatus = document.getElementById(statusId); // Phần tử hiển thị trạng thái thiết bị (On/Off)
    var autoOffTimerInput = document.getElementById(autoOffTimer); // Input để nhập thời gian tự động tắt thiết bị
    var imageOn = document.getElementById(imageOnId); // Hình ảnh khi thiết bị đang bật
    var imageOff = document.getElementById(imageOffId); // Hình ảnh khi thiết bị đang tắt

    // Tham chiếu đến Firebase để lưu trạng thái Auto Switch
    var autoSwitchRef = database.ref(firebasePath + '/auto');
    // Lắng nghe sự thay đổi của autoSwitch từ Firebase và cập nhật giao diện
    autoSwitchRef.on('value', function (snapshot) {
        var state = snapshot.val(); // Lấy trạng thái auto từ Firebase
        autoSwitch.checked = state === 1; // Bật/tắt autoSwitch dựa trên giá trị Firebase
        deviceSwitch.disabled = state === 1; // Vô hiệu hóa nút điều khiển thiết bị nếu autoSwitch đang bật
        // Thay đổi độ trong suốt của deviceSwitch khi autoSwitch bật/tắt
        if (state === 1) {
            deviceSwitch.style.opacity = '0.4'; // Làm mờ deviceSwitch
        } else {
            deviceSwitch.style.opacity = '1'; // Trả lại độ trong suốt bình thường khi autoSwitch tắt
        }
    });

    // Tham chiếu đến Firebase để lưu giá trị ngưỡng (threshold)
    var thresholdRef = database.ref(firebasePath + '/threshold');
    // Lắng nghe thay đổi của ngưỡng từ Firebase và cập nhật trên giao diện
    thresholdRef.on('value', function (snapshot) {
        var threshold = snapshot.val(); // Lấy giá trị ngưỡng từ Firebase
        thresholdInput.value = threshold; // Cập nhật ngưỡng từ Firebase lên giao diện
        checkAndUpdateDeviceStatus(); // Kiểm tra và cập nhật trạng thái thiết bị dựa trên ngưỡng
    });

    // Tham chiếu đến Firebase để lưu trạng thái thiết bị
    var statusRef = database.ref(firebasePath + '/status');
    // Lắng nghe thay đổi trạng thái thiết bị từ Firebase và cập nhật giao diện
    statusRef.on('value', function (snapshot) {
        var status = snapshot.val(); // Lấy trạng thái thiết bị (bật/tắt) từ Firebase
        deviceStatus.textContent = status ? 'On' : 'Off'; // Hiển thị trạng thái (On/Off) của thiết bị
        deviceSwitch.checked = status === 1; // Đồng bộ trạng thái nút chuyển của thiết bị với Firebase
        updateDeviceState(status); // Cập nhật hình ảnh và giao diện theo trạng thái thiết bị
    });

    // Tham chiếu đến Firebase để lưu giá trị cảm biến
    var sensorRef = database.ref(sensorPath);
    // Lắng nghe thay đổi của cảm biến và kiểm tra trạng thái thiết bị
    sensorRef.on('value', function () {
        checkAndUpdateDeviceStatus(); // Kiểm tra và cập nhật trạng thái thiết bị dựa trên giá trị cảm biến
    });

    // Lắng nghe sự thay đổi của autoSwitch từ người dùng và cập nhật Firebase
    autoSwitch.addEventListener('change', function () {
        var newState = autoSwitch.checked ? 1 : 0; // Nếu autoSwitch bật, đặt giá trị thành 1, ngược lại là 0
        autoSwitchRef.set(newState); // Lưu trạng thái autoSwitch vào Firebase
        deviceSwitch.disabled = newState === 1; // Vô hiệu hóa điều khiển thiết bị khi autoSwitch bật

        // Thay đổi độ trong suốt của deviceSwitch khi autoSwitch bật/tắt
        if (newState === 1) {
            deviceSwitch.style.opacity = '0.4'; // Làm mờ deviceSwitch
            checkAndUpdateDeviceStatus()
        } else {
            deviceSwitch.style.opacity = '1'; // Trả lại độ trong suốt bình thường khi autoSwitch tắt
            statusRef.set(0); 
        }
    });

    // Lắng nghe sự thay đổi của ngưỡng từ người dùng và cập nhật Firebase
    thresholdInput.addEventListener('input', function () {
        var newThreshold = thresholdInput.value; // Lấy giá trị mới của ngưỡng từ input
        thresholdRef.set(newThreshold); // Lưu giá trị ngưỡng mới vào Firebase
    });

    // Thêm sự kiện click cho nút điều khiển thiết bị
    deviceSwitch.addEventListener('click', function () {
        firebase.database().ref(firebasePath + '/status').once('value').then(function (snapshot) {
            var currentState = snapshot.val(); // Lấy trạng thái hiện tại của thiết bị
            var newState = (currentState === 0) ? 1 : 0; // Chuyển đổi trạng thái (bật nếu đang tắt và ngược lại)
            firebase.database().ref(firebasePath + '/status').set(newState); // Cập nhật trạng thái thiết bị lên Firebase
            updateDeviceState(newState); // Cập nhật giao diện và hình ảnh theo trạng thái mới
        });
    });

    // Tham chiếu đến Firebase để lưu giá trị thời gian tự động tắt
    var autoOffTimerRef = database.ref(firebasePath + '/autoOffTimer');
    // Lắng nghe sự thay đổi của giá trị thời gian tự động tắt từ Firebase và cập nhật giao diện
    autoOffTimerRef.on('value', function (snapshot) {
        var autoOffMinutes = snapshot.val(); // Lấy giá trị thời gian tự động tắt từ Firebase
        if (autoOffMinutes && !isNaN(autoOffMinutes)) {
            autoOffTimerInput.value = autoOffMinutes; // Cập nhật thời gian tắt tự động từ Firebase lên giao diện
        }
    });

    // Lắng nghe sự thay đổi của giá trị thời gian tự động tắt từ người dùng và cập nhật Firebase
    autoOffTimerInput.addEventListener('input', function () {
        var autoOffMinutes = parseInt(autoOffTimerInput.value); // Lấy giá trị thời gian từ input
        if (!isNaN(autoOffMinutes) && autoOffMinutes > 0) {
            autoOffTimerRef.set(autoOffMinutes); // Lưu giá trị thời gian tự động tắt mới vào Firebase
        }
    });

    

    // Function to compare sensor values with the threshold using the dynamic operator
    function compareValues(sensorValue, thresholdValue, operator) {
        switch (operator) {
            case '<':
                return sensorValue < thresholdValue;
            case '>':
                return sensorValue > thresholdValue;
            case '=':
                return sensorValue === thresholdValue;
            default:
                throw new Error("Invalid operator. Use '<', '>', or '='.");
        }
    }

    var isWaitingForAutoOff = false; // Biến theo dõi trạng thái chờ tắt thiết bị
var autoOffTimeout; // Biến lưu lại bộ đếm thời gian chờ tự động tắt

// Hàm kiểm tra và cập nhật trạng thái thiết bị
function checkAndUpdateDeviceStatus() {
    var currentThreshold = parseFloat(thresholdInput.value);

    sensorRef.on('value', function (snapshot) {
        var sensorValue = snapshot.val();

        // Nếu autoSwitch đang bật và không ở trạng thái chờ tắt
        if (autoSwitch.checked && !isWaitingForAutoOff) {
            // Sử dụng toán tử so sánh động
            if (compareValues(sensorValue, currentThreshold, comparisonOperator)) {
                statusRef.set(1); // Bật thiết bị

                autoOffTimerRef.once('value', function (snapshot) {
                    var autoOffMinutes = snapshot.val();

                    if (autoOffMinutes && autoOffMinutes > 0) {
                        isWaitingForAutoOff = true; // Đánh dấu trạng thái đang chờ tắt

                        // Lưu lại bộ đếm thời gian chờ tự động tắt
                        autoOffTimeout = setTimeout(function autoOffCountdown() {
                            sensorRef.once('value', function (snapshot) {
                                var sensorValue = snapshot.val();
                                var currentThreshold = parseFloat(thresholdInput.value);

                                // Kiểm tra lại điều kiện ngưỡng
                                if (compareValues(sensorValue, currentThreshold, comparisonOperator)) {
                                    // Điều kiện ngưỡng vẫn đúng -> thiết bị vẫn bật và lặp lại thời gian tắt
                                    clearTimeout(autoOffTimeout); // Hủy đếm thời gian cũ
                                    autoOffTimeout = setTimeout(autoOffCountdown, autoOffMinutes * 60000);
                                } else {
                                    // Điều kiện ngưỡng sai -> tắt thiết bị
                                    statusRef.set(0); // Tắt thiết bị
                                    isWaitingForAutoOff = false; // Đánh dấu trạng thái không còn chờ tắt
                                }
                            });
                        }, autoOffMinutes * 60000);
                    }
                });
            } else {
                statusRef.set(0); // Điều kiện ngưỡng sai, tắt thiết bị
            }
        } else if (!autoSwitch.checked) {
            // Nếu autoSwitch bị tắt -> tắt thiết bị và dừng mọi quá trình
            clearTimeout(autoOffTimeout); // Hủy đếm thời gian tắt nếu có
            // statusRef.set(0); // Tắt thiết bị
            isWaitingForAutoOff = false; // Đánh dấu trạng thái không còn chờ tắt
        }
    });
}

    

    // Hàm cập nhật trạng thái thiết bị và giao diện
    function updateDeviceState(state) {
        if (state === 0) {
            deviceSwitch.textContent = 'OFF'; // Cập nhật nút điều khiển thiết bị thành 'Tắt'
            imageOff.style.display = 'block'; // Hiển thị hình ảnh thiết bị tắt
            imageOn.style.display = 'none'; // Ẩn hình ảnh thiết bị bật
            deviceSwitch.classList.remove('active'); // Xóa class 'active' để thể hiện trạng thái tắt
        } else {
            deviceSwitch.textContent = 'ON'; // Cập nhật nút điều khiển thiết bị thành 'Bật'
            imageOff.style.display = 'none'; // Ẩn hình ảnh thiết bị tắt
            imageOn.style.display = 'block'; // Hiển thị hình ảnh thiết bị bật
            deviceSwitch.classList.add('active'); // Thêm class 'active' để thể hiện trạng thái bật
        }
    }

    // Khi autoSwitch thay đổi, tắt chế độ chờ tắt nếu autoSwitch tắt
    autoSwitch.addEventListener('change', function () {
        if (!autoSwitch.checked) {
            isWaitingForAutoOff = false; // Đặt lại trạng thái chờ tắt nếu autoSwitch tắt
        }
    });
}

// Khi trang được tải xong, khởi tạo các auto controls
document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo điều khiển tự động cho thiết bị đầu tiên
    // initializeAutoControl(Nút auto, Box nhập ngưỡng vào, Nút nhấn bật thiết bị, Ảnh on, Ảnh off, Trạng thái, Box nhập thời gian autoOff, Link firebase của Khu vực, link giá trị cảm biến, So sánh sensorValue với thresholdValue )
    initializeAutoControl('GA-AS-1', 'GA-T-1', 'GA-BTN-1', 'GA-ON-1', 'GA-OFF-1', 'GA-S-1', 'GA-AO-1', 'GardenA/Fan-1', 'GardenA/Temperature', '>' );
    initializeAutoControl('GA-AS-2', 'GA-T-2', 'GA-BTN-2', 'GA-ON-2', 'GA-OFF-2', 'GA-S-2', 'GA-AO-2', 'GardenA/Light-A', 'GardenA/Light', '<' );
    initializeAutoControl('GA-AS-3', 'GA-T-3', 'GA-BTN-3', 'GA-ON-3', 'GA-OFF-3', 'GA-S-3', 'GA-AO-3', 'GardenA/Light-B', 'GardenA/Light', '<' );
    initializeAutoControl('GA-AS-4', 'GA-T-4', 'GA-BTN-4', 'GA-ON-4', 'GA-OFF-4', 'GA-S-4', 'GA-AO-4', 'GardenA/Light-C', 'GardenA/Light', '<' );
});






// Box Devices Not Auto
// Hàm cập nhật trạng thái thiết bị
function updateDeviceState(button, imageOn, imageOff, state) {
    if (state === 0) {
        button.textContent = 'OFF'; // Nút tắt
        imageOff.style.display = 'block'; // Hiện hình ảnh tắt
        imageOn.style.display = 'none'; // Ẩn hình ảnh bật
        button.classList.remove('active');
    } else {
        button.textContent = 'ON'; // Nút bật
        imageOff.style.display = 'none'; // Ẩn hình ảnh tắt
        imageOn.style.display = 'block'; // Hiện hình ảnh bật
        button.classList.add('active');
    }
}


// Hàm xử lý sự kiện click cho nút thiết bị
function setupButton(buttonId, imageOnId, imageOffId, firebasePath, stateRef) {
    const button = document.getElementById(buttonId);
    const imageOn = document.getElementById(imageOnId);
    const imageOff = document.getElementById(imageOffId);

    // Lắng nghe trạng thái nút
    firebase.database().ref(firebasePath).child(stateRef).on('value', function (snapshot) {
        const state = snapshot.val();
        updateDeviceState(button, imageOn, imageOff, state);
    });

    // Thêm sự kiện click cho nút
    button.addEventListener('click', function () {
        firebase.database().ref(firebasePath).child(stateRef).once('value').then(function (snapshot) {
            const currentState = snapshot.val();
            const newState = (currentState === 0) ? 1 : 0; // Chuyển đổi trạng thái
            firebase.database().ref(firebasePath).child(stateRef).set(newState);
        });
    });
}

//Hàm hiện 
function showChart(chartNumber, ChartId) {
    const iframe = document.getElementById(ChartId);
    const chartURLs = {
        1: "https://thingspeak.com/channels/2699593/charts/1?bgcolor=%23fff&color=%23d62020&dynamic=true&results=20&title=Temperature-GA&type=line",
        2: "https://thingspeak.com/channels/2699593/charts/2?bgcolor=%23ffffff&color=0D92F4&dynamic=true&results=20&title=Humidity-GA&type=line",
        3: "https://thingspeak.com/channels/2699593/charts/3?bgcolor=%23ffffff&color=705C53&dynamic=true&results=20&title=SoilMoisture-GA&type=line",
        4: "https://thingspeak.com/channels/2699593/charts/4?bgcolor=%23ffffff&color=F3C623&dynamic=true&results=20&title=LightSensor-GA&type=line",
        5: "https://thingspeak.com/channels/2699593/charts/5?bgcolor=%23ffffff&color=00FF9C&dynamic=true&results=20&title=Voltage-Power&type=line",
        6: "https://thingspeak.com/channels/2699593/charts/6?bgcolor=%23ffffff&color=FF6500&dynamic=true&results=20&title=Ampe-Power&type=line"
    };
    iframe.src = chartURLs[chartNumber];
}


// Cài đặt cho từng thiết bị
// setupButton(id Nút nhấn, Id ảnh on, Id ảnh off, Link tổng, Nhánh con - Tên thiết bi )
setupButton('I-BTN-1', 'I-ON-1', 'I-OFF-1', 'He_Thong_Tuoi', 'May_Bom');
setupButton('I-BTN-2', 'I-ON-2', 'I-OFF-2', 'He_Thong_Tuoi', 'Khu_A');
setupButton('I-BTN-3', 'I-ON-3', 'I-OFF-3', 'He_Thong_Tuoi', 'Khu_B');
setupButton('I-BTN-4', 'I-ON-4', 'I-OFF-4', 'He_Thong_Tuoi', 'Khu_C');

// setupTemperature(IdValue , Id ảnh, link firebase)
setupTemperature('GA-Temp-1', 'GA-Temp-img-1', 'GardenA')



// setupHumidity(IdValue , Id ảnh, link firebase)
setupHumidity('GA-Humi-1', 'GA-Humi-img-1', 'GardenA')




// setupSoil(IdValue , Id ảnh, link firebase)
setupSoil('GA-Soil-1', 'GA-Soil-img-1', 'GardenA')




// setupLight(IdValue , Id ảnh, link firebase)
setupLight('GA-Light-1', 'GA-Light-img-1', 'GardenA')




