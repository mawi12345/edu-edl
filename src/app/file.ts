import csv from "csv-parser";
import { Student } from "./types";

export function csvBlobToStudents(file: Blob): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onabort = () => reject(new Error("file reading was aborted"));
    reader.onerror = () => reject(new Error("file reading has failed"));
    reader.onload = () => {
      const parser = csv({ separator: ";" });
      const results: Student[] = [];
      parser.on("data", (data: Student) =>
        results.push({
          ...data,
          id: `${data.Klasse}-${data.Familienname}-${data.Vorname}-${data.Geburtsdatum}`,
        })
      );
      parser.on("end", () => {
        resolve(results);
      });
      parser.write(reader.result);
      parser.end();
    };
    reader.readAsText(file);
  });
}

export function isFileSupported(students: Student[]): boolean {
  const first: Student = students[0];
  return (
    first.Vorname !== undefined &&
    first.Klasse !== undefined &&
    first.Familienname !== undefined &&
    first.Geburtsdatum !== undefined
  );
}
