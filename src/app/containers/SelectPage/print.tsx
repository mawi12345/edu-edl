import React, { useCallback } from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
  Font,
  Image,
} from '@react-pdf/renderer';
import { DocumentPdf } from 'grommet-icons';
import { Student, Chapter, Selection } from 'app/types';
import { saveAs } from 'file-saver';
import { Button } from 'grommet';
import { School } from 'app/school';
import { format } from 'date-fns';
import de from 'date-fns/locale/de';
import { gender } from '../../selectors';

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

// disable hyphenation
Font.registerHyphenationCallback(word => [word]);

interface DocProps {
  student: Student;
  chapters: Chapter[];
  selected: Selection[];
  date: string;
  school: School;
  customText?: string;
  onDone: () => void;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Roboto',
  },
  year: {
    position: 'absolute',
    right: 40,
    left: 300,
    top: 160,
    fontSize: 12,
    textAlign: 'right',
  },
  h1: {
    marginTop: 20,
    marginBottom: 20,
    flexGrow: 0,
    textAlign: 'center',
    fontSize: 20,
  },
  h2: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    flexGrow: 0,
    fontSize: 16,
  },
  intro: {
    marginTop: 10,
    marginBottom: 10,
    flexGrow: 0,
    fontSize: 12,
    paddingLeft: 50,
    paddingRight: 50,
  },
  intro2: {
    marginTop: 10,
    marginBottom: 10,
    flexGrow: 0,
    fontSize: 12,
    textDecoration: 'underline',
    paddingLeft: 10,
    paddingRight: 10,
  },
  content: {
    marginTop: 6,
    marginBottom: 6,
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
  },
  spacer: {
    flexGrow: 1,
  },
  date: {
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
  },
  mark: {
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  sign: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  left: {
    flexBasis: 1,
    flexGrow: 1,
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
  },
  right: {
    flexBasis: 1,
    flexGrow: 1,
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
  },
});

// Create Document Component
export function StudentDocument({
  student,
  chapters,
  selected,
  school,
  date,
  customText,
}: Omit<DocProps, 'onDone'>) {
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
        s.push(gender(sentence, student.Geschlecht === 'm'));
      }
    }),
  );

  // console.log(date);
  const d = new Date(date);
  const year = format(d, 'yyyy');
  const yearShort = format(d, 'yy');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {school.logo && <Image src={school.logo} />}
        {school.logo && (
          <View style={styles.year}>
            <Text>Schuljahr</Text>
            <Text>
              {`${parseInt(year) - 1}`}/{yearShort}
            </Text>
          </View>
        )}
        <View style={styles.h1}>
          <Text>Ergänzende differenzierende</Text>
          <Text>Leistungsbeschreibung</Text>
        </View>
        <View style={styles.h2}>
          <Text>
            für {student.Vorname} {student.Familienname}
          </Text>
        </View>
        <View style={styles.intro}>
          <Text>
            geboren am {student.Geburtsdatum},{' '}
            {student.Geschlecht === 'm' ? 'Schüler' : 'Schülerin'} der{' '}
            {student.Klasse} Klasse der {school.name}.
          </Text>
        </View>
        <View style={styles.intro2}>
          <Text>
            Du zeichnest dich, unabhängig von deinen fachlichen Leistungen,
            besonders durch folgende Stärken aus:
          </Text>
        </View>
        {s.map((l, i) => (
          <View key={i} style={styles.content}>
            <Text>{l}</Text>
          </View>
        ))}
        {customText && (
          <View style={styles.content}>
            <Text>{customText}</Text>
          </View>
        )}
        <View style={styles.spacer}></View>
        <View style={styles.date}>
          <Text>
            {school.city ? `${school.city}, am ` : ''}
            {format(d, 'd. MMMM yyyy', { locale: de })}
          </Text>
        </View>
        <View style={styles.mark}>
          <Text>Rundstempel</Text>
        </View>
        <View style={styles.sign}>
          <View style={styles.left}>
            <Text>_______________________</Text>
            <Text>Schulleiter/in</Text>
          </View>
          <View style={styles.right}>
            <Text>_______________________</Text>
            <Text>Klassenvorstand</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export function StudentPDFDownload({ student, onDone, ...rest }: DocProps) {
  const onClick = useCallback(() => {
    const instance = pdf(<StudentDocument student={student} {...rest} />);
    instance.toBlob().then(blob => {
      saveAs(
        blob,
        `${student.Klasse.replace('.', '')}_${student.Familienname}_${
          student.Vorname
        }.pdf`,
      );
      onDone();
    });
  }, [onDone, rest, student]);

  return (
    <Button
      primary
      onClick={onClick}
      label={'PDF erstellen'}
      icon={<DocumentPdf />}
    />
  );
}
