/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import {
  cancelHHGrantEntry,
  concludeHHRequestEntry,
  fetchRequestorDetails,
} from "../../../redux/actions/helpHaverActions";

export const STATUSES = ["approved", "denied"];
export const HH_GRANT_TYPES = ["hh-hayal", "hh-gimlaj", "hh-other"];
export const HH_MONTHS = [...Array(12)].map((_, i) => i + 1);

export const isGrantActive = (grant) =>
  !!grant &&
  moment(grant.start_date).isBefore(moment()) &&
  moment(grant.end_date).isAfter(moment());

export const useData = (useModal, request) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [finalType, setFinalType] = useState("");
  const [finalPct, setFinalPct] = useState("");
  const [finalMonths, setFinalMonths] = useState("");
  const [finalStartDate, setFinalStartDate] = useState("");
  const [rejectionNote, setRejectionNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { hhRequests, requestorDetails } = useSelector(
    (state) => state.helpHaverReducer
  );

  const isConcluded = request?.status !== "REQUESTED";

  // Other applications by the same member, for the history panel.
  const history = useMemo(
    () =>
      hhRequests.list.filter(
        (r) => r.keycloak_id === request?.keycloak_id && r.id !== request?.id
      ),
    [hhRequests.list, request]
  );

  useEffect(() => {
    if (!useModal.isVisible || !request) return;
    setStatus("");
    setFinalType(request.type);
    setFinalPct(String(request.requested_pct));
    setFinalMonths(String(request.months));
    setFinalStartDate(new Date().toISOString().split("T")[0]); // default: today
    setRejectionNote("");
    dispatch(fetchRequestorDetails(request.keycloak_id));
  }, [useModal.isVisible, request]);

  const isDisabledBtn =
    isConcluded ||
    !status ||
    (status === "approved" && (!finalType || !finalPct || !finalMonths || !finalStartDate));

  const onPressUpdate = () => {
    if (isDisabledBtn || loading) return;
    setLoading(true);

    const payload =
      status === "approved"
        ? {
            approved: true,
            type: finalType,
            discount_pct: parseInt(finalPct, 10),
            months: parseInt(finalMonths, 10),
            start_date: new Date(finalStartDate).toISOString(),
            note: request.note || undefined,
          }
        : { approved: false, rejection_note: rejectionNote || undefined };

    dispatch(concludeHHRequestEntry(request.id, payload, () => {
      setLoading(false);
      useModal.hideModal();
    }, () => setLoading(false)));
  };

  const onCancelGrant = () => {
    dispatch(cancelHHGrantEntry(request.keycloak_id, useModal.hideModal));
  };

  return {
    status,
    setStatus,
    finalType,
    setFinalType,
    finalPct,
    setFinalPct,
    finalMonths,
    setFinalMonths,
    finalStartDate,
    setFinalStartDate,
    rejectionNote,
    setRejectionNote,
    loading,
    history,
    isConcluded,
    isDisabledBtn,
    onPressUpdate,
    onCancelGrant,
    requestorDetails,
  };
};
