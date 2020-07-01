import React, { useCallback } from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
  Font,
} from '@react-pdf/renderer';
import { DocumentPdf } from 'grommet-icons';
import { Student, Chapter, Selection } from 'app/types';
import { saveAs } from 'file-saver';
import { Button } from 'grommet';

Font.register({
  family: 'Roboto',
  fontWeight: 400,
  src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5Q.ttf',
});

Font.register({
  family: 'Roboto',
  fontWeight: 700,
  src: 'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAw.ttf',
});

interface DocProps {
  student: Student;
  chapters: Chapter[];
  selected: Selection[];
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Roboto',
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
    flexGrow: 0,
  },
  h1: {
    fontSize: 16,
  },
  content: {
    fontSize: 12,
  },
});

// Create Document Component
export function StudentDocument({ student, chapters, selected }: DocProps) {
  const s: string[] = [];
  chapters.forEach((chapter, chapterIndex) =>
    chapter.sentences.forEach((sentence, sentencesIndex) => {
      if (
        selected.find(
          s =>
            s.chapterIndex === chapterIndex &&
            s.sentencesIndex === sentencesIndex,
        )
      ) {
        s.push(sentence);
      }
    }),
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.h1}>
            {student.Vorname} {student.Familienname}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.content}>{s.join(' ')}</Text>
        </View>
      </Page>
    </Document>
  );
}

export function StudentPDFDownload({ student, ...rest }: DocProps) {
  const onClick = useCallback(() => {
    const instance = pdf(<StudentDocument student={student} {...rest} />);
    instance.toBlob().then(blob => {
      saveAs(
        blob,
        `${student.Klasse}_${student.Familienname}_${student.Vorname}.pdf`,
      );
    });
  }, [rest, student]);

  return (
    <Button
      primary
      onClick={onClick}
      label={'PDF erstellen'}
      icon={<DocumentPdf />}
    />
  );
}
