import csv from "csv-parser";
import { Student } from "./types";

const blobToArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
};

/**
 * Convert a Blob to a string using utf-8 or iso-8859-2 encoding
 */
const blobToString = async (blob: Blob): Promise<string> => {
  const buf = await blobToArrayBuffer(blob);
  const decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
  try {
    return decoder.decode(buf);
  } catch (e) {
    const decoder = new TextDecoder("iso-8859-2", {
      fatal: true,
      ignoreBOM: true,
    });
    return decoder.decode(buf);
  }
};

const textToStudents = (text: string): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
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
    parser.write(text);
    parser.end();
  });
};

export async function csvBlobToStudents(file: Blob): Promise<Student[]> {
  const text = await blobToString(file);
  const students = await textToStudents(text);
  return students;
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
