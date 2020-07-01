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
import { Box, RadioButtonGroup, CheckBox, Heading } from 'grommet';
import { push } from 'connected-react-router';
import { Container } from './components';

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
          <Heading level={2}>Schüler</Heading>
          <RadioButtonGroup
            name="radio"
            options={state.students.map(s => ({
              label: `${s.Familienname} ${s.Vorname}`,
              value: s.id,
            }))}
            value={state.active ? state.active.id : undefined}
            onChange={event => dispatch(actions.setActive(event.target.value))}
            {...props}
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
        {state.active && (
          <Box align={'center'}>
            <StudentPDFDownload
              student={state.active}
              chapters={state.chapters}
              selected={state.selected}
            />
          </Box>
        )}
      </Container>
    </>
  );
}
