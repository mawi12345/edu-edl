import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectAppState, gender } from "../selectors";
import { actions } from "../slice";
import { DocumentText } from "grommet-icons";
import {
  Box,
  Button,
  RadioButtonGroup,
  CheckBox,
  Heading,
  Calendar,
  Anchor,
  TextArea,
  Pagination,
  Header,
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

interface SelectProps {
  openFileDialog: () => void;
}

export function SelectPage({ openFileDialog }: SelectProps) {
  const translation = useTranslation();
  const { t } = translation;
  const dispatch = useAppDispatch();
  const state = useSelector(selectAppState);

  return (
    <>
      <Helmet>
        <title>{t("heading")}</title>
      </Helmet>
      <Header background="brand">
        <Box direction="row" align="center" pad={{ horizontal: "medium" }}>
          <DocumentText size="large" />
          <Heading level={2} margin={"medium"}>
            {t("heading")}
          </Heading>
        </Box>
        <Box direction="row" align="center" pad={{ horizontal: "medium" }}>
          <Button secondary label={t("selectDifferentFile")} onClick={openFileDialog} />
        </Box>
      </Header>
      <Container>
        <Box direction="row" wrap>
          <Box pad="medium" width="large">
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
              firstDayOfWeek={1}
              daysOfWeek
              locale="de"
              date={state.date}
              onSelect={(nextDate) =>
                dispatch(actions.setDate(nextDate as string))
              }
              size="small"
            />
          </Box>
        </Box>
        <Box direction="row" wrap>
          <Box pad="medium" width="large">
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
            {state.active && (
              <>
                <Heading id={"gender"} level={3}>
                  Geschlecht
                </Heading>
                <RadioButtonGroup
                  name="radio"
                  options={[
                    { value: "w", label: "weiblich" },
                    { value: "m", label: "männlich" },
                  ]}
                  value={state.active.Geschlecht}
                  onChange={(event) =>
                    dispatch(actions.setActiveGender(event.target.value as any))
                  }
                />
              </>
            )}
            <Heading id={"mode"} level={3}>
              Bearbeitungsmodus
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
          <Box pad={{ horizontal: "medium" }}>
            <Heading id={"students"} level={3}>
              Positive Eigenschaften
            </Heading>
            {state.chapters.map((chapter, chapterIndex) => {
              const selected = state.selected.find(
                (s) => s.chapterIndex === chapterIndex
              );
              return (
                <Box direction="row">
                  <Box
                    key={chapterIndex}
                    pad={{ vertical: "xsmall" }}
                    width="medium"
                    justify="center"
                  >
                    <CheckBox
                      label={gender(
                        chapter.name,
                        state.active ? state.active.Geschlecht === "m" : false
                      )}
                      checked={selected !== undefined}
                      onChange={(event) => {
                        if (event.target.checked) {
                          dispatch(actions.selectChapter(chapterIndex));
                        } else {
                          dispatch(actions.unselectChapter(chapterIndex));
                        }
                      }}
                    />
                  </Box>
                  <Box width="medium" justify="center">
                    {selected && (
                      <Pagination
                        size="small"
                        numberEdgePages={0}
                        step={1}
                        numberItems={chapter.sentences.length}
                        page={selected.sentencesIndex + 1}
                        onChange={(e) =>
                          dispatch(
                            actions.selectSingle({
                              chapterIndex,
                              sentencesIndex: e.page - 1,
                            })
                          )
                        }
                      />
                    )}
                  </Box>
                  <Box pad={{ vertical: "xsmall" }} width="large">
                    {state.selected
                      .filter((s) => s.chapterIndex === chapterIndex)
                      .map((s) =>
                        gender(
                          chapter.sentences[s.sentencesIndex],
                          state.active ? state.active.Geschlecht === "m" : false
                        )
                      )
                      .join(" ")}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
        <Box pad="medium">
          <Heading level={3}>Individueller Text</Heading>
          <TextArea
            rows={8}
            placeholder="Deine Fähigkeit, Grenzen zu testen, weist auf ein starkes Gefühl für eigene Unabhängigkeit hin."
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
