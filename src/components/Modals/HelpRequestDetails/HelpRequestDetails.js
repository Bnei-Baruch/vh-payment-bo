import React, { useState } from "react";

import Dialog from "@material-ui/core/Dialog";
import { useTranslation } from "react-i18next";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

import "./styles.css";
import { useData } from "./useData";

const HH_TYPE_VALUES = { hh_hayal: "hh_hayal", hh_gimlaj: "hh_gimlaj", hh_other: "hh_other" };

function displayHHType(type, t) {
  if (!type) return "—";
  const normalized = type.replace("hh-", "hh_");
  switch (normalized) {
    case HH_TYPE_VALUES.hh_hayal:  return t("HelpHaver.hhTypeHayal");
    case HH_TYPE_VALUES.hh_gimlaj: return t("HelpHaver.hhTypeGimlaj");
    case HH_TYPE_VALUES.hh_other:  return t("HelpHaver.hhTypeOther");
    default: return "—";
  }
}

function formatHistoryDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function historyRowSummary(item, t) {
  const req = item.Request;
  const grant = item.Grant;
  const status = req.status?.toLowerCase();
  if (status === "approved") {
    const props = grant?.properties ?? {};
    const typePart = props.type ? displayHHType(props.type, t) : null;
    const monthsPart = props.months ? `${props.months}mo` : null;
    const discountPart = props.discount_pct != null ? `${props.discount_pct}%` : null;
    const parts = [typePart, monthsPart, discountPart].filter(Boolean);
    return parts.length > 0 ? parts.join(" · ") : "—";
  }
  if (status === "denied" || status === "rejected") {
    return req.rejection_note || req.request_note || "—";
  }
  return req.request_note || "—";
}

function historyRowTooltip(item) {
  const req = item.Request;
  const parts = [];
  if (req.request_note) parts.push(`Request: ${req.request_note}`);
  if (req.rejection_note) parts.push(`Note: ${req.rejection_note}`);
  return parts.join("\n") || undefined;
}

