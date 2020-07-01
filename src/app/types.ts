/* --- STATE --- */

export interface Student {
  id: string;
  Familienname: string;
  Geburtsdatum: string;
  Geschlecht: string;
  Klasse: string;
  Vorname: string;
  Vornamen: string;
}

export interface Chapter {
  name: string;
  sentences: string[];
}

export interface Selection {
  chapterIndex: number;
  sentencesIndex: number;
}

export interface AppState {
  chapters: Chapter[];
  students: Student[];
  active?: Student;
  selected: Selection[];
  loading: boolean;
  error?: string;
}

/* 
  If you want to use 'ContainerState' keyword everywhere in your feature folder, 
  instead of the 'HomePageState' keyword.
*/
export type ContainerState = AppState;
