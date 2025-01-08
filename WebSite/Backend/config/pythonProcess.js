import { fileURLToPath } from "url";
import { dirname } from "path";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

export default function faceRecognition(uid) {

  const pythonProcess = spawn("python3", [
    `${__dirname}/face-recognition/main.py`,
  ]);

  // * This runs when we start the verification of the user
  pythonProcess.stdout.on("data", (data) => {
    const name = data.toString().trim();
    if (uid === "219c7726" && name === "Manik") {
      console.log("Verified");
    } else {
      // TODO 1 Check if no face
      // TODO 2 Check if not verified
      // TODO 3 Try to catch all the errors
      console.log("Fake");
    }

    console.log(`Name of the person : ${name}`);
  });

  // ? This below is to check for errors
  pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
  });
}
