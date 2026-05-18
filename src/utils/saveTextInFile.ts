/* USED ONLY IN DEVELOPMENT */
import fs from "fs";

export const saveTextInFile = async (content: string) => {
  fs.writeFile("message.txt", content, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("File saved successfully!");
    }
  });
};
