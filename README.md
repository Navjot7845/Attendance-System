# Attendance System with ESP32 Camera and NFC Module 🚀

This project is a smart attendance system using an ESP32 camera module, an NFC module V3, Arduino Uno, RFID cards, and other components. The system verifies a user's identity using RFID and face recognition and records attendance seamlessly. ✅

## Components Used 🛠️
- **ESP32 Camera Module** 📷
- **NFC Module V3** 📡
- **Arduino Uno** 🖥️
- **USB to TTL Adapter** 🔌
- **Breadboard** 🧰
- **RFID Cards** 💳

## Images of Components 📸
Here are the images of the components used in this project:

![ESP32 Camera Module](https://github.com/user-attachments/assets/1b62e063-355a-4ef4-b49f-8ab124a8dd3c)
![NFC Module V3](https://github.com/user-attachments/assets/406b92d2-f58c-4cdd-9438-2b4e13302f02)
![Arduino Uno](https://github.com/user-attachments/assets/20e33f22-ac18-406d-9d3d-06125f1eb951)
![USB to TTL Adapter](https://github.com/user-attachments/assets/49ef3d1f-a90f-4437-8aa5-66edc89331e3)

## Prerequisites ⚙️
To use this project, ensure you have the following installed and configured:

1. **Node.js** 🟢
2. **Arduino IDE** 🛠️
   - Install the ESP32 package using the following JSON URL in Arduino IDE:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
3. **PostgreSQL** 🐘
4. **Gmail App Password** 🔑
   - Generate an app password from the 2FA settings in your Gmail account.

## Features ✨
1. **RFID Card Tapping**:
   - When a user taps an RFID card on the NFC module, the ESP32 camera module reads the data sent by the Arduino Uno.
2. **Server Communication**:
   - The ESP32 sends an HTTP POST request to a server running on the local IP address `192.168.1.xxx:3000`.
   - The request includes the UID of the tapped card.
3. **Database Query**:
   - The server retrieves the user's details (e.g., name) from the PostgreSQL database using the card's UID.
4. **Face Recognition**:
   - The system verifies the user's identity by matching their face captured by the ESP32 camera with stored images. 🤖
5. **Email Notification**:
   - Upon successful verification, the system sends an email notification to the user confirming their attendance. 📧

## Setup Instructions 🛠️

### 1. Configure the ESP32 Camera Module 📷
- While uploading data to the ESP32 camera module, provide the SSID and password of your WiFi network.
- Example code snippet for `main.py`:
  ```python
  cap = cv2.VideoCapture("http://192.168.1.104:81/stream")
  ```
  Replace `192.168.1.104` with the IP address of your ESP32 camera module.

### 2. Register UIDs 💳
- Note down the UIDs of the RFID cards.
- Register these UIDs with user details in the PostgreSQL database.

### 3. Prepare the Face Recognition Folder 📂
- Navigate to `/Website/Backend/face-config/face-recognition`.
- Create a folder named `images`.
- Store the images of users in this folder. Ensure the image filenames match the names stored in the database.

### 4. Configure Email Settings 📧
- Update the Gmail app password in the server's email configuration.
- Ensure that the server is set up to send emails upon successful verification.

### 5. Run the System ▶️
- Start the server on port `3000`.
- Ensure the ESP32 camera module and the NFC module are correctly connected and functional.
- Test the system by tapping an RFID card and verifying face recognition. ✅

## File Structure 📁
```
/Website
  /Backend
    /face-config
      /face-recognition
        main.py
        /images
```

## Notes 📝
- Replace the IP address in `main.py` (`cap = cv2.VideoCapture`) with the actual IP address of your ESP32 camera module.
- Ensure your ESP32 and server are on the same network for seamless communication.
- Images in the `images` folder should be clear and match the users registered in the database.
- Verify that email notifications are correctly configured and tested.

## Contribution 🤝
Feel free to contribute to the project by submitting issues or pull requests.

## License 📜
This project is licensed under the [MIT License](LICENSE).