export const HelpRequestDetails = ({
  id,
  type,
  page,
  useModal,
  rowsPerPage,
}) => {
  const { t } = useTranslation();
  const [expandedIds, setExpandedIds] = useState(new Set());
  const toggleExpand = (reqId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(reqId)) next.delete(reqId);
      else next.add(reqId);
      return next;
    });
  };
  const {
    period,
    setPeriod,
    hhType,
    setHhType,
    discountPct,
    setDiscountPct,
    STATUSES,
    status,
    onChangeStatus,
    requestInfo,
    onPressUpdate,
    rejectionNote,
    isDisabledBtn,
    isStatusLocked,
    setRejectionNote,
    requestorDetails,
    userRequestHistory,
  } = useData(id, useModal, page, rowsPerPage);

  const notRejected = status !== "rejected";

  return (
    <Dialog open={useModal.isVisible} onClose={useModal.hideModal}>
      <div className="hrd-container">
        <div className="header-row">
          <h4>{t("HelpHaver.detailsOfHelpHaverApp")}</h4>
          <HighlightOffIcon
            className="close-btn"
            onClick={useModal.hideModal}
          />
        </div>

        <div className="hrd-body">
          {/* Left column: personal info + notifications */}
          <div className="hrd-left-col s-tab">
            <div className="title">{t("HelpHaver.personalInfo")}</div>
            <div className="info-wrapper">
              <div className="info-column">
                <div className="label">{t("HelpHaver.firstName")}</div>
                <div className="value">{requestorDetails?.first_name_vernacular}</div>

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
                <div className="value">{requestorDetails?.last_name_vernacular}</div>

                <div className="label">{t("HelpHaver.email")}</div>
                <div className="value">{requestorDetails?.primary_email}</div>

                <div className="label">{t("HelpHaver.gender")}</div>
                <div className="value">{requestorDetails?.gender}</div>

                <div className="label">{t("HelpHaver.country")}</div>
                <div className="value">{requestorDetails?.country}</div>
              </div>
            </div>
            <hr className="hrd-separator" />
            <div className="title">{t("HelpHaver.requestHistory")}</div>
            {userRequestHistory.length === 0 ? (
              <div className="hrd-history-empty">—</div>
            ) : (
              <div className="hrd-history">
                {userRequestHistory.filter((item) => item.Request.id !== id).map((item) => {
                  const req = item.Request;
                  const grant = item.Grant;
                  const s = req.status?.toLowerCase();
                  const normalizedStatus = s === "denied" ? "rejected" : s;
                  const isExpanded = expandedIds.has(req.id);
                  const hasNotes = !!(req.request_note || req.rejection_note);
                  const summary = historyRowSummary(item, t);
                  const grantStatus = (() => {
                    if (grant?.id == null) return null;
                    if (grant.cancelled_at) return "cancelled";
                    const months = grant.properties?.months;
                    if (months && grant.created_at) {
                      const expiry = new Date(grant.created_at);
                      expiry.setMonth(expiry.getMonth() + months);
                      if (expiry < new Date()) return "expired";
                    }
                    return "active";
                  })();
                  return (
                    <div
                      key={req.id}
                      className={`hrd-history-row${hasNotes ? " clickable" : ""}`}
                      onClick={hasNotes ? () => toggleExpand(req.id) : undefined}
                    >
                      <div className="hrd-history-main">
                        <span className="hrd-history-date">{formatHistoryDate(req.created_at)}</span>
                        <span className={`hrd-history-badge ${normalizedStatus}`}>{normalizedStatus}</span>
                        <span className="hrd-history-summary">
                          {summary}
                          {grantStatus && <span className={`grant-status ${grantStatus}`}> [{grantStatus}]</span>}
                        </span>
                        {hasNotes && (
                          <span className="hrd-history-chevron">
                            {isExpanded ? "▾" : "▸"}
                          </span>
                        )}
                      </div>
                      {hasNotes && isExpanded && (
                        <div className="hrd-history-notes">
                          {req.request_note && (
                            <div className="hrd-history-note">
                              <div
                                className="hrd-history-note-body"
                                title={req.request_note}
                              >
                                <span className="hrd-history-note-label">Request: </span>
                                {req.request_note}
                              </div>
                            </div>
                          )}
                          {req.rejection_note && (
                            <div className="hrd-history-note">
                              <div
                                className="hrd-history-note-body"
                                title={req.rejection_note}
                              >
                                <span className="hrd-history-note-label">Note: </span>
                                {req.rejection_note}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <hr className="hrd-separator" />
            <div className="title">{t("Membership.name")}</div>
            <div className="membership-status">{requestorDetails?.membership_type}</div>
          </div>

          {/* Right column: request */}
          <div className="hrd-right-col s-tab">
            <div className="title">{t("HelpHaver.request")}</div>
            <div className="subtitle">
              {requestInfo?.created_at
                ? new Date(requestInfo.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                : "—"}
            </div>
            <div className="subtitle">{t("HelpHaver.descOfTheSituation")}</div>
            <div className="description">{requestInfo?.request_note}</div>

            <div className="title">{t("HelpHaver.status")}</div>
            <div className={`action-row${isStatusLocked ? " disabled" : ""}`}>
              <div>
                {STATUSES.map(({ value, label }) => (
                  <div
                    key={value}
                    className="status"
                    onClick={() => onChangeStatus(value)}
                  >
                    <div className={`checkbox ${status === value ? "active" : ""}`} />
                    {t(label)}
                  </div>
                ))}
              </div>
            </div>

            {type === "membership" && (
              <div className={`request-fields ${status === "approved" ? "active" : ""}`}>
                <div className="rf-row rf-header">
                  <div />
                  <div className="rf-col-label">{t("HelpHaver.requested")}</div>
                  <div className="rf-col-label">{t("HelpHaver.final")}</div>
                </div>
                <div className="rf-row">
                  <div className="rf-field-label">{t("HelpHaver.type")}</div>
                  <div className="rf-value">{displayHHType(requestInfo?.type, t)}</div>
                  <div className="select-wrapper">
                    <select
                      disabled={status !== "approved" || isStatusLocked}
                      value={hhType}
                      onChange={(e) => setHhType(e.target.value)}
                    >
                      <option value="">—</option>
                      <option value={HH_TYPE_VALUES.hh_gimlaj}>{t("HelpHaver.hhTypeGimlaj")}</option>
                      <option value={HH_TYPE_VALUES.hh_hayal}>{t("HelpHaver.hhTypeHayal")}</option>
                      <option value={HH_TYPE_VALUES.hh_other}>{t("HelpHaver.hhTypeOther")}</option>
                    </select>
                  </div>
                </div>
                <div className="rf-row">
                  <div className="rf-field-label">{t("HelpHaver.months")}</div>
                  <div className="rf-value">{requestInfo?.properties?.months ?? "—"}</div>
                  <div className="select-wrapper">
                    <select
                      disabled={status !== "approved" || isStatusLocked}
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      <option value="">—</option>
                      {Array(12).fill("").map((_, idx) => (
                        <option key={idx} value={idx + 1}>{idx + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="rf-row">
                  <div className="rf-field-label">{t("HelpHaver.discountPct")}</div>
                  <div className="rf-value">
                    {requestInfo?.properties?.discount_pct != null ? `${requestInfo.properties.discount_pct}%` : "—"}
                  </div>
                  <div className="select-wrapper">
                    <select
                      disabled={status !== "approved" || isStatusLocked}
                      value={discountPct}
                      onChange={(e) => setDiscountPct(e.target.value)}
                    >
                      <option value="">—</option>
                      <option value={25}>25%</option>
                      <option value={50}>50%</option>
                      <option value={75}>75%</option>
                      <option value={100}>100%</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

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
        </div>
      </div>
    </Dialog>
  );
};
