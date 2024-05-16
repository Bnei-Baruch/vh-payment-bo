import React from "react";

import Dialog from "@material-ui/core/Dialog";
import { useTranslation } from "react-i18next";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

import "./styles.css";
import { useData } from "./useData";

export const HelpRequestDetails = ({
  id,
  type,
  page,
  useModal,
  rowsPerPage,
}) => {
  const { t } = useTranslation();
  const {
    TABS,
    period,
    setPeriod,
    STATUSES,
    status,
    onChangeStatus,
    currentTab,
    requestInfo,
    setCurrentTab,
    onPressUpdate,
    rejectionNote,
    isDisabledBtn,
    setRejectionNote,
    requestorDetails,
  } = useData(id, useModal, page, rowsPerPage);

  const renderSwitcherTabs = () => {
    const notRejected = status !== "rejected";

    if (currentTab === "request") {
      return (
        <div className="s-tab">
          <div className="title">{t("HelpHaver.request")}</div>
          <div className="subtitle">{t("HelpHaver.descOfTheSituation")}</div>
          <div className="description">{requestInfo?.request_note}</div>
          {requestInfo?.nb_month && (
            <>
              <div className="subtitle">{t("HelpHaver.requestedDuration")}</div>
              <div className="duration">{requestInfo?.nb_month} months</div>
            </>
          )}
          <div className="title">{t("HelpHaver.status")}</div>
          <div className="action-row">
            <div>
              {STATUSES.map(({ value, label }) => (
                <div
                  key={value}
                  className="status"
                  onClick={() => onChangeStatus(value)}
                >
                  <div
                    className={`checkbox ${status === value ? "active" : ""}`}
                  />
                  {t(label)}
                </div>
              ))}
            </div>
            {type === "membership" && (
              <div
                className={`options ${status === "approved" ? "active" : ""}`}
              >
                <div className="field-wrapper">
                  <div className="field-label">{t("HelpHaver.months")}</div>

                  <div className="select-wrapper">
                    <select
                      disabled={status !== "approved"}
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      {Array(12)
                        .fill("")
                        .map((_, idx) => {
                          const value = idx + 1;
                          return (
                            <option key={idx} value={value}>
                              {value}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
                {/* <div className="field-wrapper">
                  <div className="field-label">{t("HelpHaver.grant")}</div>
                  <input type="number" />
                </div>
                <div className="field-wrapper">
                  <div className="field-label">{t("HelpHaver.loan")}</div>
                  <input type="number" />
                </div> */}
              </div>
            )}
          </div>
          <div className={`title ${notRejected ? "disabled" : ""}`}>
            {t("HelpHaver.note")}
          </div>
          <textarea
            value={rejectionNote}
            disabled={notRejected}
            onChange={(v) => setRejectionNote(v.target.value)}
            className={notRejected ? "disabled" : ""}
          />
          <div className="buttons-row">
            <div
              onClick={onPressUpdate}
              className={`button ${isDisabledBtn ? "disabled" : ""}`}
            >
              {t("HelpHaver.update")}
            </div>
          </div>
        </div>
      );
    }

    if (currentTab === "personalInfo") {
      return (
        <div className="s-tab">
          <div className="title">{t("HelpHaver.personalInfo")}</div>
          <div className="info-wrapper">
            <div className="info-column">
              <div className="label">{t("HelpHaver.firstName")}</div>
              <div className="value">
                {requestorDetails?.first_name_vernacular}
              </div>

              {requestorDetails?.mobile_number && (
                <>
                  <div className="label">{t("HelpHaver.phone")}</div>
                  <div className="value">{requestorDetails?.mobile_number}</div>
                </>
              )}

              <div className="label">{t("HelpHaver.tenName")}</div>
              <div className="value">{requestorDetails?.name_ten_group}</div>

              <div className="label">{t("HelpHaver.firstLanguage")}</div>
              <div className="value">{requestorDetails?.first_language}</div>

              {requestorDetails?.date_of_birth && (
                <>
                  <div className="label">{t("HelpHaver.dateOfBirth")}</div>
                  <div className="value">{requestorDetails?.date_of_birth}</div>
                </>
              )}
            </div>
            <div className="info-column">
              <div className="label">{t("HelpHaver.lastName")}</div>
              <div className="value">
                {requestorDetails?.last_name_vernacular}
              </div>

              <div className="label">{t("HelpHaver.email")}</div>
              <div className="value">{requestorDetails?.primary_email}</div>

              <div className="label">{t("HelpHaver.gender")}</div>
              <div className="value">{requestorDetails?.gender}</div>

              <div className="label">{t("HelpHaver.country")}</div>
              <div className="value">{requestorDetails?.country}</div>
            </div>
          </div>
          <div className="title">{t("Membership.name")}</div>
          <div className="membership-status">
            {requestorDetails?.status?.membership_type}
          </div>
        </div>
      );
    }

    return (
      <div className="s-tab">
        <div className="title">{t("HelpHaver.notifications")}</div>
        <div className="action-row">
          <div className="status">
            <div className="checkbox active" />
            User Notification Status update
          </div>
        </div>
        <div className="button-wrapper">
          <div className="button primary-btn disabled">
            {t("HelpHaver.sendNotification")}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={useModal.isVisible} onClose={useModal.hideModal}>
      <div className="hrd-container">
        <div className="header-row">
          <h4>
            {currentTab === "request"
              ? t("HelpHaver.detailsOfHelpHaverApp")
              : t("HelpHaver.detailsOfHelpHaverRequest")}
          </h4>
          <HighlightOffIcon
            className="close-btn"
            onClick={useModal.hideModal}
          />
        </div>

        <div className="switch">
          {TABS.map(({ value, label }) => (
            <div
              key={value}
              onClick={() => setCurrentTab(value)}
              className={value === currentTab ? "active" : ""}
            >
              {t(label)}
            </div>
          ))}
        </div>
        {renderSwitcherTabs()}
      </div>
    </Dialog>
  );
};
