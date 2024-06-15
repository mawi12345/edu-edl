/**
 *
 * SelectPage
 *
 */

import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectAppState, gender, selectText } from "../selectors";
import { actions } from "../slice";
import {
  Box,
  Button,
  RadioButtonGroup,
  CheckBox,
  Heading,
  Calendar,
  Anchor,
  TextArea,
} from "grommet";
import { schools } from "../school";
import { StudentPDFDownload } from "../print";
import styled from "styled-components";
import { useAppDispatch } from "../../store";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 22px;
`;

interface Props {}

export function SelectPage(props: Props) {
  const translation = useTranslation();
  const { t } = translation;
  const dispatch = useAppDispatch();
  const state = useSelector(selectAppState);
  const text = useSelector(selectText);

  return (
    <>
      <Helmet>
        <title>{t("heading")}</title>
      </Helmet>
      <Container
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Box pad="medium">
          <Heading level={3}>Schule</Heading>
          <RadioButtonGroup
            name="radio"
            options={schools.map((s) => ({
              label: `${s.name}${s.city ? ` (${s.city})` : ""}`,
              value: s.id,
            }))}
            value={state.school ? state.school.id : undefined}
            onChange={(event) =>
              dispatch(
                actions.setSchool(
                  schools.find((s) => s.id === event.target.value)!
                )
              )
            }
          />
          <Anchor
            margin={{ top: "20px" }}
            target={"blank"}
            href={
              "https://github.com/mawi12345/edu-edl/issues/new?title=Neue%20Schule%20einf%C3%BCgen&body=Bitte%20f%C3%BCge%20folgende%20neue%20Schule%20ein:"
            }
          >
            Neue Schule beantragen
          </Anchor>
        </Box>
        <Box pad="medium">
          <Heading level={3}>Zeugnisdatum</Heading>
          <Calendar
            date={state.date}
            onSelect={(nextDate) =>
              dispatch(actions.setDate(nextDate as string))
            }
            size="small"
          />
        </Box>
        <Box pad="medium">
          <Heading id={"students"} level={3}>
            Schüler
          </Heading>
          <RadioButtonGroup
            name="radio"
            options={state.students.map((s) => ({
              label: `${s.Familienname} ${s.Vorname}`,
              value: s.id,
            }))}
            value={state.active ? state.active.id : undefined}
            onChange={(event) =>
              dispatch(actions.setActive(event.target.value))
            }
          />
        </Box>
        <Box pad="medium">
          <Heading id={"students"} level={3}>
            Modus
          </Heading>
          <RadioButtonGroup
            name="radio"
            options={[
              { value: "quick", label: "Schnell" },
              { value: "custom", label: "Individuell" },
            ]}
            value={state.mode}
            onChange={(event) =>
              dispatch(actions.setMode(event.target.value as any))
            }
          />
        </Box>
        {state.mode === "custom" && (
          <>
            {state.chapters.map((chapter, chapterIndex) => (
              <Box key={chapterIndex} pad="medium">
                <Heading level={3}>{chapter.name}</Heading>
                {chapter.sentences.map((sentence, sentencesIndex) => (
                  <Box key={sentencesIndex} pad={{ vertical: "small" }}>
                    <CheckBox
                      label={gender(
                        sentence,
                        state.active ? state.active.Geschlecht === "m" : false
                      )}
                      checked={
                        state.selected.find(
                          (s) =>
                            s.chapterIndex === chapterIndex &&
                            s.sentencesIndex === sentencesIndex
                        ) !== undefined
                      }
                      onChange={(event) => {
                        if (event.target.checked) {
                          dispatch(
                            actions.select({ chapterIndex, sentencesIndex })
                          );
                        } else {
                          dispatch(
                            actions.unselect({ chapterIndex, sentencesIndex })
                          );
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </>
        )}
        {state.mode === "quick" && (
          <Box direction="row">
            <Box pad={{ horizontal: "medium" }}>
              {state.chapters.map((chapter, chapterIndex) => (
                <Box key={chapterIndex} pad={{ vertical: "xsmall" }}>
                  <CheckBox
                    label={gender(
                      chapter.name,
                      state.active ? state.active.Geschlecht === "m" : false
                    )}
                    checked={
                      state.selected.find(
                        (s) => s.chapterIndex === chapterIndex
                      ) !== undefined
                    }
                    onChange={(event) => {
                      if (event.target.checked) {
                        dispatch(actions.selectChapter(chapterIndex));
                      } else {
                        dispatch(actions.unselectChapter(chapterIndex));
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
            <Box pad="small">
              {text.map((s, i) => <span key={i}>{s}</span>)}
            </Box>
          </Box>
        )}
        <Box pad="medium">
          <Heading level={3}>Individueller Text</Heading>
          <TextArea
            rows={8}
            placeholder="Du bist ..."
            value={state.customText || ""}
            onChange={(event) =>
              dispatch(actions.setCustomText(event.target.value))
            }
          />
        </Box>
        {state.mode !== undefined &&
          state.active &&
          state.date !== undefined &&
          state.school !== undefined && (
            <Box align={"center"} pad="small">
              <StudentPDFDownload
                school={state.school}
                date={state.date}
                student={state.active}
                chapters={state.chapters}
                selected={state.selected}
                customText={state.customText}
                onDone={() => dispatch(actions.printed())}
              />
            </Box>
          )}
        {state.active &&
          state.printed &&
          state.date !== undefined &&
          state.school !== undefined && (
            <Box align={"center"} pad="small">
              <Button
                disabled={
                  state.students[state.students.length - 1].id ===
                  state.active.id
                }
                secondary
                onClick={() => {
                  dispatch(actions.nextStudent());
                  window.scrollTo(0, window.innerWidth > 768 ? 792 : 647);
                }}
                label={"Nächster Schüler"}
              />
            </Box>
          )}
      </Container>
    </>
  );
}
