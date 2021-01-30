/**
 *
 * SelectPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { selectAppState, gender } from '../../selectors';
import { actions } from '../../slice';
import {
  Box,
  RadioButtonGroup,
  CheckBox,
  Heading,
  Calendar,
  Anchor,
  TextArea,
} from 'grommet';
import { push } from 'connected-react-router';
import { Container } from './components';
import { schools } from 'app/school';

import { StudentPDFDownload } from './print';

interface Props {}

export function SelectPage(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const translation = useTranslation();
  const { t } = translation;
  const dispatch = useDispatch();
  const state = useSelector(selectAppState);

  // redirect if no data is available
  useEffect(() => {
    if (!state.error && state.students.length === 0) {
      dispatch(push('/'));
    }
  }, [state, dispatch]);

  return (
    <>
      <Helmet>
        <title>{t('heading')}</title>
      </Helmet>
      <Container
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Box pad="medium">
          <Heading level={3}>Schule</Heading>
          <RadioButtonGroup
            name="radio"
            options={schools.map(s => ({
              label: `${s.name}${s.city ? ` (${s.city})` : ''}`,
              value: s.id,
            }))}
            value={state.school ? state.school.id : undefined}
            onChange={event =>
              dispatch(
                actions.setSchool(
                  schools.find(s => s.id === event.target.value)!,
                ),
              )
            }
          />
          <Anchor
            margin={{ top: '20px' }}
            target={'blank'}
            href={
              'https://github.com/mawi12345/edu-edl/issues/new?title=Neue%20Schule%20einf%C3%BCgen&body=Bitte%20f%C3%BCge%20folgende%20neue%20Schule%20ein:'
            }
          >
            Neue Schule beantragen
          </Anchor>
        </Box>
        <Box pad="medium">
          <Heading level={3}>Zeugnisdatum</Heading>
          <Calendar
            date={state.date}
            onSelect={nextDate => dispatch(actions.setDate(nextDate))}
            size="small"
          />
        </Box>
        <Box pad="medium">
          <Heading level={3}>Schüler</Heading>
          <RadioButtonGroup
            name="radio"
            options={state.students.map(s => ({
              label: `${s.Familienname} ${s.Vorname}`,
              value: s.id,
            }))}
            value={state.active ? state.active.id : undefined}
            onChange={event => dispatch(actions.setActive(event.target.value))}
          />
        </Box>
        {state.chapters.map((chapter, chapterIndex) => (
          <Box key={chapterIndex} pad="medium">
            <Heading level={3}>{chapter.name}</Heading>
            {chapter.sentences.map((sentence, sentencesIndex) => (
              <Box key={sentencesIndex} pad={{ vertical: 'small' }}>
                <CheckBox
                  label={gender(
                    sentence,
                    state.active ? state.active.Geschlecht === 'm' : false,
                  )}
                  checked={
                    state.selected.find(
                      s =>
                        s.chapterIndex === chapterIndex &&
                        s.sentencesIndex === sentencesIndex,
                    ) !== undefined
                  }
                  onChange={event => {
                    if (event.target.checked) {
                      dispatch(
                        actions.select({ chapterIndex, sentencesIndex }),
                      );
                    } else {
                      dispatch(
                        actions.unselect({ chapterIndex, sentencesIndex }),
                      );
                    }
                  }}
                />
              </Box>
            ))}
          </Box>
        ))}
        <Box pad="medium">
          <Heading level={3}>Individueller Text</Heading>
          <TextArea
            rows={8}
            placeholder="Du bist ..."
            value={state.customText || ''}
            onChange={event =>
              dispatch(actions.setCustomText(event.target.value))
            }
          />
        </Box>
        {state.active &&
          state.date !== undefined &&
          state.school !== undefined && (
            <Box align={'center'}>
              <StudentPDFDownload
                school={state.school}
                date={state.date}
                student={state.active}
                chapters={state.chapters}
                selected={state.selected}
                customText={state.customText}
              />
            </Box>
          )}
      </Container>
    </>
  );
}
